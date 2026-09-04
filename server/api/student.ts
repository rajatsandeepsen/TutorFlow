import { and, desc, eq, gte, ilike, lte } from "drizzle-orm";
import { z } from "zod";
import { user } from "@/server/db/schema/auth";
import { homeworks, notes } from "@/server/db/schema/learning";
import { slot } from "@/server/db/schema/slot";
import { studentProfile } from "@/server/db/schema/student";
import { getError, studentProcedure, tryAPI } from "./procedure";

export const studentRouter = {
	getMyProfile: studentProcedure.handler(async ({ context }) => {
		const profile = await tryAPI(
			"student.getMyProfile.findProfile",
			context.db.query.studentProfile.findFirst({
				where: eq(studentProfile.studentId, context.user.id),
			}),
		);

		return {
			user: {
				id: context.user.id,
				name: context.user.name,
				email: context.user.email,
				image: context.user.image,
			},
			profile,
		};
	}),

	updateMyBasicProfile: studentProcedure
		.input(
			z.object({
				name: z.string().min(1),
				image: z.string().url().nullable().optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			const [updatedUser] = await tryAPI(
				"student.updateMyBasicProfile.updateUser",
				context.db
					.update(user)
					.set({
						name: input.name,
						...(input.image !== undefined ? { image: input.image } : {}),
					})
					.where(eq(user.id, context.user.id))
					.returning({
						id: user.id,
						name: user.name,
						email: user.email,
						image: user.image,
						role: user.role,
					}),
			);

			if (!updatedUser) {
				throw getError("NOT_FOUND", "Student not found");
			}

			return updatedUser;
		}),

	getMySlotsList: studentProcedure
		.input(
			z.object({
				status: z
					.enum([
						"pending",
						"confirmed",
						"in_progress",
						"cancelled",
						"rejected",
						"expired",
						"attended",
					])
					.optional(),
				topic: z.string().min(1).optional(),
				from: z.coerce.date().optional(),
				to: z.coerce.date().optional(),
				limit: z.number().int().positive().max(200).optional(),
				offset: z.number().int().min(0).optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			const conditions = [eq(slot.studentId, context.user.id)];

			if (input.status) conditions.push(eq(slot.status, input.status));
			if (input.topic) conditions.push(ilike(slot.topic, `%${input.topic}%`));
			if (input.from) conditions.push(gte(slot.startTime, input.from));
			if (input.to) conditions.push(lte(slot.endTime, input.to));

			const rows = await tryAPI(
				"student.getMySlotsList.selectSlots",
				context.db
					.select({
						id: slot.id,
						teacherId: slot.teacherId,
						teacherName: user.name,
						startTime: slot.startTime,
						endTime: slot.endTime,
						topic: slot.topic,
						description: slot.description,
						count: slot.count,
						status: slot.status,
						createdAt: slot.createdAt,
						updatedAt: slot.updatedAt,
					})
					.from(slot)
					.innerJoin(user, eq(user.id, slot.teacherId))
					.where(and(...conditions))
					.orderBy(desc(slot.startTime))
					.limit(input.limit ?? 50)
					.offset(input.offset ?? 0),
			);

			return rows;
		}),

	getAllMyNotes: studentProcedure
		.input(
			z.object({
				limit: z.number().int().positive().max(200).optional(),
				offset: z.number().int().min(0).optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			const rows = await tryAPI(
				"student.getAllMyNotes.selectNotes",
				context.db
					.select({
						id: notes.id,
						slotId: notes.slotId,
						text: notes.text,
						createdAt: notes.createdAt,
						updatedAt: notes.updatedAt,
						topic: slot.topic,
						startTime: slot.startTime,
						endTime: slot.endTime,
					})
					.from(notes)
					.innerJoin(slot, eq(slot.id, notes.slotId))
					.where(eq(slot.studentId, context.user.id))
					.orderBy(desc(notes.createdAt))
					.limit(input.limit ?? 100)
					.offset(input.offset ?? 0),
			);

			return rows;
		}),

	getMyNoteById: studentProcedure
		.input(
			z.object({
				noteId: z.string().min(1),
			}),
		)
		.handler(async ({ context, input }) => {
			const row = await tryAPI(
				"student.getMyNoteById.selectNote",
				context.db
					.select({
						id: notes.id,
						slotId: notes.slotId,
						text: notes.text,
						createdAt: notes.createdAt,
						updatedAt: notes.updatedAt,
						topic: slot.topic,
						startTime: slot.startTime,
						endTime: slot.endTime,
					})
					.from(notes)
					.innerJoin(slot, eq(slot.id, notes.slotId))
					.where(
						and(
							eq(notes.id, input.noteId),
							eq(slot.studentId, context.user.id),
						),
					)
					.limit(1),
			);

			const note = row[0];
			if (!note) {
				throw getError("NOT_FOUND", "Note not found");
			}

			return note;
		}),

	getMyHomeworks: studentProcedure
		.input(
			z.object({
				limit: z.number().int().positive().max(200).optional(),
				offset: z.number().int().min(0).optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			const rows = await tryAPI(
				"student.getMyHomeworks.selectHomeworks",
				context.db
					.select({
						id: homeworks.id,
						slotId: homeworks.slotId,
						question: homeworks.question,
						anwser: homeworks.anwser,
						score: homeworks.score,
						createdAt: homeworks.createdAt,
						updatedAt: homeworks.updatedAt,
						topic: slot.topic,
						startTime: slot.startTime,
						endTime: slot.endTime,
					})
					.from(homeworks)
					.innerJoin(slot, eq(slot.id, homeworks.slotId))
					.where(eq(slot.studentId, context.user.id))
					.orderBy(desc(homeworks.createdAt))
					.limit(input.limit ?? 100)
					.offset(input.offset ?? 0),
			);

			return rows;
		}),

	answerHomework: studentProcedure
		.input(
			z.object({
				homeworkId: z.string().min(1),
				anwser: z.string().min(1),
			}),
		)
		.handler(async ({ context, input }) => {
			const row = await tryAPI(
				"student.answerHomework.findHomework",
				context.db
					.select({
						id: homeworks.id,
					})
					.from(homeworks)
					.innerJoin(slot, eq(slot.id, homeworks.slotId))
					.where(
						and(
							eq(homeworks.id, input.homeworkId),
							eq(slot.studentId, context.user.id),
						),
					)
					.limit(1),
			);

			if (!row[0]) {
				throw getError("NOT_FOUND", "Homework not found");
			}

			const [updatedHomework] = await tryAPI(
				"student.answerHomework.updateAnswer",
				context.db
					.update(homeworks)
					.set({ anwser: input.anwser })
					.where(eq(homeworks.id, input.homeworkId))
					.returning(),
			);

			return updatedHomework;
		}),

	respondToSlot: studentProcedure
		.input(
			z.object({
				slotId: z.string().min(1),
				status: z.enum(["confirmed", "rejected"]),
			}),
		)
		.handler(async ({ context, input }) => {
			const existing = await tryAPI(
				"student.respondToSlot.findSlot",
				context.db.query.slot.findFirst({
					where: and(
						eq(slot.id, input.slotId),
						eq(slot.studentId, context.user.id),
					),
					columns: { id: true, status: true },
				}),
			);

			if (!existing) {
				throw getError("NOT_FOUND", "Slot not found");
			}

			if (existing.status !== "pending") {
				throw getError(
					"BAD_REQUEST",
					"Only pending sessions can be confirmed or rejected",
				);
			}

			const [updated] = await tryAPI(
				"student.respondToSlot.updateStatus",
				context.db
					.update(slot)
					.set({ status: input.status })
					.where(
						and(eq(slot.id, input.slotId), eq(slot.studentId, context.user.id)),
					)
					.returning(),
			);

			return updated;
		}),

	cancelMySlot: studentProcedure
		.input(
			z.object({
				slotId: z.string().min(1),
			}),
		)
		.handler(async ({ context, input }) => {
			const existing = await tryAPI(
				"student.cancelMySlot.findSlot",
				context.db.query.slot.findFirst({
					where: and(
						eq(slot.id, input.slotId),
						eq(slot.studentId, context.user.id),
					),
					columns: { id: true, status: true },
				}),
			);

			if (!existing) {
				throw getError("NOT_FOUND", "Slot not found");
			}

			if (!["pending", "confirmed"].includes(existing.status)) {
				throw getError(
					"BAD_REQUEST",
					"Only pending or confirmed sessions can be cancelled",
				);
			}

			const [updated] = await tryAPI(
				"student.cancelMySlot.updateStatus",
				context.db
					.update(slot)
					.set({ status: "cancelled" })
					.where(
						and(eq(slot.id, input.slotId), eq(slot.studentId, context.user.id)),
					)
					.returning(),
			);

			return updated;
		}),
};
