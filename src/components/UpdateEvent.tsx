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
import ReactDatePicker from "react-datepicker";
import { type Events } from "@prisma/client";
import { IEvents } from "../@types";
import { api } from "../utils/api";
import { Loader2 } from "lucide-react";

interface Props {
  event: IEvents;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  AllEventsState: IEvents[] | undefined;
  setAllEventsState: React.Dispatch<React.SetStateAction<IEvents[]>>;
}

const UpdateEvent = ({
  event,
  open,
  setOpen,
  AllEventsState,
  setAllEventsState,
}: Props) => {
  const { refetch, isLoading: refetchLoading } =
    api.events.getAllEvents.useQuery();

  const [eventUpdateFormState, setEventUpdateFormState] =
    useState<IEvents>(event);

  const { mutateAsync, isLoading } = api.events.updateEvent.useMutation();

  // handle update location
  function handleEventLocationUpdate(
    id: string,
    type: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const objectToUpdate = eventUpdateFormState.EventLocations.find(
      (loc) => loc.id === id
    );

    if (objectToUpdate) {
      if (type === "city") objectToUpdate.city = e.target.value;
      if (type === "state") objectToUpdate.state = e.target.value;
      if (type === "country") objectToUpdate.country = e.target.value;

      return objectToUpdate;
    }
  }

  function handleUpdate() {
    console.log(eventUpdateFormState);
    const {
      EventLocations,
      EventOrganizres,
      description,
      endDate,
      id,
      startDate,
      title,
      userId,
    } = eventUpdateFormState;
    mutateAsync({
      description,
      endDate,
      EventLocations,
      EventOrganizres,
      id,
      startDate,
      title,
      userId,
    })
      .then(() => {
        // TODO: make improvement here currently refetching the events
        refetch()
          .then((res) => {
            if (res.data) {
              setAllEventsState(res.data);
            }
            setOpen(false);
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <Button size={"sm"} onClick={() => setOpen(true)} className="w-fit">
          Update
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex h-4/5 flex-col justify-between sm:max-w-[425px]">
        <div className="flex flex-col gap-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Update Event</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Input
                id="title"
                placeholder="title"
                value={eventUpdateFormState.title}
                onChange={(e) =>
                  setEventUpdateFormState({
                    ...eventUpdateFormState,
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
                    setEventUpdateFormState({
                      ...eventUpdateFormState,
                      startDate: date,
                    });
                }}
                selected={eventUpdateFormState.startDate}
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
                    setEventUpdateFormState({
                      ...eventUpdateFormState,
                      endDate: date,
                    });
                }}
                selected={eventUpdateFormState.endDate}
                timeFormat="HH:mm"
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>
            {event.EventLocations.map((location, index) => (
              <div key={index} className="flex items-center gap-1">
                <Input
                  id="city"
                  placeholder="city"
                  // autoComplete="off"
                  value={location?.city}
                  onChange={(e) =>
                    setEventUpdateFormState({
                      ...eventUpdateFormState,
                      //  city: e.target.value,
                      EventLocations: event.EventLocations.map((loc) =>
                        loc.id === location.id
                          ? handleEventLocationUpdate(location.id, "city", e)!
                          : loc
                      ),
                    })
                  }
                  className=""
                />
                <Input
                  id="state"
                  placeholder="state"
                  // autoComplete="off"
                  value={location?.state}
                  onChange={(e) =>
                    setEventUpdateFormState({
                      ...eventUpdateFormState,
                      //  city: e.target.value,
                      EventLocations: event.EventLocations.map((loc) =>
                        loc.id === location.id
                          ? handleEventLocationUpdate(location.id, "state", e)!
                          : loc
                      ),
                    })
                  }
                  className=""
                />
                <Input
                  id="country"
                  placeholder="country"
                  // autoComplete="off"
                  value={location?.country}
                  onChange={(e) =>
                    setEventUpdateFormState({
                      ...eventUpdateFormState,
                      //  city: e.target.value,
                      EventLocations: event.EventLocations.map((loc) =>
                        loc.id === location.id
                          ? handleEventLocationUpdate(
                              location.id,
                              "country",
                              e
                            )!
                          : loc
                      ),
                    })
                  }
                  className=""
                />
              </div>
            ))}

            <div className="flex items-center ">
              <Textarea
                className="resize-none"
                placeholder="description"
                value={eventUpdateFormState.description}
                onChange={(e) =>
                  setEventUpdateFormState({
                    ...eventUpdateFormState,
                    description: e.target.value,
                  })
                }
                id="description"
              />
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <Button
            className={`flex items-center justify-center`}
            onClick={handleUpdate}
          >
            Update
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateEvent;
