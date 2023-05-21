import React from "react";
import { ITeamMemberRequestAllData } from "../@types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

interface Props {
  allMemberRequest: ITeamMemberRequestAllData[] | undefined;
  declineAddTeamMemberRequestIsloading: boolean;
  handleDeclineRequestForTeamMember(
    request: ITeamMemberRequestAllData
  ): Promise<void>;
  acceptTeamRequsetIsloading: boolean;
  handleAccpetTeamMemberRequest(
    request: ITeamMemberRequestAllData
  ): Promise<void>;
}

export const AllMemberRequestCard = ({
  allMemberRequest,
  declineAddTeamMemberRequestIsloading,
  handleDeclineRequestForTeamMember,
  acceptTeamRequsetIsloading,
  handleAccpetTeamMemberRequest,
}: Props) => {
  return allMemberRequest?.length ? (
    <Card className="bg-ternary p-4">
      <Table className="bg-ternary text-primary">
        <TableBody>
          {allMemberRequest?.map((request, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                Add team member request from{" "}
                <Badge variant={"default"}> @{request.fromMemberName}</Badge>{" "}
                for team{" "}
                <span className="underline">{request.team?.teamName}</span>
              </TableCell>
              <TableCell className="flex gap-2 text-right">
                <Button
                  disabled={declineAddTeamMemberRequestIsloading}
                  onClick={() => {
                    handleDeclineRequestForTeamMember(request)
                      .then(() => {
                        return;
                      })
                      .catch((e) => console.log(e));
                  }}
                  variant={"outline"}
                >
                  Decline
                </Button>
                {"    "}{" "}
                <Button
                  disabled={acceptTeamRequsetIsloading}
                  onClick={() => {
                    handleAccpetTeamMemberRequest(request)
                      .then(() => {
                        return;
                      })
                      .catch((e) => console.log(e));
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
  ) : null;
};
