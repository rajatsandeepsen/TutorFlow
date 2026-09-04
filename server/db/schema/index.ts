import { relations } from "drizzle-orm";
import {
	account,
	accountRelations,
	session,
	sessionRelations,
	user,
	verification,
} from "./auth";
import { homeworks, notes } from "./learning";
import { slot } from "./slot";
import { studentProfile } from "./student";

const userRelations = relations(user, ({ many, one }) => ({
	sessions: many(session),
	accounts: many(account),
}));

export const schema = {
	user,
	account,
	verification,
	session,
	userRelations,
	sessionRelations,
	accountRelations,
	slot,
	studentProfile,
	notes,
	homeworks,
} as const;

export type SchemaType = typeof schema;
