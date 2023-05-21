import React from "react";
import { IEventAttendeRequest, ITeamMemberRequestAllData } from "../@types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

interface Props {
  allEventInviteRequestIsloading: boolean;
  allEventInviteRequest: IEventAttendeRequest[] | undefined;
  declineEventAttendeeIsloading: boolean;
  acceptEventAttendeeIsloading: boolean;
  handleAccpetEventAttendeRequest: (request: IEventAttendeRequest) => void;
  handleDeclineEventAttendeRequest: (requestId: string) => void;
}
const AllEventInvitesRequestCard = ({
  allEventInviteRequestIsloading,
  allEventInviteRequest,
  acceptEventAttendeeIsloading,
  declineEventAttendeeIsloading,
  handleAccpetEventAttendeRequest,
  handleDeclineEventAttendeRequest,
}: Props) => {
  //TODO: make full card
  return (
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
                  disabled={
                    declineEventAttendeeIsloading ||
                    acceptEventAttendeeIsloading
                  }
                  onClick={() => {
                    handleDeclineEventAttendeRequest(request.id);
                  }}
                  variant={"outline"}
                >
                  Decline
                </Button>
                {"    "}{" "}
                <Button
                  disabled={
                    acceptEventAttendeeIsloading ||
                    declineEventAttendeeIsloading
                  }
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
