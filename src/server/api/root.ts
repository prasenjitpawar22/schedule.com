import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { eventsRouter } from "./routers/events";
import { usersRouter } from "./routers/users";
import { teamMembersRouter } from "./routers/teamMembers";
import { requestRouter } from "./routers/request";
import { teamsRouter } from "./routers/teams";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  events: eventsRouter,
  users: usersRouter,
  teamsMember: teamMembersRouter,
  request: requestRouter,
  teams: teamsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
