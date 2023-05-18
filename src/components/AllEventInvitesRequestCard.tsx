import { TRPCError } from "@trpc/server";
import React, { useEffect } from "react";
import { IEventAttendeRequest } from "../@types";
import { api } from "../utils/api";
import AllDataCardShimmer from "./AllDataCardShimmer";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { useToast } from "./ui/use-toast";

interface Props {
  allEventInviteRequest: IEventAttendeRequest[] | undefined;
  setAllEventInviteRequest: React.Dispatch<
    React.SetStateAction<IEventAttendeRequest[] | undefined>
  >;
  setEmptyDataCard: React.Dispatch<React.SetStateAction<boolean>>;
}
const AllEventInvitesRequestCard = ({
  allEventInviteRequest,
  setAllEventInviteRequest,
  setEmptyDataCard,
}: Props) => {
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

  const { toast } = useToast();

  useEffect(() => {
    setAllEventInviteRequest(allEventInviteRequestData);
    if (allEventInviteRequestData?.length === 0) setEmptyDataCard(true);
  }, [allEventInviteRequestIsloading]);

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
        // update state for event request list
        setAllEventInviteRequest(
          allEventInviteRequest?.filter((list) => list.id != requestId)
        );
        toast({ title: "request declined" });
      })
      .catch((e: TRPCError) =>
        toast({ title: "error declining the requst", description: e.message })
      );
  };

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
                  disabled={declineEventAttendeeIsloading}
                  onClick={() => {
                    handleDeclineEventAttendeRequest(request.id);
                  }}
                  variant={"outline"}
                >
                  Decline
                </Button>
                {"    "}{" "}
                <Button
                  disabled={acceptEventAttendeeIsloading}
                  onClick={() => {
                    handleAccpetEventAttendeRequest(request);
                  }}
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
