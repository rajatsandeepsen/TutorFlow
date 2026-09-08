import { ORPCError, onError, ValidationError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { env } from "env";
import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import z from "zod";
import { triedAsync } from "@/lib/tools";
import { appRouter } from "@/server/api";
import { createContext, createVar } from "@/server/api/context";
import { createAuth } from "@/server/auth";
import { createDB } from "@/server/db";
import cron from "./cron";
import type { HonoType } from "./types";

const app = new Hono<HonoType>({
	strict: false,
}).basePath("/api");

app.use(logger());
app.use(
	"/*",
	cors({
		origin: env.CORS_ORIGIN || "",
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.get("/", (c) => {
	return c.text("Hello");
});

app.use(
	createVar("waitUntil", (c) => {
		return (p: Promise<unknown>) => {
			if (!c.executionCtx || c.executionCtx.waitUntil === undefined) {
				return triedAsync(p)
				// throw new Error("No execution context waitUntil available");
			}
			c.executionCtx.waitUntil(triedAsync(p, "Inside waitUntil"));
		};
	}),
);

app.use(createVar("db", () => createDB()));

app.use(
	createVar("auth", (c) => {
		const baseURL = new URL(c.req.url).origin;
		return createAuth(baseURL, c.var.waitUntil);
	}),
);

app.all("/auth/*", (c: Context<HonoType>) => {
	const auth = c.get("auth");
	const rawReq = c.req.raw;
	const normalizedURL = new URL(rawReq.url);
	const pathname = normalizedURL.pathname;

	if (pathname.length > 1 && pathname.endsWith("/")) {
		normalizedURL.pathname = pathname.slice(0, -1);
		const normalizedReq = new Request(normalizedURL.toString(), rawReq);
		return auth.handler(normalizedReq);
	}

	return auth.handler(rawReq);
});

app.use("/*", async (c, next) => {
	const handler = new RPCHandler(appRouter, {
		clientInterceptors: [
			onError((error) => {
				if (
					error instanceof ORPCError &&
					error.cause instanceof ValidationError &&
					error.code === "BAD_REQUEST"
				) {
					const zodError = new z.ZodError(
						error.cause.issues as z.core.$ZodIssue[],
					);

					throw new ORPCError("INPUT_VALIDATION_FAILED", {
						status: 422,
						message: zodError.issues.map((i) => i.message).join("\n"),
						data: z.flattenError(zodError),
						cause: error.cause,
					});
				}

				console.error(error);
			}),
		],
	});

	const context = await createContext(c);

	const { matched, response } = await handler.handle(c.req.raw, {
		prefix: "/api",
		context,
	});

	if (matched) {
		return c.newResponse(response.body, response);
	}
	await next();
});

export default {
	fetch: app.fetch,
	scheduled: cron.scheduled,
};
