import { ITeamMemberRequestAllData } from "@/src/@types";
import AllEventInvitesRequestCard from "@/src/components/AllEventInvitesRequestCard";
import { AllMemberRequestCard } from "@/src/components/AllMemberRequestCard";
import EmptyDataCard from "@/src/components/EmptyDataCard";
import { api } from "@/src/utils/api";
import { EventAttendeRequest } from "@prisma/client";

import React, { useEffect, useState } from "react";

const Requests = () => {
  const [allMemberRequest, setAllMemberRequest] =
    useState<ITeamMemberRequestAllData[]>();
  const [allEventInviteRequest, setAllEventInviteRequest] =
    useState<EventAttendeRequest[]>();

  const [allMembersEmptyDataCardState, setAllMembersEmptyDataCardState] =
    useState<boolean>(false);
  const [allEventsEmptyDataCardState, setAllEventsEmptyDataCardState] =
    useState<boolean>(false);

  return (
    <div className="m-12">
      <div className="mb-12 flex items-baseline justify-between gap-24">
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight lg:text-2xl">
          Requests
        </h1>
      </div>

      {allMembersEmptyDataCardState && allEventsEmptyDataCardState ? (
        <EmptyDataCard description="" mainText="request" />
      ) : (
        <>
          {!allMembersEmptyDataCardState && (
            <AllMemberRequestCard
              setEmptyDataCard={setAllMembersEmptyDataCardState}
              allMemberRequest={allMemberRequest}
              setAllMemberRequest={setAllMemberRequest}
            />
          )}
          {!allEventsEmptyDataCardState && (
            <AllEventInvitesRequestCard
              setEmptyDataCard={setAllEventsEmptyDataCardState}
              allEventInviteRequest={allEventInviteRequest}
              setAllEventInviteRequest={setAllEventInviteRequest}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Requests;
