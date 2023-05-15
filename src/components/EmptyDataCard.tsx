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
import { Textarea } from "@/src/components/ui/textarea";
import Image from "next/image";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

import { Button } from "@/src/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import ReactDatePicker from "react-datepicker";
import { CreateEvent } from "./CreateEvent";

interface Props {
  // setEventFormData: React.Dispatch<React.SetStateAction<IEventFormData>>;
  // eventFormData: IEventFormData;
  mainText: string;
  description: string;
}

const EmptyDataCard = ({ description, mainText }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Card
          className={`flex items-center justify-between
      bg-ternary
          p-4 text-foreground`}
        >
          <div>
            <CardHeader>
              <CardTitle>{`Look's like you don't have ${mainText}`}</CardTitle>
              {mainText !== "request" && (
                <CardDescription>{`Create a ${description}`}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="">{/* <CreateEvent /> */}</CardContent>
          </div>

          <CardFooter></CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EmptyDataCard;
