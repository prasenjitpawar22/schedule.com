import React from "react";

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

interface Props {
  setEventFormData: React.Dispatch<React.SetStateAction<IEventFormData>>;
  eventFormData: IEventFormData;
}

export const CreateEvent = (props: Props) => {
  const { eventFormData, setEventFormData } = props;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Create</Button>
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
          <AlertDialogCancel onClick={() => setEventFormData({})}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction>Create</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
