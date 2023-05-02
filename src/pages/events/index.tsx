import React, { useEffect, useState } from "react";

import EmptyEventsCard from "@/src/components/EmptyEventsCard";
import { IEventFormData } from "@/src/types";
import { api } from "@/src/utils/api";
import { NextPage } from "next";
import { any } from "zod";
import AllEventsCard from "@/src/components/AllEventsCard";
import { Button } from "@/src/components/ui/button";
import { CreateEvent } from "@/src/components/CreateEvent";

const Event: NextPage = ({}) => {
  const [eventsData, setEventsData] = useState();
  const [eventFormData, setEventFormData] = useState<IEventFormData>({});

  const events = api.events.getAllEvents.useQuery();

  if (!events.data) return <div>loading</div>;

  return (
    <div className="m-12">
      <div className="mb-12 flex items-baseline justify-between">
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight lg:text-2xl">
          Events
        </h1>
        <CreateEvent
          eventFormData={eventFormData}
          setEventFormData={setEventFormData}
        />
      </div>

      {events.data && events.data.length && (
        <AllEventsCard events={events.data} />
      )}

      {!events.data && (
        <EmptyEventsCard
          eventFormData={eventFormData}
          setEventFormData={setEventFormData}
        />
      )}
    </div>
  );
};

export default Event;

// export const getServerSideProps = async () => {
//   const events = api.events.getAllEvents.useQuery();

//   return {
//     props: {
//       events: events,
//     },
//   };
// };
