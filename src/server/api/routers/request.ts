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

      // TODO:
      /* const checkIfAlreadyRequestSend for memebers[]
      check if already request is send or not */
      const checkIfAlreadyRequsetSend =
        await ctx.prisma.teamMemberRequest.findMany({
          where: {
            toMemberEmail: { in: input.toMembersEmail },
            AND: { teamId: input.teamId },
          },
          select: {
            toMemberEmail: true,
            fromMemeberEmail: true,
          },
        });

      // console.log(checkIfAlreadyRequsetSend);
      if (checkIfAlreadyRequsetSend.length) {
        // filter and remove from the input.toEmail data
        const filterList = checkIfAlreadyRequsetSend.flatMap((data) => {
          const { toMemberEmail } = data;
          // console.log(toMemberEmail);
          return input.toMembersEmail.filter((list) => list != toMemberEmail);
        });
        // console.log(filterList, "filtered request list");
        if (!filterList.length) {
          throw new Error("already request send");
        }
        // update the input list
        input.toMembersEmail = filterList;
      }

      // check if already team member from list of input.toMembers
      const checkIfAlreadyteamMember = await ctx.prisma.teamMembers.findMany({
        where: {
          memberEmail: { in: input.toMembersEmail },
          teamId: input.teamId,
        },
      });

      // console.log(checkIfAlreadyteamMember);

      if (checkIfAlreadyteamMember.length) {
        // filter the list by removing the already in the team
        const filterMember = checkIfAlreadyteamMember.map((data) => {
          const { memberEmail } = data;

          return input.toMembersEmail.filter((list) => list != memberEmail);
        });
        // console.log(filterMember, "filtered team member list");

        throw new Error("already a team memeber");
        // add to teamMember reqeust table request table
      }

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

  // get all team members request
  getAllMemberRequest: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.email) throw new Error("invaild user ");

    // get all the join team request data
    const teamMemberRequests = await ctx.prisma.teamMemberRequest.findMany({
      where: { toMemberEmail: ctx.session.user.email },
    });

    // fetch team names from team id
    const allTeamsNames = await ctx.prisma.team.findMany({
      where: { id: { in: teamMemberRequests.map((data) => data.teamId) } },
      select: { teamName: true, id: true },
    });

    // finally add the team names to return data
    const data = teamMemberRequests.map((data) => {
      const { teamId, ...rest } = data;
      // const getTeamName =  allTeamsNames.find((t) => t.id === teamId)

      return {
        ...rest,
        team: allTeamsNames.find((t) => t.id === teamId),
      };
    });

    console.log(data, "final data");

    return data;
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

  /* 
  procedure for handling a event invite request  
  - send email?
  - add data enventInvitRequest table
  */
  sendEventInviteRequest: protectedProcedure
    .input(
      z.object({
        toEmail: z.array(z.string()),
        toName: z.string(),
        fromEmail: z.string(),
        fromName: z.string(),
        event: z.object({
          id: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { event, fromEmail, fromName, toEmail, toName } = input;

      if (!ctx.session.user.email || !ctx.session.user.name)
        throw new Error("user not found");

      // check if any toEmail already in the table
      // return

      const data = toEmail.map((toEmail, index) => {
        return { toEmail, fromEmail, fromName, eventsId: event.id, toName: "" };
      });

      await ctx.prisma.eventAttendeRequest.createMany({
        data: data,
      });
    }),

  // get all request for event invites request
  getAllEventInviteRequests: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.email) return;
    console.log(ctx.session.user.email);

    return await ctx.prisma.eventAttendeRequest.findMany({
      where: { toEmail: ctx.session.user.email },
    });
  }),
});
