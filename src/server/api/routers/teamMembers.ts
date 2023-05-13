import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

//TODO: work on team memebers get procedure
export const teamMembersRouter = createTRPCRouter({
  getAllTeamMembers: protectedProcedure
    // .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = ctx.session.user;
      const team = await ctx.prisma.team.findMany({
        where: { userId: ctx.session.user.id },
      });

      const teams = await ctx.prisma.team.findMany({ where: { userId: id } });

      // return teams

      return await ctx.prisma.teamMembers.findMany({
        // where: { userId: ctx.session.user.id },
        where: { teamId: team[0]?.id },
      });
    }),
});
