import { Prisma, TeamMemberRequest } from "@prisma/client";
import { string, z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const requestRouter = createTRPCRouter({
  //send team members join request
  sendMemberRequest: protectedProcedure
    .input(
      z.object({
        toMembersEmail: z.array(z.string()),
        toMemberName: z.string().optional(),
        teamId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, id, image } = ctx.session.user;

      if (!name || !email) {
        throw new Error("user Not valid");
      }

      // check if already team member
      const checkIfAlreadyteamMember = await ctx.prisma.teamMembers.findFirst({
        where: { teamId: input.teamId },
      });

      // TODO:
      // const checkIfAlreadyRequestSend for memebers[]

      if (checkIfAlreadyteamMember) throw new Error("already a team memeber");
      // add to teamMember reqeust table request table

      const data: Omit<TeamMemberRequest, "id">[] = input.toMembersEmail.map(
        (item) => {
          return {
            toMemberEmail: item,
            fromMemberName: name,
            teamId: input.teamId,
            fromMemeberEmail: email,
            toMemberName: "",
          };
        }
      );

      return await ctx.prisma.teamMemberRequest.createMany({
        data: data,
      });
    }),

  // get all team members
  getAllMemberRequest: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.email) throw new Error("invaild user ");
    const teamMemberRequests = await ctx.prisma.teamMemberRequest.findMany({
      where: { toMemberEmail: ctx.session.user.email },
    });

    const data = teamMemberRequests.map(async (team) => {
      const d = await ctx.prisma.team.findFirst({
        where: { id: team.teamId },
        select: { teamName: true, id: true },
      });
      const { teamId, ...rest } = team;
      return { ...rest, team: d };
    });

    return await Promise.all(data);
  }),

  acceptTeamMemberRequest: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        fromMemeberEmail: z.string(),
        requestId: z.string(),
        toMemberEmail: string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { fromMemeberEmail, requestId, teamId, toMemberEmail } = input;

      // check if already team member
      const checkIfAlreadyteamMember = await ctx.prisma.teamMembers.findFirst({
        where: { teamId },
      });

      if (checkIfAlreadyteamMember) throw new Error("already a team memeber");

      // accpet the request and become team memeber
      const addToTeamMembers = await ctx.prisma.teamMembers.create({
        data: { memberEmail: toMemberEmail, memberName: "", teamId: teamId },
      });

      // remove the request from table after accepting
      await ctx.prisma.teamMemberRequest.delete({
        where: { id: requestId },
      });

      return addToTeamMembers;
    }),

  declineAddTeamMemberRequest: protectedProcedure
    .input(
      z.object({
        requestId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { requestId } = input;
      const { prisma, session } = ctx;
      return await prisma.teamMemberRequest.delete({
        where: { id: requestId },
      });
    }),
});
