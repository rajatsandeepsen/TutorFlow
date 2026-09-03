import { sql } from "drizzle-orm";
import {
	index,
	integer,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import type { CreatedDB } from "..";
import { createdAt, updatedAt } from "../utils";
import { user } from "./auth";

export const slotStatusEnum = pgEnum("slot_status", [
	"pending",
	"confirmed",
	"cancelled",
	"rejected",
	"expired",
]);

export const slot = pgTable(
	"slot",
	{
		id: uuid("id").primaryKey().defaultRandom(),

		teacherId: uuid("teacher_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		studentId: uuid("student_id")
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

		count: integer().default(1),
		title: text("title"),
		description: text("description"),
		status: slotStatusEnum("status").notNull().default("pending"),

		createdAt: createdAt(),
		updatedAt: updatedAt(),
	},

	(table) => [
		// Ensure start <= end
		sql`CHECK (${table.startTime} <= ${table.endTime})`,

		// Index to speed up availability searches
		index("slot_teacher_status_time_idx").on(
			table.teacherId,
			table.status,
			table.startTime,
			table.endTime,
		),
	],
);

// No two rows with the same teacher_id can have overlapping [start_time, end_time) when status = 'confirmed'
export async function enableConstrain(db: CreatedDB) {
	await db.execute(sql`
	ALTER TABLE slot ADD CONSTRAINT slot_no_overlap_confirmed
		EXCLUDE USING GIST (
			teacher_id WITH =,
			tstzrange(start_time, end_time, '[)') WITH &&
		)
		WHERE (status = 'confirmed');
	`);
}
