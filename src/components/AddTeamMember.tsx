import React, { FormEvent, useState } from "react";

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
import { api } from "../utils/api";
import { Loader2, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { useToast } from "./ui/use-toast";
import { TRPCError } from "@trpc/server";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  teamId: string;
}

const AddTeamMember = ({ open, setOpen, teamId }: Props) => {
  const [memberEmail, setMemberEmail] = useState("");
  const [allMemberList, setAllMemberList] = useState<string[]>([]);

  const { toast } = useToast();

  const { mutateAsync, isLoading } =
    api.request.sendMemberRequest.useMutation();

  //TODO: check it later
  const handleRequestAddTeamMember = () => {
    mutateAsync({
      teamId,
      toMembersEmail: allMemberList,
      toMemberName: "",
    })
      .then(() => {
        toast({
          title: "Request send",
        });
        setAllMemberList([]);
        setMemberEmail("");
        setOpen(false);
      })
      .catch((e: TRPCError) => {
        toast({
          title: "faild to send request",
          description: e.message,
          variant: "destructive",
        });
      });
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <Button onClick={() => setOpen(true)} className="w-fit p-2" size={"sm"}>
          Add team member
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex h-4/5 flex-col justify-between sm:max-w-[425px]">
        <div className="flex grow flex-col gap-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Add Team members</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex h-full flex-col gap-4 py-4">
            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                setAllMemberList([...allMemberList, memberEmail]);
              }}
              className="flex flex-none items-center gap-4"
            >
              <Input
                id="email"
                type={"email"}
                placeholder="member email"
                value={memberEmail}
                required
                onChange={(e) => setMemberEmail(e.target.value)}
                className=""
              />
              <Button type="submit">Add</Button>
            </form>
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
            //TODO: fix this shit
            onClick={() => handleRequestAddTeamMember()}
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
