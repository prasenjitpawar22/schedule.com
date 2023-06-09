import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

// envents router
export const eventsRouter = createTRPCRouter({
  getAllLocationForEvent: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.eventLocations.findMany({
        where: { eventsId: input.eventId },
      });
    }),

  // get all user created event
  getAllEvents: protectedProcedure.query(async ({ ctx }) => {
    const allEvents = await ctx.prisma.events.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        description: true,
        endDate: true,
        EventLocations: true,
        EventOrganizres: true,
        Attende: true,
        id: true,
        startDate: true,
        title: true,
        userId: true,
      },
    });
    return allEvents;
  }),

  //get all events where user is member
  getAllEventsWhereUserIsMemebr: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;
    if (!session.user.email) return;

    // get list of team's id
    const eventsWhereUserIsAttendee = await prisma.attende.findMany({
      where: { email: session.user.email },
    });

    // make list of id's
    const listOfIdForEventsWhereUserIsAttendee = eventsWhereUserIsAttendee.map(
      (data) => {
        const { eventsId } = data;
        return eventsId;
      }
    );

    const events = await prisma.events.findMany({
      where: { id: { in: listOfIdForEventsWhereUserIsAttendee } },
      select: {
        description: true,
        endDate: true,
        EventLocations: true,
        EventOrganizres: true,
        Attende: true,
        id: true,
        startDate: true,
        title: true,
        userId: true,
      },
    });

    return events;
  }),

  createEvent: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
        description: z.string(),
        organizerName: z.array(z.string()),
        userId: z.string().or(z.undefined()),
      })
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts;

      const {
        city,
        country,
        description,
        endDate,
        organizerName,
        startDate,
        state,
        title,
        userId,
      } = input;

      if (!userId)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "userId is undefined",
        });

      // create event
      const event = await ctx.prisma.events.create({
        data: {
          description,
          endDate,
          startDate,
          title,
          // eventLocationsId: location.id,
          userId: userId,
          // eventOrganizresId: organizers
        },
      });

      // create event location
      const location = await ctx.prisma.eventLocations.create({
        data: {
          city,
          country,
          state,
          eventsId: event.id,
        },
      });

      // create event organizers
      const inp = organizerName.map((e) => {
        return { organizerName: e, eventsId: event.id };
      });
      const organizers = await ctx.prisma.eventOrganizres.createMany({
        data: inp,
      });

      return event;
    }),

  deletEvent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.events
        .delete({
          where: { id: input.id },
        })
        .then(() => {
          return "deleted";
        });
    }),

  updateEvent: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        userId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        id: z.string(),
        EventLocations: z.array(
          z.object({
            city: z.string(),
            country: z.string(),
            eventsId: z.string(),
            id: z.string(),
            state: z.string(),
          })
        ),
        EventOrganizres: z.array(
          z.object({
            eventsId: z.string(),
            id: z.string(),
            organizerName: z.string(),
          })
        ),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        EventLocations,
        EventOrganizres,
        description,
        endDate,
        id,
        startDate,
        title,
        userId,
      } = input;

      // update locations
      const tes = EventLocations.map((item) => {
        const { eventsId, ...newItem } = item;
        return newItem;
      });
      for (const { city, country, id, state } of tes) {
        await ctx.prisma.eventLocations.update({
          where: { id },
          data: { city, country, state },
        });
      }

      // update organizers
      for (const { organizerName, id } of EventOrganizres) {
        await ctx.prisma.eventOrganizres.update({
          where: { id },
          data: { organizerName },
        });
      }

      const event = await ctx.prisma.events.update({
        where: { id: input.id },
        data: {
          description,
          endDate,
          startDate,
          title,
        },
      });

      return event;
    }),

  AttendeeLeaveEvent: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user.email) throw new Error("invalid user");

        const getAttendeeId = await ctx.prisma.attende.findFirst({
          where: { email: ctx.session.user.email, eventsId: input.eventId },
        });
        if (!getAttendeeId) throw new Error("attendee not found in list");

        return await ctx.prisma.attende.delete({
          where: { id: getAttendeeId.id },
        });
      } catch (e) {
        if (typeof e === "string") {
          throw new Error(`internal server error ${e} `);
        }
        throw e;
      }
    }),
});
