import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  // protectedProcedure,
} from "@/server/api/trpc";

export const eventsRouter = createTRPCRouter({
  getAllEvents: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.events.findMany();
  }),
});
