import type { Events, EventLocations, EventOrganizres } from "@prisma/client";

// export type Event
export interface IOrganizerFormData {
  organizerName: string;
  eventsId: string;
}

export type IEventDto = Omit<
  Events,
  "id" | "eventLocationsId" | "userId" | "eventOrganizresId" | "eventsId"
> &
  Omit<EventLocations, "id" | "eventsId"> & {
    organizers: IOrganizerFormData[];
  };

export type IEvents = Events & {
  EventLocations: EventLocations[];
  EventOrganizres: EventOrganizres[];
};
