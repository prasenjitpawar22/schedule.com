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
import { TRPCError } from "@trpc/server";

interface Props {
  AllEventsState: IEvents[] | undefined;
  setAllEventsState: React.Dispatch<
    React.SetStateAction<IEvents[] | undefined>
  >;
  allEventsToAttend: IEvents[] | undefined;
  setAllEventsToAttend: React.Dispatch<
    React.SetStateAction<IEvents[] | undefined>
  >;
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
  refreshData: boolean;
}

const AllEventsCard = (props: Props) => {
  const {
    AllEventsState,
    setAllEventsState,
    allEventsToAttend,
    setAllEventsToAttend,
    refreshData,
    setRefreshData,
  } = props;
  const { toast } = useToast();
  const { mutateAsync: deletEventMutateAsync, isLoading: deletEventIsLoading } =
    api.events.deletEvent.useMutation();
  const {
    mutateAsync: attendeeLeaveEventMutateAsync,
    isLoading: AttendeeLeaveEventIsLoading,
  } = api.events.AttendeeLeaveEvent.useMutation();

  const [updateFormOpen, setUpdateFormOpen] = useState<boolean>(false);
  const [sendInviteModalState, setSendInviteModalState] = useState(false);

  dayjs.extend(relativeTime);

  function handleEventDelete(id: string) {
    deletEventMutateAsync({ id })
      .then(() => {
        toast({
          title: "Event deleted",
        });

        setAllEventsState(AllEventsState?.filter((item) => item.id !== id));
        setRefreshData(!refreshData);
      })
      .catch((e) => console.log(e));
  }

  const handleLeaveEvent = (id: string) => {
    console.log(id);
    attendeeLeaveEventMutateAsync({
      eventId: id,
    })
      .then(() => {
        setAllEventsToAttend(
          allEventsToAttend?.filter((event) => event.id != id)
        );
        toast({ title: "You are no longer attendee" });
        setRefreshData(!refreshData);
      })
      .catch((e) => {
        if (e instanceof TRPCError)
          toast({
            variant: "destructive",
            title: "unable to process requeset",
            description: e.message,
          });
        else {
          toast({
            variant: "destructive",
            title: "unable to process requeset",
          });
        }
      });
  };

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
                            disabled={deletEventIsLoading}
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
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size={"sm"}
                            variant="outline"
                            disabled={AttendeeLeaveEventIsLoading}
                            className="w-fit"
                            onClick={() => handleLeaveEvent(item.id)}
                          >
                            Leave event
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
    </>
  );
};

export default AllEventsCard;
