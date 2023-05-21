import React, { useEffect, useState } from "react";
import { api } from "@/src/utils/api";
import AllEventsCard from "@/src/components/AllEventsCard";
import { CreateEvent } from "@/src/components/CreateEvent";
import { IEvents } from "@/src/@types";
import AllDataCardShimmer from "@/src/components/AllDataCardShimmer";

const Event = ({}) => {
  const {
    data: AllEvents,
    isLoading,
    refetch: getAllCreatedEventsDataRefetch,
  } = api.events.getAllEvents.useQuery();
  const {
    data: allEventsToAttendData,
    isLoading: allEventsToAttendIsLoading,
    refetch: allEventsToAttendRefetch,
  } = api.events.getAllEventsWhereUserIsMemebr.useQuery();

  const [open, setOpen] = useState<boolean | undefined>(false);
  const [refreshData, setRefreshData] = useState(false);
  const [AllEventsState, setAllEventsState] = useState<IEvents[]>();
  const [allEventsToAttend, setAllEventsToAttend] = useState<IEvents[]>();

  useEffect(() => {
    setAllEventsState(AllEvents);
  }, [isLoading]);

  useEffect(() => {
    setAllEventsToAttend(allEventsToAttendData);
  }, [allEventsToAttendIsLoading]);

  //refresh data
  useEffect(() => {
    (async () => {
      await allEventsToAttendRefetch()
        .then((res) => {
          setAllEventsToAttend(res.data);
        })
        .catch((e) => console.log(e));
      await getAllCreatedEventsDataRefetch()
        .then((res) => {
          setAllEventsState(res.data);
        })
        .catch((e) => console.log(e));
    })().catch((e) => console.log(e));
  }, [refreshData]);

  return (
    <div className="m-12">
      <div className="mb-12 flex flex-wrap items-baseline justify-between">
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight lg:text-2xl">
          Events
        </h1>
        <CreateEvent
          open={open}
          setOpen={setOpen}
          AllEventsState={AllEventsState}
          setAllEventsState={setAllEventsState}
        />
      </div>

      {isLoading || allEventsToAttendIsLoading ? (
        <AllDataCardShimmer />
      ) : (
        <AllEventsCard
          AllEventsState={AllEventsState}
          setAllEventsState={setAllEventsState}
          allEventsToAttend={allEventsToAttend}
          setAllEventsToAttend={setAllEventsToAttend}
          setRefreshData={setRefreshData}
          refreshData={refreshData}
        />
      )}
    </div>
  );
};

export default Event;
