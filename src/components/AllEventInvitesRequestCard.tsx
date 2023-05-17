import { EventAttendeRequest } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { IEventAttendeRequest } from "../@types";
import { api } from "../utils/api";
import AllDataCardShimmer from "./AllDataCardShimmer";
import EmptyDataCard from "./EmptyDataCard";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

interface Props {
  allEventInviteRequest: IEventAttendeRequest[] | undefined;
  setAllEventInviteRequest: React.Dispatch<
    React.SetStateAction<IEventAttendeRequest[] | undefined>
  >;
  setEmptyDataCard: React.Dispatch<React.SetStateAction<boolean>>;
  // setDataLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
}
const AllEventInvitesRequestCard = ({
  allEventInviteRequest,
  setAllEventInviteRequest,
  setEmptyDataCard,
}: // setDataLoadingState,
Props) => {
  const {
    data: allEventInviteRequestData,
    isLoading: allEventInviteRequestIsloading,
    refetch: allEventInviteRequesRefetch,
  } = api.request.getAllEventInviteRequests.useQuery();

  // const { mutateAsync, isLoading: acceptTeamRequsetIsloading } =
  //   api.request.acceptTeamMemberRequest.useMutation();

  useEffect(() => {
    setAllEventInviteRequest(allEventInviteRequestData);
    if (allEventInviteRequestData?.length === 0) setEmptyDataCard(true);
    // setDataLoadingState(false);
  }, [allEventInviteRequestIsloading]);

  console.log(allEventInviteRequestData);

  // const {
  //   mutateAsync: declineMutateAsync,
  //   isLoading: declineAddTeamMemberRequestIsloading,
  // } = api.request.declineAddTeamMemberRequest.useMutation();

  // async function handleAccpetTeamMemberRequest(
  //   request: EventAttendeRequest
  // ) {
  //   // console.log(request);
  //   await mutateAsync({
  //     fromMemeberEmail: request.fromMemeberEmail,
  //     requestId: request.id,
  //     teamId: request.team?.id ?? "",
  //     toMemberEmail: request.toMemberEmail,
  //   })
  //     .then((res) => {
  //       // console.log(res);
  //       //TODO: make more efficient
  //       allEventInviteRequesRefetch()
  //         .then((res) => setAllEventInviteRequest(res.data))
  //         .catch((e) => console.log(e));
  //     })
  //     .catch((e) => console.log(e));
  //   return;
  // }
  // async function handleDeclineRequestForTeamMember(
  //   request: EventAttendeRequest
  // ) {
  //   await declineMutateAsync({
  //     requestId: request.id,
  //   })
  //     .then(() => {
  //       //TODO: don't like using refetch lesss efficient
  //       allEventInviteRequesRefetch()
  //         .then((res) => {
  //           setAllEventInviteRequest(res.data);
  //           return;
  //         })
  //         .catch((e) => {
  //           console.log(e);
  //           return;
  //         });
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //       return;
  //     });
  //   return;
  // }

  return allEventInviteRequestIsloading ? (
    <AllDataCardShimmer />
  ) : (
    <Card className="bg-ternary p-4">
      <Table className="bg-ternary text-primary">
        <TableBody>
          {allEventInviteRequest?.map((request, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                Join event{" "}
                <span className="underline">{request.eventName}</span> request
                from <Badge variant={"default"}> @{request.fromEmail}</Badge>
              </TableCell>
              <TableCell className="flex gap-2 text-right">
                <Button
                  // disabled={declineAddTeamMemberRequestIsloading}
                  // onClick={() => {
                  //   handleDeclineRequestForTeamMember(request)
                  //     .then(() => {
                  //       return;
                  //     })
                  //     .catch((e) => console.log(e));
                  // }}
                  variant={"outline"}
                >
                  Decline
                </Button>
                {"    "}{" "}
                <Button
                // disabled={acceptTeamRequsetIsloading}
                // onClick={() => {
                //   handleAccpetTeamMemberRequest(request)
                //     .then(() => {
                //       return;
                //     })
                //     .catch((e) => console.log(e));
                // }}
                >
                  Accept
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default AllEventInvitesRequestCard;
