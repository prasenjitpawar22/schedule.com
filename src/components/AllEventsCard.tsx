import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { type Events } from "@prisma/client";
import UpdateEvent from "./UpdateEvent";
import { Button } from "./ui/button";
import { api } from "../utils/api";
import EmptyEventsCard from "./EmptyEventsCard";

interface Props {
  AllEventsState: Events[] | undefined;
  setAllEventsState: React.Dispatch<React.SetStateAction<Events[] | undefined>>;
}

const AllEventsCard = (props: Props) => {
  const { AllEventsState, setAllEventsState } = props;

  const { mutateAsync } = api.events.deletEvent.useMutation();

  function handleEventDelete(id: string) {
    mutateAsync({ id })
      //optimzed just no backend call
      .then(() => {
        setAllEventsState(AllEventsState?.filter((item) => item.id !== id));
      })
      .catch((e) => console.log(e));
  }

  if (!AllEventsState?.length) return <EmptyEventsCard />;

  return (
    <>
      <Card>
        <CardContent className="bg-ternary text-primary">
          <Accordion type="single" collapsible className="w-full">
            {AllEventsState &&
              AllEventsState.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="capitalize">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-2">
                      <span>
                        Yes. It adheres to the WAI-ARIA design pattern.{" "}
                        {item.description}
                      </span>
                      <span className="capitalize">
                        {item.location}:{" "}
                        {item.startDate.toString().split("GMT")[0]}
                        {" - "}
                        {item.endDate.toString().split("GMT")[0]}
                      </span>
                      <div className="flex gap-2">
                        <UpdateEvent event={item} />
                        <Button
                          variant="outline"
                          className="w-fit"
                          onClick={() => handleEventDelete(item.id)}
                        >
                          Delete
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

export default AllEventsCard;
