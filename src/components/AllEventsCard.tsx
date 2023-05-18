import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import UpdateEvent from "./UpdateEvent";
import { Button } from "./ui/button";
import { api } from "../utils/api";
import EmptyDataCard from "./EmptyDataCard";
import { IEvents } from "../@types";
import { Badge } from "./ui/badge";
import { useToast } from "./ui/use-toast";
import InviteAttendeeModal from "./InviteAttendeeModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

interface Props {
  AllEventsState: IEvents[] | undefined;
  setAllEventsState: React.Dispatch<
    React.SetStateAction<IEvents[] | undefined>
  >;
  allEventsToAttend: IEvents[] | undefined;
  setAllEventsToAttend: React.Dispatch<
    React.SetStateAction<IEvents[] | undefined>
  >;
}

const AllEventsCard = (props: Props) => {
  const {
    AllEventsState,
    setAllEventsState,
    allEventsToAttend,
    setAllEventsToAttend,
  } = props;
  const { toast } = useToast();
  const { mutateAsync } = api.events.deletEvent.useMutation();

  const [updateFormOpen, setUpdateFormOpen] = useState<boolean>(false);
  const [sendInviteModalState, setSendInviteModalState] = useState(false);

  dayjs.extend(relativeTime);

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
  if (!AllEventsState?.length && !allEventsToAttend?.length)
    return <EmptyDataCard description="event" mainText="any event planned!" />;

  return (
    <>
      {AllEventsState?.length ? (
        <Card className="mb-8 bg-muted text-primary">
          <CardHeader>
            <CardTitle>Your events </CardTitle>
          </CardHeader>
          <CardContent className="bg-ternary text-primary">
            <Accordion type="single" collapsible className="w-full">
              {AllEventsState &&
                AllEventsState.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="capitalize">
                      <div className="flex items-baseline gap-2">
                        <span>{item.title}</span>
                        <Badge
                          variant={"outline"}
                          className="tex-muted-foreground"
                        >
                          {dayjs(item.startDate).fromNow()}
                        </Badge>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="flex flex-col gap-2">
                        {item.description && (
                          <span>
                            Description:{" "}
                            <Badge
                              variant={"secondary"}
                              className={"text-muted-foreground"}
                            >
                              {item.description}
                            </Badge>{" "}
                          </span>
                        )}
                        {item.EventLocations.map((location, index) => (
                          <div key={index} className="flex w-full flex-wrap">
                            <div className="flex gap-1">
                              <span>{"Locations & time:"}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <Badge
                                variant={"secondary"}
                                className={"text-muted-foreground"}
                              >
                                {location.city} {location.state}{" "}
                                {location.country}
                              </Badge>
                              <Badge
                                variant={"secondary"}
                                className={"text-muted-foreground"}
                              >
                                from{" "}
                                {dayjs(item.startDate).format(
                                  "DD MMM YY h:mm A"
                                )}{" "}
                                to{" "}
                                {dayjs(item.endDate).format("DD MMM YY h:mm A")}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        <span className="capitalize">
                          Organizers:{" "}
                          {item.EventOrganizres.map((org, index) => (
                            <Badge
                              key={index}
                              variant={"secondary"}
                              className={"text-muted-foreground"}
                            >
                              {" "}
                              {org.organizerName}
                            </Badge>
                          ))}
                        </span>
                        <span className="mb-2 capitalize">
                          Attendees:{" "}
                          {item.Attende
                            ? item.Attende?.map((attendee, index) => (
                                <Badge
                                  key={index}
                                  variant={"secondary"}
                                  className={"text-muted-foreground"}
                                >
                                  {" "}
                                  {attendee.email}
                                </Badge>
                              ))
                            : "No list of attendees found"}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <UpdateEvent
                            AllEventsState={AllEventsState}
                            setAllEventsState={setAllEventsState}
                            open={updateFormOpen}
                            setOpen={setUpdateFormOpen}
                            event={item}
                          />
                          <InviteAttendeeModal
                            open={sendInviteModalState}
                            eventId={item.id}
                            setOpen={setSendInviteModalState}
                          />
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
      ) : null}

      {allEventsToAttend?.length ? (
        <Card className="bg-muted text-primary">
          <CardHeader>
            <CardTitle>Events where you are an attendee</CardTitle>
          </CardHeader>
          <CardContent className="bg-ternary text-primary">
            <Accordion type="single" collapsible className="w-full">
              {allEventsToAttend &&
                allEventsToAttend.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="capitalize">
                      <div className="flex items-baseline gap-2">
                        <span>{item.title}</span>
                        <Badge
                          variant={"outline"}
                          className="tex-muted-foreground"
                        >
                          {dayjs(item.startDate).fromNow()}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2">
                        {item.description && (
                          <span>
                            Description:{" "}
                            <Badge
                              variant={"secondary"}
                              className={"text-muted-foreground"}
                            >
                              {item.description}
                            </Badge>{" "}
                          </span>
                        )}
                        {item.EventLocations.map((location, index) => (
                          <div key={index} className="flex w-full flex-wrap">
                            <div className="flex gap-1">
                              <span className="">{"Locations & time:"}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <Badge
                                variant={"secondary"}
                                className={"text-muted-foreground"}
                              >
                                {location.city} {location.state}{" "}
                                {location.country}
                              </Badge>
                              <Badge
                                variant={"secondary"}
                                className={"text-muted-foreground"}
                              >
                                from{" "}
                                {dayjs(item.startDate).format(
                                  "DD MMM YY h:mm A"
                                )}{" "}
                                to{" "}
                                {dayjs(item.endDate).format("DD MMM YY h:mm A")}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        {/* {item.description && <span>{item.description}</span>} */}
                        {/* {item.EventLocations.map((location, index) => (
                          <span key={index} className="capitalize">
                            {location.city} {location.state} {location.country}:
                            {item.startDate.toString().split("GMT")[0]}
                            {" - "}
                            {item.endDate.toString().split("GMT")[0]}
                          </span>
                        ))} */}
                        <span className="capitalize">
                          Organizers:{" "}
                          {item.EventOrganizres.map((org, index) => (
                            <Badge
                              key={index}
                              variant={"secondary"}
                              className={"text-muted-foreground"}
                            >
                              {" "}
                              {org.organizerName}
                            </Badge>
                          ))}
                        </span>
                        <span className="mb-2 capitalize">
                          Attendees:{" "}
                          {item.Attende
                            ? item.Attende?.map((attendee, index) => (
                                <Badge
                                  key={index}
                                  className={"text-muted-foreground"}
                                  variant={"secondary"}
                                >
                                  {" "}
                                  {attendee.email}
                                </Badge>
                              ))
                            : "No list of attendees found"}
                        </span>

                        {/* TODO: handle operation like -leave event
                         <div className="flex flex-wrap gap-2">
                          <UpdateEvent
                            AllEventsState={AllEventsState}
                            setAllEventsState={setAllEventsState}
                            open={updateFormOpen}
                            setOpen={setUpdateFormOpen}
                            event={item}
                          />
                          <InviteAttendeeModal
                            open={sendInviteModalState}
                            eventId={item.id}
                            setOpen={setSendInviteModalState}
                          />
                          <Button
                            size={"sm"}
                            variant="outline"
                            className="w-fit"
                            onClick={() => handleEventDelete(item.id)}
                          >
                            Delete
                          </Button>
                        </div> */}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
};

export default AllEventsCard;
