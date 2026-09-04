import { sql } from "drizzle-orm";
import {
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import type { CreatedDB } from "..";
import { createdAt, generateId, updatedAt } from "../utils";
import { user } from "./auth";

export const slotStatusEnum = pgEnum("slot_status", [
	"pending",
	"confirmed",
	"in_progress",
	"cancelled",
	"rejected",
	"expired",
	"attended",
]);

export const slot = pgTable(
	"slot",
	{
		id: generateId("id").primaryKey(),

		teacherId: text("teacher_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		studentId: text("student_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		startTime: timestamp("start_time", {
			withTimezone: true,
			mode: "date",
		}).notNull(),
		endTime: timestamp("end_time", {
			withTimezone: true,
			mode: "date",
		}).notNull(),

		count: integer("count").notNull().default(1),
		topic: text("topic").notNull(),
		description: text("description"),
		status: slotStatusEnum("status").notNull().default("pending"),

		createdAt: createdAt(),
		updatedAt: updatedAt(),
	},

	(table) => [
		// Ensure a real interval
		sql`CHECK (${table.startTime} < ${table.endTime})`,

		// Index to speed up tutor schedule lookups
		index("slot_teacher_status_time_idx").on(
			table.teacherId,
			table.status,
			table.startTime,
			table.endTime,
		),
	],
);

// No overlapping active sessions for the same tutor
export async function enableConstraint(db: CreatedDB) {
	await db.execute(sql`CREATE EXTENSION IF NOT EXISTS btree_gist;`);

	await db.execute(sql`
	ALTER TABLE slot ADD CONSTRAINT slot_no_overlap_teacher_active
		EXCLUDE USING GIST (
			teacher_id WITH =,
			tstzrange(start_time, end_time, '[)') WITH &&
		)
		WHERE (status IN ('pending', 'confirmed', 'in_progress'));
	`);
}
