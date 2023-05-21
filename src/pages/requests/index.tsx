import { IEventAttendeRequest, ITeamMemberRequestAllData } from "@/src/@types";
import AllDataCardShimmer from "@/src/components/AllDataCardShimmer";
import AllEventInvitesRequestCard from "@/src/components/AllEventInvitesRequestCard";
import { AllMemberRequestCard } from "@/src/components/AllMemberRequestCard";
import EmptyDataCard from "@/src/components/EmptyDataCard";
import { useToast } from "@/src/components/ui/use-toast";
import { api } from "@/src/utils/api";
import { TRPCError } from "@trpc/server";

import React, { useEffect, useState } from "react";

//TODO: work on this shit
const Requests = () => {
  const [allMemberRequest, setAllMemberRequest] =
    useState<ITeamMemberRequestAllData[]>();
  const [allEventInviteRequest, setAllEventInviteRequest] =
    useState<IEventAttendeRequest[]>();

  const [allMembersEmptyDataCardState, setAllMembersEmptyDataCardState] =
    useState<boolean>(false);
  const [allEventsEmptyDataCardState, setAllEventsEmptyDataCardState] =
    useState<boolean>(false);

  const { toast } = useToast();

  const {
    data: allEventInviteRequestData,
    isLoading: allEventInviteRequestIsloading,
    refetch: allEventInviteRequesRefetch,
  } = api.request.getAllEventInviteRequests.useQuery();

  const {
    mutateAsync: acceptEventAttendeeMutateAsync,
    isLoading: acceptEventAttendeeIsloading,
  } = api.request.acceptEventAttendRequest.useMutation();

  const {
    mutateAsync: declineEventAttendeeMutateAsync,
    isLoading: declineEventAttendeeIsloading,
  } = api.request.declineEventAttendeRequest.useMutation();

  useEffect(() => {
    setAllEventInviteRequest(allEventInviteRequestData);
  }, [allEventInviteRequestIsloading]);
  useEffect(() => {
    if (allEventInviteRequest?.length === 0)
      setAllEventsEmptyDataCardState(true);
  }, [allEventInviteRequest]);

  // events
  const handleAccpetEventAttendeRequest = (request: IEventAttendeRequest) => {
    acceptEventAttendeeMutateAsync({
      eventId: request.eventsId,
      fromEmail: request.fromEmail,
      requestId: request.id,
      toEmail: request.toEmail,
    })
      .then(() => {
        // update state for event request list
        setAllEventInviteRequest(
          allEventInviteRequest?.filter((list) => list.id != request.id)
        );
        toast({ title: "request accepted" });
      })
      .catch((e: TRPCError) =>
        toast({ title: "error accepting requst", description: e.message })
      );
  };

  const handleDeclineEventAttendeRequest = (requestId: string) => {
    declineEventAttendeeMutateAsync({
      requestId,
    })
      .then(() => {
        setAllEventInviteRequest(
          allEventInviteRequest?.filter((list) => list.id != requestId)
        );
        toast({ title: "request declined" });
      })
      .catch((e: TRPCError) =>
        toast({ title: "error declining the requst", description: e.message })
      );
  };

  // --------------

  const {
    data: allMemberRequestData,
    isLoading: allMemberRequestIsloading,
    refetch,
  } = api.request.getAllMemberRequest.useQuery();

  const {
    mutateAsync: declineMutateAsync,
    isLoading: declineAddTeamMemberRequestIsloading,
  } = api.request.declineAddTeamMemberRequest.useMutation();

  useEffect(() => {
    console.log(allEventInviteRequestIsloading, "alleve");
  });

  const { mutateAsync, isLoading: acceptTeamRequsetIsloading } =
    api.request.acceptTeamMemberRequest.useMutation();

  useEffect(() => {
    setAllMemberRequest(allMemberRequestData);
    if (allMemberRequestData?.length === 0)
      setAllMembersEmptyDataCardState(true);
  }, [allMemberRequestIsloading, refetch]);

  async function handleAccpetTeamMemberRequest(
    request: ITeamMemberRequestAllData
  ) {
    await mutateAsync({
      fromMemeberEmail: request.fromMemeberEmail,
      requestId: request.id,
      teamId: request.team?.id ?? "",
      toMemberEmail: request.toMemberEmail,
    })
      .then((res) => {
        // console.log(res);
        //TODO: make more efficient
        refetch()
          .then((res) => setAllMemberRequest(res.data))
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
    return;
  }
  async function handleDeclineRequestForTeamMember(
    request: ITeamMemberRequestAllData
  ) {
    await declineMutateAsync({
      requestId: request.id,
    })
      .then(() => {
        //TODO: don't like using refetch lesss efficient
        refetch()
          .then((res) => {
            setAllMemberRequest(res.data);
            return;
          })
          .catch((e) => {
            console.log(e);
            return;
          });
      })
      .catch((e) => {
        console.log(e);
        return;
      });
    return;
  }

  return (
    <div className="m-12">
      <div className="mb-12 flex items-baseline justify-between gap-24">
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight lg:text-2xl">
          Requests
        </h1>
      </div>
      {allMemberRequestIsloading && <AllDataCardShimmer />}
      {!allMemberRequestIsloading &&
        allMemberRequest?.length === 0 &&
        allEventInviteRequest?.length === 0 && (
          <EmptyDataCard description="" mainText="request" />
        )}

      {!allMemberRequestIsloading && allMemberRequest?.length !== 0 && (
        <AllMemberRequestCard
          acceptTeamRequsetIsloading={acceptTeamRequsetIsloading}
          allMemberRequest={allMemberRequest}
          declineAddTeamMemberRequestIsloading={
            declineAddTeamMemberRequestIsloading
          }
          handleAccpetTeamMemberRequest={handleAccpetTeamMemberRequest}
          handleDeclineRequestForTeamMember={handleDeclineRequestForTeamMember}
        />
      )}
      {!allMemberRequestIsloading && allEventInviteRequest?.length !== 0 && (
        <AllEventInvitesRequestCard
          acceptEventAttendeeIsloading={acceptEventAttendeeIsloading}
          allEventInviteRequest={allEventInviteRequest}
          allEventInviteRequestIsloading={allEventInviteRequestIsloading}
          declineEventAttendeeIsloading={declineEventAttendeeIsloading}
          handleAccpetEventAttendeRequest={handleAccpetEventAttendeRequest}
          handleDeclineEventAttendeRequest={handleDeclineEventAttendeRequest}
        />
      )}
    </div>
  );
};

export default Requests;
