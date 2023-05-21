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

  getTeamsWhereUserIsMember: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;
    if (!session.user.email) return;

    // get list of team's id
    const teamsWhereUserIsMember = await prisma.teamMembers.findMany({
      where: { memberEmail: session.user.email },
    });

    // make list of id's
    const listOfIdForTeamsWhereUserIsMember = teamsWhereUserIsMember.map(
      (data) => {
        const { teamId } = data;
        return teamId;
      }
    );

    const teams = await prisma.team.findMany({
      where: { id: { in: listOfIdForTeamsWhereUserIsMember } },
      select: {
        TeamMembers: true,
        id: true,
        teamName: true,
        userId: true,
      },
    });

    return teams;
  }),

  deleteTeam: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.team.delete({ where: { id: input.teamId } });
    }),

  userLeaveTeam: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.email) throw new Error("invalid user request");

      const getTeamMemberId = await ctx.prisma.teamMembers.findFirst({
        where: { memberEmail: ctx.session.user.email, teamId: input.teamId },
      });

      if (!getTeamMemberId)
        throw new Error("user is already not a team member");
      return ctx.prisma.teamMembers.delete({
        where: { id: getTeamMemberId.id },
      });
    }),
});
