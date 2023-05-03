import React, { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
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

import type { IEventFormData } from "../types";
import ReactDatePicker from "react-datepicker";
import { api } from "../utils/api";
import { Events } from "@prisma/client";
import { IEventDto } from "../@types";
import { Loader2 } from "lucide-react";

interface Props {
  AllEventsState: Events[] | undefined;
  setAllEventsState: React.Dispatch<React.SetStateAction<Events[] | undefined>>;
  open: boolean | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export const CreateEvent = (props: Props) => {
  const { setAllEventsState, AllEventsState, open, setOpen } = props;
  const { refetch } = api.events.getAllEvents.useQuery();

  const [eventFormData, setEventFormData] = useState<IEventDto>({
    description: "",
    endDate: new Date(),
    location: "",
    startDate: new Date(),
    title: "",
  });

  const { mutateAsync, isLoading } = api.events.createEvent.useMutation();

  const handleEventCreate = async () => {
    const { description, endDate, location, startDate, title } = eventFormData;
    mutateAsync({
      description: description,
      title: title,
      startDate: startDate,
      endDate: endDate,
      location: location,
    })
      .then((res) => {
        // less optmiszed fetching all events again
        refetch().then((res) => {
          setAllEventsState(res.data);
          setOpen(false);
        });
      })
      .catch((e) => {
        console.log(e);
        setOpen(false);
      });

    setEventFormData({
      description: "",
      endDate: new Date(),
      location: "",
      startDate: new Date(),
      title: "",
    });
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Create</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex h-4/5 flex-col justify-between sm:max-w-[425px]">
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
                  "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                id="location"
                placeholder="location"
                // autoComplete="off"
                value={eventFormData?.location}
                onChange={(e) =>
                  setEventFormData({
                    ...eventFormData,
                    location: e.target.value,
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
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              console.log("as");
              setOpen!(false);
            }}
          >
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
