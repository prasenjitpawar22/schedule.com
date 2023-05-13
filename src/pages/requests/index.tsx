import { ITeamMemberRequestAllData } from "@/src/@types";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/src/components/ui/table";
import { api } from "@/src/utils/api";

import React, { useEffect, useState } from "react";

const Requests = () => {
  const {
    data: allMemberRequestData,
    // error: allMemberRequestError,
    isLoading: allMemberRequestIsloading,
    refetch,
  } = api.request.getAllMemberRequest.useQuery();

  const [allMemberRequest, setAllMemberRequest] =
    useState<ITeamMemberRequestAllData[]>();

  const { mutateAsync, isLoading: acceptTeamRequsetIsloading } =
    api.request.acceptTeamMemberRequest.useMutation();

  const {
    mutateAsync: declineMutateAsync,
    isLoading: declineAddTeamMemberRequestIsloading,
  } = api.request.declineAddTeamMemberRequest.useMutation();

  useEffect(() => {
    setAllMemberRequest(allMemberRequestData);
  }, [allMemberRequestIsloading]);

  // console.log(allMemberRequestData, "member request data") ;

  async function handleAccpetTeamMemberRequest(
    request: ITeamMemberRequestAllData
  ) {
    // console.log(request);
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
    </div>
  );
};

export default Requests;
