import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const teamsRouter = createTRPCRouter({
  createTeam: protectedProcedure
    .input(z.object({ teamName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.prisma.team.create({
        data: { teamName: input.teamName, userId: ctx.session.user.id },
      });
      return team;
    }),

  getAllTeams: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.team.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        TeamMembers: true,
        id: true,
        teamName: true,
        userId: true,
      },
    });
  }),

  deleteTeam: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.team.delete({ where: { id: input.teamId } });
    }),
});
