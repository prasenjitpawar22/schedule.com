import React, { useEffect, useState } from "react";

import EmptyEventsCard from "@/src/components/EmptyEventsCard";
import { IEventFormData } from "@/src/types";
import { api } from "@/src/utils/api";
import { NextPage } from "next";
import { any } from "zod";
import AllEventsCard from "@/src/components/AllEventsCard";
import { Button } from "@/src/components/ui/button";
import { CreateEvent } from "@/src/components/CreateEvent";
import { Events } from "@prisma/client";

const Event: NextPage = ({}) => {
  const { data: AllEvents, isLoading } = api.events.getAllEvents.useQuery();
  const [open, setOpen] = useState<boolean | undefined>(false);

  const [AllEventsState, setAllEventsState] = useState(AllEvents);

  useEffect(() => {
    setAllEventsState(AllEvents);
  }, [isLoading]);

  //TODO: add shimmer effect
  if (isLoading) return <div>loading</div>;
  return (
    <div className="m-12">
      <div className="mb-12 flex items-baseline justify-between">
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

      <AllEventsCard
        AllEventsState={AllEventsState}
        setAllEventsState={setAllEventsState}
      />
    </div>
  );
};

export default Event;
