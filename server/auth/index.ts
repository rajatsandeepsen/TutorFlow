import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "env";
import { createDB, type CreatedDB } from "@/server/db";
import { schema } from "@/server/db/schema";
import type { WaitUntil } from "../types";

export const trustedOrigins = [env.CORS_ORIGIN ?? ""].filter(
	(o) => o.length > 0,
);

export const createAuth = (
	baseURL: string,
	waitUntil: WaitUntil,
) =>
	betterAuth({
		secret: env.AUTH_SECRET,
		baseURL,
		session: {
			cookieCache: {
				enabled: true,
				maxAge: 5 * 60, // Cache duration in seconds
			},
		},
		trustedOrigins,
		database: drizzleAdapter(createDB(), {
			provider: "pg",
			schema,
		}),
		emailAndPassword: {
			enabled: true,
		},

		onAPIError: {
			errorURL: "/error",
		},
		plugins: [],
	});

export type AUTH = ReturnType<typeof createAuth>;
export type USER = typeof schema.user.$inferSelect;
export type SESSION = AUTH["$Infer"]["Session"];
