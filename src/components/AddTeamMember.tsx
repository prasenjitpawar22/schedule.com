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
import { Loader2, X } from "lucide-react";
import { Badge } from "./ui/badge";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  teamId: string;
}

const AddTeamMember = ({ open, setOpen, teamId }: Props) => {
  const [memberEmail, setMemberEmail] = useState("");
  const [allMemberList, setAllMemberList] = useState<string[]>([]);

  const { mutateAsync, isLoading } =
    api.request.sendMemberRequest.useMutation();

  async function handleRequestAddTeamMember() {
    await mutateAsync({
      teamId,
      toMembersEmail: allMemberList,
      toMemberName: "",
    })
      .then((res) => {
        console.log(res);
        setAllMemberList([]);
        setMemberEmail("");
        setOpen(false);
      })
      .catch((e) => console.error(e));
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <Button onClick={() => setOpen(true)} className="w-fit" size={"sm"}>
          Add team member
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex h-4/5 flex-col justify-between sm:max-w-[425px]">
        <div className="flex grow flex-col gap-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Add Team members</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex h-full flex-col gap-4 py-4">
            <div className="flex flex-none items-center gap-4">
              <Input
                id="title"
                placeholder="member email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                className=""
              />
              <Button
                onClick={() =>
                  setAllMemberList([...allMemberList, memberEmail])
                }
              >
                Add
              </Button>
            </div>
            <div className="max-h-48 grow gap-2 overflow-scroll overflow-x-hidden rounded bg-secondary p-4">
              {allMemberList?.map((member, index) => (
                <Badge className="relative m-1 h-fit" key={index}>
                  {member}{" "}
                  <span
                    onClick={() =>
                      setAllMemberList(
                        allMemberList.filter((item) => item !== member)
                      )
                    }
                    className="absolute -right-2 -top-2  cursor-pointer rounded-full  bg-destructive px-1 hover:bg-red-600"
                  >
                    <X size={12} />
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <AlertDialogFooter className="">
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <Button
            className={`flex items-center justify-center`}
            onClick={() => handleRequestAddTeamMember}
          >
            Send Request
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddTeamMember;
