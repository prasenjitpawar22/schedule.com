import React, { useEffect, useState } from "react";
import { ITeamMemberRequestAllData } from "../@types";
import { api } from "../utils/api";
import EmptyDataCard from "./EmptyDataCard";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

interface Props {
  allMemberRequest: ITeamMemberRequestAllData[] | undefined;
  setAllMemberRequest: React.Dispatch<
    React.SetStateAction<ITeamMemberRequestAllData[] | undefined>
  >;
  setEmptyDataCard: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AllMemberRequestCard = ({
  allMemberRequest,
  setAllMemberRequest,
  setEmptyDataCard,
}: Props) => {
  const {
    data: allMemberRequestData,
    isLoading: allMemberRequestIsloading,
    refetch,
  } = api.request.getAllMemberRequest.useQuery();

  const {
    mutateAsync: declineMutateAsync,
    isLoading: declineAddTeamMemberRequestIsloading,
  } = api.request.declineAddTeamMemberRequest.useMutation();

  const { mutateAsync, isLoading: acceptTeamRequsetIsloading } =
    api.request.acceptTeamMemberRequest.useMutation();

  useEffect(() => {
    setAllMemberRequest(allMemberRequestData);
    console.log(allMemberRequestData, "allMemberRequestData");

    if (allMemberRequestData?.length === 0) setEmptyDataCard(true);
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
