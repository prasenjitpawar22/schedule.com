import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // protectedProcedure,
} from "@/server/api/trpc";
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

  getAllEvents: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.events.findMany({
      select: {
        description: true,
        endDate: true,
        EventLocations: true,
        EventOrganizres: true,
        id: true,
        startDate: true,
        title: true,
        // user: true,
        userId: true,
      },
    });
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
      console.log(input);

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
});
