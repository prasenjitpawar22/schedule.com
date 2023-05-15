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
import EmptyDataCard from "./EmptyDataCard";
import { IEvents } from "../@types";
import { Badge } from "./ui/badge";
import { useToast } from "./ui/use-toast";

interface Props {
  AllEventsState: IEvents[];
  setAllEventsState: React.Dispatch<React.SetStateAction<IEvents[]>>;
}

const AllEventsCard = (props: Props) => {
  const { AllEventsState, setAllEventsState } = props;
  const { toast } = useToast();

  const [updateFormOpen, setUpdateFormOpen] = useState<boolean>(false);
  const { mutateAsync } = api.events.deletEvent.useMutation();

  function handleEventDelete(id: string) {
    mutateAsync({ id })
      //optimzed just no backend call
      .then(() => {
        toast({
          title: "Event deleted",
        });
        setAllEventsState(AllEventsState?.filter((item) => item.id !== id));
      })
      .catch((e) => console.log(e));
  }

  //handle send event invite email and add to eventInviteRequest table
  const handleSendInvitesRequest = (event: IEvents) => {
    console.log(event);
  };

  if (!AllEventsState?.length)
    return <EmptyDataCard description="event" mainText="any event planned!" />;

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
                      {item.EventLocations.map((location, index) => (
                        <span key={index} className="capitalize">
                          {location.city} {location.state} {location.country}:
                          {item.startDate.toString().split("GMT")[0]}
                          {" - "}
                          {item.endDate.toString().split("GMT")[0]}
                        </span>
                      ))}
                      <span className="mb-2 capitalize">
                        Organizers:{" "}
                        {item.EventOrganizres.map((org, index) => (
                          <Badge key={index} variant={"secondary"}>
                            {" "}
                            {org.organizerName}
                          </Badge>
                        ))}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <UpdateEvent
                          AllEventsState={AllEventsState}
                          setAllEventsState={setAllEventsState}
                          open={updateFormOpen}
                          setOpen={setUpdateFormOpen}
                          event={item}
                        />
                        <Button
                          onClick={() => handleSendInvitesRequest(item)}
                          size={"sm"}
                        >
                          Send invites
                        </Button>
                        <Button
                          size={"sm"}
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
