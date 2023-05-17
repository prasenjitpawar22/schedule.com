import { api } from "@/src/utils/api";
import React, { FormEvent, useEffect, useState } from "react";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

import AllTeamsCard from "@/src/components/AllTeamsCard";
import { ITeams } from "@/src/@types";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useToast } from "@/src/components/ui/use-toast";
import AllDataCardShimmer from "@/src/components/AllDataCardShimmer";

const Teams = () => {
  const {
    data: allTeamsData,
    isLoading: allTeamsDataIsloading,
    refetch,
  } = api.teams.getAllTeams.useQuery();

  const {
    data: teamsWhereUserIsMemberData,
    isLoading: teamsWhereUserIsMemberIsLoading,
  } = api.teams.getTeamsWhereUserIsMember.useQuery();
  const { mutateAsync, isLoading: createTeamIsloading } =
    api.teams.createTeam.useMutation();

  const [teams, setTeams] = useState<ITeams[]>();
  const [teamsWhereUserIsMemberState, setTeamsWhereUserIsMemberState] =
    useState<ITeams[] | undefined>();

  const [createTeamName, setCreateTeamName] = useState<string>("");

  const { toast } = useToast();

  useEffect(() => {
    setTeams(allTeamsData);
  }, [allTeamsDataIsloading]);

  useEffect(() => {
    setTeamsWhereUserIsMemberState(teamsWhereUserIsMemberData);
  }, [teamsWhereUserIsMemberIsLoading]);

  // create team
  const handleTeamCreate = (e: FormEvent) => {
    e.preventDefault();

    (async () => {
      await mutateAsync({
        teamName: createTeamName,
      })
        .then(async (res) => {
          toast({
            title: "Team created",
          });

          //TODO: refetch all teams make more efficient method
          await refetch()
            .then((res) => {
              setTeams(res.data);
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    })().catch((e) => console.log(e));
  };

  return (
    <div className="m-12">
      <div className="mb-12 flex flex-wrap items-baseline justify-between  sm:flex-col sm:gap-2 md:flex-row ">
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight lg:text-2xl">
          Teams
        </h1>
        <form onSubmit={(e) => handleTeamCreate(e)} className="flex gap-2">
          <Input
            onChange={(e) => setCreateTeamName(e.target.value)}
            value={createTeamName}
            className="bg-ternary"
            type={"text"}
            placeholder="team name"
          />
          <Button disabled={createTeamIsloading} type="submit">
            Create
          </Button>
        </form>
      </div>
      {allTeamsDataIsloading ? (
        <AllDataCardShimmer />
      ) : (
        <AllTeamsCard
          teamsWhereUserIsMemberState={teamsWhereUserIsMemberState}
          setTeamsWhereUserIsMemberState={setTeamsWhereUserIsMemberState}
          allTeamsState={teams}
          setAllTeamsState={setTeams}
        />
      )}
    </div>
  );
};

export default Teams;
