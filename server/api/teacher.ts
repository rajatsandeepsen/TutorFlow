import { and, desc, eq, gt, gte, ilike, inArray, lt, lte } from "drizzle-orm";
import { z } from "zod";
import { sendEmail } from "@/server/context/email";
import { user } from "@/server/db/schema/auth";
import { homeworks, notes } from "@/server/db/schema/learning";
import { slot } from "@/server/db/schema/slot";
import { studentProfile } from "@/server/db/schema/student";
import {
	HomeworkCreatedEmail,
	SessionScheduledEmail,
	SessionStatusUpdatedEmail,
	StudentAccountCreatedEmail,
	StudentProfileUpdatedEmail,
} from "@/server/email";
import { getError, teacherProcedure, tryAPI } from "./procedure";

const toTimeText = (date: Date) => date.toISOString();

const getSignInLink = (req: Request, email: string, nextPath?: string) => {
	const url = new URL("/auth/sign-in", req.url);
	url.searchParams.set("email", email);
	if (nextPath) {
		url.searchParams.set("next", nextPath);
	}
	return url.toString();
};

const updateStudentExtraProfileProcedure = teacherProcedure
	.input(
		z.object({
			studentId: z.string().min(1),
			name: z.string().min(1),
			subject: z.string().min(1),
			currentLevel: z.string().min(1),
			learningGoals: z.string().min(1),
			weakAreas: z.string().min(1),
		}),
	)
	.handler(async ({ context, input }) => {
		const student = await tryAPI(
			"teacher.updateStudentExtraProfile.findStudent",
			context.db.query.user.findFirst({
				where: and(eq(user.id, input.studentId), eq(user.role, "student")),
				columns: { id: true, name: true, email: true },
			}),
		);

		if (!student) {
			throw getError("NOT_FOUND", "Student not found");
		}

		const existingProfile = await tryAPI(
			"teacher.updateStudentExtraProfile.findProfile",
			context.db.query.studentProfile.findFirst({
				where: eq(studentProfile.studentId, input.studentId),
				columns: { id: true },
			}),
		);

		if (!existingProfile) {
			const [createdProfile] = await tryAPI(
				"teacher.updateStudentExtraProfile.insertProfile",
				context.db
					.insert(studentProfile)
					.values({
						studentId: input.studentId,
						name: input.name,
						subject: input.subject,
						currentLevel: input.currentLevel,
						learningGoals: input.learningGoals,
						weakAreas: input.weakAreas,
					})
					.returning(),
			);

			context.waitUntil(
				sendEmail({
					to: student.email,
					subject: "Your student profile was updated",
					jsx: StudentProfileUpdatedEmail({
						studentName: student.name,
						subject: createdProfile.subject,
						currentLevel: createdProfile.currentLevel,
					}),
				}),
			);

			return createdProfile;
		}

		const [updatedProfile] = await tryAPI(
			"teacher.updateStudentExtraProfile.updateProfile",
			context.db
				.update(studentProfile)
				.set({
					name: input.name,
					subject: input.subject,
					currentLevel: input.currentLevel,
					learningGoals: input.learningGoals,
					weakAreas: input.weakAreas,
				})
				.where(eq(studentProfile.studentId, input.studentId))
				.returning(),
		);

		context.waitUntil(
			sendEmail({
				to: student.email,
				subject: "Your student profile was updated",
				jsx: StudentProfileUpdatedEmail({
					studentName: student.name,
					subject: updatedProfile.subject,
					currentLevel: updatedProfile.currentLevel,
				}),
			}),
		);

		return updatedProfile;
	});

