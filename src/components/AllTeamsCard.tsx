import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import { api } from "../utils/api";
import EmptyDataCard from "./EmptyDataCard";
import { ITeams } from "../@types";
import { Badge } from "./ui/badge";
import AddTeamMember from "./AddTeamMember";
import { useToast } from "./ui/use-toast";
import { TRPCError } from "@trpc/server";

interface Props {
  allTeamsState: ITeams[] | undefined;
  setAllTeamsState: React.Dispatch<React.SetStateAction<ITeams[] | undefined>>;
  teamsWhereUserIsMemberState: ITeams[] | undefined;
  setTeamsWhereUserIsMemberState: React.Dispatch<
    React.SetStateAction<ITeams[] | undefined>
  >;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}

const AllTeamsCard = (props: Props) => {
  const { allTeamsState, teamsWhereUserIsMemberState, refresh, setRefresh } =
    props;

  const { toast } = useToast();
  const [addTeamMemeberModelState, setAddTeamMemeberModelState] =
    useState(false);
  const { mutateAsync, isLoading: teamDeleteIsloading } =
    api.teams.deleteTeam.useMutation();

  const {
    mutateAsync: userLeaveTeamMutateAsync,
    isLoading: userLeaveTeamIsLoading,
  } = api.teams.userLeaveTeam.useMutation();

  function handleTeamDelete(id: string) {
    mutateAsync({ teamId: id })
      //optimzed just no backend call
      .then(() => {
        setRefresh(!refresh);
      })
      .catch((e) => console.log(e));
  }

  const handleLeaveTeam = (teamId: string) => {
    userLeaveTeamMutateAsync({
      teamId,
    })
      .then(() => {
        setRefresh(!refresh);
        toast({
          title: "success",
        });
      })
      .catch((e: TRPCError) => {
        toast({
          title: "error",
          variant: "destructive",
          description: e.message,
        });
      });
  };

  if (!allTeamsState?.length && !teamsWhereUserIsMemberState?.length)
    return <EmptyDataCard mainText={"any Team"} description={"team"} />;

  return (
    <>
      {allTeamsState?.length !== 0 && (
        <Card className="mb-8 bg-muted text-primary">
          <CardHeader>
            <CardTitle>Your teams</CardTitle>
          </CardHeader>
          <CardContent className="bg-ternary text-primary">
            <Accordion type="single" collapsible className="w-full">
              {allTeamsState &&
                allTeamsState.map((team, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="capitalize">
                      {team.teamName}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-5">
                        {!team.TeamMembers.length ? (
                          <span>No team members</span>
                        ) : (
                          <span className="flex gap-2">
                            <span>Members: </span>
                            {team.TeamMembers.map((member, index) => (
                              <Badge
                                variant={"secondary"}
                                className="w-fit"
                                key={index}
                              >
                                {" "}
                                {member.memberEmail}{" "}
                              </Badge>
                            ))}
                          </span>
                        )}

                        <div className="flex flex-wrap gap-2">
                          <AddTeamMember
                            teamId={team.id}
                            open={addTeamMemeberModelState}
                            setOpen={setAddTeamMemeberModelState}
                          />
                          <Button
                            size={"sm"}
                            disabled={teamDeleteIsloading}
                            variant="ghost"
                            className="w-fit"
                            onClick={() => handleTeamDelete(team.id)}
                          >
                            Delete team
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
      {teamsWhereUserIsMemberState?.length !== 0 && (
        <Card className="bg-muted text-primary">
          <CardHeader>
            <CardTitle>Teams where you are a member</CardTitle>
          </CardHeader>
          <CardContent className="bg-ternary text-primary">
            <Accordion type="single" collapsible className="w-full">
              {teamsWhereUserIsMemberState &&
                teamsWhereUserIsMemberState.map((team, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="capitalize">
                      {team.teamName}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-5">
                        {!team.TeamMembers.length ? (
                          <span>No team members</span>
                        ) : (
                          <span className="flex gap-2">
                            <span>Members: </span>
                            {team.TeamMembers.map((member, index) => (
                              <Badge
                                variant={"secondary"}
                                className="w-fit"
                                key={index}
                              >
                                {" "}
                                {member.memberEmail}{" "}
                              </Badge>
                            ))}
                          </span>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size={"sm"}
                            disabled={userLeaveTeamIsLoading}
                            variant="outline"
                            className="w-fit"
                            onClick={() => handleLeaveTeam(team.id)}
                          >
                            Leave team
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AllTeamsCard;
