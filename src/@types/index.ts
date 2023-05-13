import type {
  Events,
  EventLocations,
  EventOrganizres,
  TeamMembers,
  Team,
  TeamMemberRequest,
} from "@prisma/client";

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

export type ITeams = Team & {
  TeamMembers: TeamMembers[];
};

// export type ITeamMemberRequestAllData = TeamMemberRequest &
// Omit<Team, "userId">;

export type ITeamMemberRequestAllData = {
  team: {
    id: string;
    teamName: string;
  } | null;
  id: string;
  fromMemeberEmail: string;
  fromMemberName: string;
  toMemberEmail: string;
  toMemberName: string;
};
