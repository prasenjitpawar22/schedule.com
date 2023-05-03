import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  // protectedProcedure,
} from "@/server/api/trpc";

// envents router
export const eventsRouter = createTRPCRouter({
  getAllEvents: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.events.findMany();
  }),

  createEvent: publicProcedure
    .input(
      z.object({
        title: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        location: z.string(),
        description: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts;
      const event = await ctx.prisma.events.create({
        data: input,
      });

      return event;
    }),

  deletEvent: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      ctx.prisma.events
        .delete({
          where: { id: input.id },
        })
        .then(() => {
          return "deleted";
        })
        .catch((e) => {
          throw new Error(e);
        });
    }),
});
