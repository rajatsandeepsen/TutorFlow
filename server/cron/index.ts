import { Cron } from "kuron";
import { triedAsync } from "@/lib/tools";
import { createDB } from "../db";
import type { HonoType } from "../types";
import { createCronVar } from "./utils";
import { env } from "@/lib/env";

const cron = new Cron<HonoType>();

cron.use(
	createCronVar("waitUntil", (c) => {
		return (p: Promise<unknown>) => {
			if (!c.executionCtx || c.executionCtx.waitUntil === undefined) {
				throw new Error("No execution context waitUntil available");
			}
			c.executionCtx.waitUntil(triedAsync(p, "Inside Cron waitUntil"));
		};
	}),
);

cron.schedule("30 6 * * *", async (c) => {
	console.log("Cron Working");
});

export default cron;
