import React, { ReactNode, useEffect, useState } from "react";
import { Badge } from "@/src/components/ui/badge";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";

import ReactDatePicker from "react-datepicker";
import { api } from "../utils/api";
import { IEventDto, IEvents, IOrganizerFormData } from "../@types";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";

interface Props {
  AllEventsState: IEvents[] | undefined;
  setAllEventsState: React.Dispatch<
    React.SetStateAction<IEvents[] | undefined>
  >;
  open: boolean | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export const CreateEvent = (props: Props) => {
  const { setAllEventsState, AllEventsState, open, setOpen } = props;
  const {
    data: userSession,
    // status: userSessionStatus,
    // update: userUpdateSession,
  } = useSession();
  const { refetch } = api.events.getAllEvents.useQuery();

  const { toast } = useToast();

  const [organizersFormData, setOrganizersFormData] = useState<
    IOrganizerFormData[] | undefined
  >([
    {
      organizerName: userSession?.user?.name ?? "",
      eventsId: userSession?.user?.id ?? "",
    },
  ]);

  const [eventFormData, setEventFormData] = useState<IEventDto>({
    description: "",
    endDate: new Date(),
    startDate: new Date(),
    title: "",
    city: "",
    country: "",
    state: "",
    organizers: organizersFormData!,
  });

  const { mutateAsync, isLoading } = api.events.createEvent.useMutation();

  const handleEventCreate = () => {
    // console.log(eventFormData);
    const {
      description,
      endDate,
      startDate,
      title,
      country,
      state,
      city,
      organizers,
    } = eventFormData;

    mutateAsync({
      description: description,
      title: title,
      startDate: startDate,
      endDate: endDate,
      city,
      country,
      state,
      userId: userSession?.user?.id,
      organizerName: organizers.map((d) => d.organizerName),
    })
      .then(() => {
        // less optmiszed fetching all events again
        toast({ title: "Event created" });
        refetch()
          .then((res) => {
            if (res.data) {
              setAllEventsState(res.data);
            }
            setOpen(false);
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => {
        console.log(e);
        setOpen(false);
      });

    // eventFormData.organizerName.filter((s)=> s.organizerName)
    setEventFormData({
      description: "",
      endDate: new Date(),
      startDate: new Date(),
      title: "",
      city: "",
      country: "",
      state: "",
      organizers: organizersFormData!,
    });
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Create</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col justify-between xs:h-full sm:h-fit sm:max-w-[425px]">
        <div className="flex flex-col gap-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Create Event</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Input
                id="title"
                placeholder="title"
                value={eventFormData?.title}
                onChange={(e) =>
                  setEventFormData({
                    ...eventFormData,
                    title: e.target.value,
                  })
                }
                className=""
              />
            </div>
            <div className="flex items-center gap-1">
              <ReactDatePicker
                className={
                  "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                }
                showTimeSelect
                placeholderText="Event start date and time"
                onChange={(date) => {
                  date &&
                    setEventFormData({
                      ...eventFormData,
                      startDate: date,
                    });
                }}
                selected={eventFormData.startDate}
                timeFormat="HH:mm"
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>
            <div className="flex items-center gap-1">
              <ReactDatePicker
                className={
                  "flex h-10 w-full rounded-md border border-input bg-ternary px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                }
                placeholderText="Event end date and time"
                showTimeSelect
                onChange={(date) => {
                  date &&
                    setEventFormData({
                      ...eventFormData,
                      endDate: date,
                    });
                }}
                selected={eventFormData.endDate}
                timeFormat="HH:mm"
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>
            <div className="flex items-center gap-1">
              <Input
                id="city"
                placeholder="city"
                // autoComplete="off"
                value={eventFormData?.city}
                onChange={(e) =>
                  setEventFormData({
                    ...eventFormData,
                    city: e.target.value,
                  })
                }
                className=""
              />
              <Input
                id="state"
                placeholder="state"
                // autoComplete="off"
                value={eventFormData?.state}
                onChange={(e) =>
                  setEventFormData({
                    ...eventFormData,
                    state: e.target.value,
                  })
                }
                className=""
              />
              <Input
                id="country"
                placeholder="country"
                // autoComplete="off"
                value={eventFormData?.country}
                onChange={(e) =>
                  setEventFormData({
                    ...eventFormData,
                    country: e.target.value,
                  })
                }
                className=""
              />
            </div>
            <div className="flex items-center ">
              <Textarea
                className="resize-none"
                placeholder="description"
                value={eventFormData.description}
                onChange={(e) =>
                  setEventFormData({
                    ...eventFormData,
                    description: e.target.value,
                  })
                }
                id="description"
              />
            </div>
            <div className="flex items-center ">
              {/* TODO: add organizers: default will be event creator  */}
              <Label className="flex items-center gap-1">
                Organizers:{" "}
                <div className="flex gap-1">
                  <Badge variant={"default"}> {userSession?.user.name}</Badge>
                </div>
              </Label>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={() => handleEventCreate()}
            className={`flex items-center justify-center`}
          >
            Create
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
