import { index, integer, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, generateId, updatedAt } from "../utils";
import { slot } from "./slot";

export const notes = pgTable(
	"notes",
	{
		id: generateId("id").primaryKey(),
		slotId: text("slot_id")
			.notNull()
			.references(() => slot.id, { onDelete: "cascade" }),
		text: text("text").notNull(),
		createdAt: createdAt(),
		updatedAt: updatedAt(),
	},
	(table) => [index("notes_slot_id_idx").on(table.slotId)],
);

export const homeworks = pgTable(
	"homeworks",
	{
		id: generateId("id").primaryKey(),
		slotId: text("slot_id")
			.notNull()
			.references(() => slot.id, { onDelete: "cascade" }),
		question: text("question").notNull(),
		anwser: text("anwser"),
		score: integer("score"),
		createdAt: createdAt(),
		updatedAt: updatedAt(),
	},
	(table) => [index("homeworks_slot_id_idx").on(table.slotId)],
);
