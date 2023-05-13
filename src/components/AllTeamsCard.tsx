import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Team, type Events } from "@prisma/client";
import UpdateEvent from "./UpdateEvent";
import { Button } from "./ui/button";
import { api } from "../utils/api";
import EmptyDataCard from "./EmptyDataCard";
import { IEvents, ITeams } from "../@types";
import { Badge } from "./ui/badge";
import AddTeamMember from "./AddTeamMember";

interface Props {
  allTeamsState: ITeams[] | undefined;
  setAllTeamsState: React.Dispatch<React.SetStateAction<ITeams[] | undefined>>;
}

const AllTeamsCard = (props: Props) => {
  const { allTeamsState, setAllTeamsState } = props;

  const [addTeamMemeberModelState, setAddTeamMemeberModelState] =
    useState(false);
  const [updateFormOpen, setUpdateFormOpen] = useState<boolean>(false);

  const { mutateAsync, isLoading: teamDeleteIsloading } =
    api.teams.deleteTeam.useMutation();

  function handleTeamDelete(id: string) {
    mutateAsync({ teamId: id })
      //optimzed just no backend call
      .then(() => {
        setAllTeamsState(allTeamsState?.filter((item) => item.id !== id));
      })
      .catch((e) => console.log(e));
  }

  console.log(allTeamsState);

  if (!allTeamsState?.length)
    return <EmptyDataCard mainText={"any Team"} description={"team"} />;

  return (
    <>
      <Card>
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

                      <div className="flex gap-2">
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
    </>
  );
};

export default AllTeamsCard;
