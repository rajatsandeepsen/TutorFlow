import { index, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { createdAt, generateId, updatedAt } from "../utils";
import { user } from "./auth";

export const studentProfile = pgTable(
	"student_profile",
	{
		id: generateId("id").primaryKey(),
		studentId: text("student_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		subject: text("subject").notNull(),
		currentLevel: text("current_level").notNull(),
		learningGoals: text("learning_goals").notNull(),
		weakAreas: text("weak_areas").notNull(),
		createdAt: createdAt(),
		updatedAt: updatedAt(),
	},
	(table) => [
		uniqueIndex("student_profile_student_id_unique").on(table.studentId),
		index("student_profile_subject_idx").on(table.subject),
	],
);
