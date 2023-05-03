import type { Events } from "@prisma/client";

// export type Event

export type IEventDto = Omit<Events, "id">;
