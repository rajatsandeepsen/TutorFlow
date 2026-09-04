import { protectedProcedure, publicProcedure } from "./procedure";
import { studentRouter } from "./student";
import { teacherRouter } from "./teacher";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	privateData: protectedProcedure.handler(({ context }) => {
		return {
			message: "This is private",
			user: context.session?.user,
		};
	}),
	teacher: teacherRouter,
	student: studentRouter,
};
export type AppRouter = typeof appRouter;
