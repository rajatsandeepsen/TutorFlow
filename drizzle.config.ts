import { createEnv } from "@t3-oss/env-nextjs";
import { defineConfig } from "drizzle-kit";
import { z } from "zod";

const env = createEnv({
	server: {
		DATABASE_URL_DIRECT: z.string(),
	},
	runtimeEnv: {
		DATABASE_URL_DIRECT: process.env.DATABASE_URL_DIRECT,
		// DATABASE_URL_DIRECT: process.env.DATABASE_URL_PROD,
	},
	skipValidation: false,
	emptyStringAsUndefined: true,
});

console.log(env.DATABASE_URL_DIRECT);

export default defineConfig({
	dialect: "postgresql",
	schema: "./server/db/schema/*",
	out: "./drizzle",
	dbCredentials: {
		url: env.DATABASE_URL_DIRECT,
	},
});