export const teacherRouter = {
	createStudentAccount: teacherProcedure
		.input(
			z.object({
				name: z.string().min(1),
				email: z.string().email(),
				inviteLink: z.string().url().optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			const existing = await tryAPI(
				"teacher.createStudentAccount.findExistingUser",
				context.db.query.user.findFirst({
					where: eq(user.email, input.email),
					columns: { id: true, name: true, email: true, role: true },
				}),
			);

			if (existing && existing.role !== "student") {
				throw getError("CONFLICT", "A teacher account already uses this email");
			}

			const inviteLink =
				input.inviteLink ?? getSignInLink(context.req, input.email, "/profile");

			if (existing) {
				const [updatedStudent] = await tryAPI(
					"teacher.createStudentAccount.updateExistingStudent",
					context.db
						.update(user)
						.set({ name: input.name })
						.where(eq(user.id, existing.id))
						.returning({
							id: user.id,
							name: user.name,
							email: user.email,
							role: user.role,
						}),
				);

				context.waitUntil(
					sendEmail({
						to: updatedStudent.email,
						subject: "You're invited to TutorFlow",
						jsx: StudentAccountCreatedEmail({
							studentName: updatedStudent.name,
							tutorName: context.user.name,
							inviteLink,
						}),
					}),
				);

				return { student: updatedStudent, created: false };
			}

			const [createdStudent] = await tryAPI(
				"teacher.createStudentAccount.insertStudent",
				context.db
					.insert(user)
					.values({
						id: crypto.randomUUID(),
						name: input.name,
						email: input.email,
						role: "student",
					})
					.returning({
						id: user.id,
						name: user.name,
						email: user.email,
						role: user.role,
					}),
			);

			context.waitUntil(
				sendEmail({
					to: createdStudent.email,
					subject: "You're invited to TutorFlow",
					jsx: StudentAccountCreatedEmail({
						studentName: createdStudent.name,
						tutorName: context.user.name,
						inviteLink,
					}),
				}),
			);

			return { student: createdStudent, created: true };
		}),

	createSession: teacherProcedure
		.input(
			z.object({
				studentId: z.string().min(1),
				startTime: z.coerce.date(),
				endTime: z.coerce.date(),
				topic: z.string().min(1),
				description: z.string().optional(),
				joinLink: z.string().url().optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			if (input.startTime >= input.endTime) {
				throw getError("BAD_REQUEST", "startTime must be before endTime");
			}

			const student = await tryAPI(
				"teacher.createSession.findStudent",
				context.db.query.user.findFirst({
					where: and(eq(user.id, input.studentId), eq(user.role, "student")),
					columns: { id: true, name: true, email: true },
				}),
			);

			if (!student) {
				throw getError("NOT_FOUND", "Student not found");
			}

			const overlappingSession = await tryAPI(
				"teacher.createSession.findOverlappingSession",
				context.db.query.slot.findFirst({
					where: and(
						eq(slot.teacherId, context.user.id),
						inArray(slot.status, ["pending", "confirmed", "in_progress"]),
						lt(slot.startTime, input.endTime),
						gt(slot.endTime, input.startTime),
					),
					columns: { id: true },
				}),
			);

			if (overlappingSession) {
				throw getError(
					"CONFLICT",
					"Tutor already has another session in this time range",
				);
			}

			const [lastSuccessfulClass] = await tryAPI(
				"teacher.createSession.findLastSuccessfulClass",
				context.db
					.select({ count: slot.count })
					.from(slot)
					.where(
						and(
							eq(slot.teacherId, context.user.id),
							eq(slot.studentId, input.studentId),
							eq(slot.status, "attended"),
						),
					)
					.orderBy(desc(slot.count), desc(slot.startTime))
					.limit(1),
			);

			const nextCount = (lastSuccessfulClass?.count ?? 0) + 1;

			const [createdSession] = await tryAPI(
				"teacher.createSession.insertSession",
				context.db
					.insert(slot)
					.values({
						teacherId: context.user.id,
						studentId: input.studentId,
						startTime: input.startTime,
						endTime: input.endTime,
						topic: input.topic,
						description: input.description ?? null,
						count: nextCount,
						status: "pending",
					})
					.returning(),
			);

			const joinLink =
				input.joinLink ??
				getSignInLink(
					context.req,
					student.email,
					`/student/sessions/${createdSession.id}`,
				);

			context.waitUntil(
				sendEmail({
					to: student.email,
					subject: "New session scheduled",
					jsx: SessionScheduledEmail({
						studentName: student.name,
						tutorName: context.user.name,
						topic: createdSession.topic,
						startTime: toTimeText(createdSession.startTime),
						endTime: toTimeText(createdSession.endTime),
						joinLink,
					}),
				}),
			);

			return createdSession;
		}),

	addSessionNote: teacherProcedure
		.input(
			z.object({
				slotId: z.string().min(1),
				text: z.string().min(1),
			}),
		)
		.handler(async ({ context, input }) => {
			const session = await tryAPI(
				"teacher.addSessionNote.findSlot",
				context.db.query.slot.findFirst({
					where: and(
						eq(slot.id, input.slotId),
						eq(slot.teacherId, context.user.id),
					),
					columns: { id: true, status: true },
				}),
			);

			if (!session) {
				throw getError("NOT_FOUND", "Slot not found");
			}

			if (!["confirmed", "in_progress", "attended"].includes(session.status)) {
				throw getError(
					"BAD_REQUEST",
					"Notes can be added only after student accepts the session",
				);
			}

			const [createdNote] = await tryAPI(
				"teacher.addSessionNote.insertNote",
				context.db
					.insert(notes)
					.values({
						slotId: input.slotId,
						text: input.text,
					})
					.returning(),
			);

			return createdNote;
		}),

	createHomework: teacherProcedure
		.input(
			z.object({
				slotId: z.string().min(1),
				question: z.string().min(1),
				homeworkLink: z.string().url().optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			const session = await tryAPI(
				"teacher.createHomework.findSlot",
				context.db.query.slot.findFirst({
					where: and(
						eq(slot.id, input.slotId),
						eq(slot.teacherId, context.user.id),
					),
					columns: { id: true, status: true, studentId: true },
				}),
			);

			if (!session) {
				throw getError("NOT_FOUND", "Slot not found");
			}

			if (session.status !== "attended") {
				throw getError(
					"BAD_REQUEST",
					"Homework can be created only after session is attended",
				);
			}

			const [createdHomework] = await tryAPI(
				"teacher.createHomework.insertHomework",
				context.db
					.insert(homeworks)
					.values({
						slotId: input.slotId,
						question: input.question,
					})
					.returning(),
			);

			const student = await tryAPI(
				"teacher.createHomework.findStudent",
				context.db.query.user.findFirst({
					where: and(eq(user.id, session.studentId), eq(user.role, "student")),
					columns: { name: true, email: true },
				}),
			);

			if (student) {
				const homeworkLink =
					input.homeworkLink ??
					getSignInLink(
						context.req,
						student.email,
						`/student/homeworks/${createdHomework.id}`,
					);

				context.waitUntil(
					sendEmail({
						to: student.email,
						subject: "New homework assigned",
						jsx: HomeworkCreatedEmail({
							studentName: student.name,
							question: createdHomework.question,
							homeworkLink,
						}),
					}),
				);
			}

			return createdHomework;
		}),

	scoreHomeworkAnswer: teacherProcedure
		.input(
			z.object({
				homeworkId: z.string().min(1),
				score: z.number().int().min(0).max(100),
			}),
		)
		.handler(async ({ context, input }) => {
			const row = await tryAPI(
				"teacher.scoreHomeworkAnswer.findHomework",
				context.db
					.select({
						id: homeworks.id,
						anwser: homeworks.anwser,
					})
					.from(homeworks)
					.innerJoin(slot, eq(slot.id, homeworks.slotId))
					.where(
						and(
							eq(homeworks.id, input.homeworkId),
							eq(slot.teacherId, context.user.id),
						),
					)
					.limit(1),
			);

			const homework = row[0];
			if (!homework) {
				throw getError("NOT_FOUND", "Homework not found");
			}

			if (!homework.anwser) {
				throw getError(
					"BAD_REQUEST",
					"Cannot score homework before student submits anwser",
				);
			}

			const [updatedHomework] = await tryAPI(
				"teacher.scoreHomeworkAnswer.updateScore",
				context.db
					.update(homeworks)
					.set({ score: input.score })
					.where(eq(homeworks.id, input.homeworkId))
					.returning(),
			);

			return updatedHomework;
		}),

	updateStudentExtraProfile: updateStudentExtraProfileProcedure,

	updateStudentProfile: updateStudentExtraProfileProcedure,

	getSlotsList: teacherProcedure
		.input(
			z.object({
				studentId: z.string().min(1).optional(),
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
				from: z.coerce.date().optional(),
				to: z.coerce.date().optional(),
				limit: z.number().int().positive().max(200).optional(),
				offset: z.number().int().min(0).optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			const conditions = [eq(slot.teacherId, context.user.id)];

			if (input.studentId) conditions.push(eq(slot.studentId, input.studentId));
			if (input.status) conditions.push(eq(slot.status, input.status));
			if (input.from) conditions.push(gte(slot.startTime, input.from));
			if (input.to) conditions.push(lte(slot.endTime, input.to));

			const rows = await tryAPI(
				"teacher.getSlotsList.selectSlots",
				context.db
					.select({
						id: slot.id,
						teacherId: slot.teacherId,
						studentId: slot.studentId,
						studentName: user.name,
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
					.innerJoin(user, eq(user.id, slot.studentId))
					.where(and(...conditions))
					.orderBy(desc(slot.startTime))
					.limit(input.limit ?? 50)
					.offset(input.offset ?? 0),
			);

			return rows;
		}),

	searchStudentsByName: teacherProcedure
		.input(
			z.object({
				query: z.string().min(1),
				limit: z.number().int().positive().max(100).optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			const rows = await tryAPI(
				"teacher.searchStudentsByName.selectStudents",
				context.db
					.select({
						id: user.id,
						name: user.name,
						email: user.email,
						role: user.role,
						subject: studentProfile.subject,
						currentLevel: studentProfile.currentLevel,
						learningGoals: studentProfile.learningGoals,
						weakAreas: studentProfile.weakAreas,
					})
					.from(user)
					.leftJoin(studentProfile, eq(studentProfile.studentId, user.id))
					.where(
						and(eq(user.role, "student"), ilike(user.name, `%${input.query}%`)),
					)
					.orderBy(user.name)
					.limit(input.limit ?? 20),
			);

			return rows;
		}),

	updateSlotStatus: teacherProcedure
		.input(
			z.object({
				slotId: z.string().min(1),
				status: z.enum(["in_progress", "attended", "cancelled", "expired"]),
				joinLink: z.string().url().optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			const existing = await tryAPI(
				"teacher.updateSlotStatus.findSlot",
				context.db.query.slot.findFirst({
					where: and(
						eq(slot.id, input.slotId),
						eq(slot.teacherId, context.user.id),
					),
					columns: {
						id: true,
						studentId: true,
						topic: true,
						startTime: true,
						endTime: true,
					},
				}),
			);

			if (!existing) {
				throw getError("NOT_FOUND", "Slot not found");
			}

			const [updated] = await tryAPI(
				"teacher.updateSlotStatus.updateSlot",
				context.db
					.update(slot)
					.set({ status: input.status })
					.where(
						and(eq(slot.id, input.slotId), eq(slot.teacherId, context.user.id)),
					)
					.returning(),
			);

			const student = await tryAPI(
				"teacher.updateSlotStatus.findStudent",
				context.db.query.user.findFirst({
					where: and(eq(user.id, existing.studentId), eq(user.role, "student")),
					columns: { name: true, email: true },
				}),
			);

			if (student) {
				const sessionLink =
					input.joinLink ??
					getSignInLink(
						context.req,
						student.email,
						`/student/sessions/${existing.id}`,
					);

				context.waitUntil(
					sendEmail({
						to: student.email,
						subject: "Session status updated",
						jsx: SessionStatusUpdatedEmail({
							studentName: student.name,
							topic: existing.topic,
							startTime: toTimeText(existing.startTime),
							endTime: toTimeText(existing.endTime),
							status: updated.status,
							sessionLink,
						}),
					}),
				);
			}

			return updated;
		}),

	deleteStudent: teacherProcedure
		.input(
			z.object({
				studentId: z.string().min(1),
			}),
		)
		.handler(async ({ context, input }) => {
			const [deleted] = await tryAPI(
				"teacher.deleteStudent.deleteUser",
				context.db
					.delete(user)
					.where(and(eq(user.id, input.studentId), eq(user.role, "student")))
					.returning({
						id: user.id,
						name: user.name,
						email: user.email,
					}),
			);

			if (!deleted) {
				throw getError("NOT_FOUND", "Student not found");
			}

			context.waitUntil(
				sendEmail({
					to: deleted.email,
					subject: "Your TutorFlow student account was removed",
					text: `Hi ${deleted.name}, your student account has been removed by your tutor.`,
				}),
			);

			return deleted;
		}),
};
