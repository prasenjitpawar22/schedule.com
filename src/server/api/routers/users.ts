import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  // protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "../../db";

export const usersRouter = createTRPCRouter({
  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        where: { email: input.email },
      });
    }),
});

export const usercaller = usersRouter.createCaller({
  prisma: prisma,
  session: null,
});
