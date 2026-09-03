import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { type SchemaType, schema } from "./schema";
import { env } from "@/lib/env";

export const createDB = () => {
	const client = postgres(env.DATABASE_URL, { prepare: false });
	return drizzle(client, { schema });
};

export type DATABASE = PostgresJsDatabase<SchemaType>;
export type CreatedDB = ReturnType<typeof createDB>;
