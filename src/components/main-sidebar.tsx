import React, { useState } from "react";
import Link from "next/link";

import {
  Mail,
  Calendar,
  Settings,
  PersonStanding,
  Tag,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";

import { Button } from "./ui/button";
import AuthShowcase from "./auth-show-case";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";

const MainSidebar = () => {
  const { data: sessionData } = useSession();
  const [sideBarDisplayState, setSideBarDisplayState] = useState(true);

  return (
    <div
      className={`flex h-full min-h-screen flex-col  justify-between border-r bg-ternary p-4 
      shadow-sm shadow-primary-foreground xs:absolute xs:w-[100px] lg:relative lg:w-52 lg:translate-x-0 ${
        sideBarDisplayState ? " xs:-translate-x-[99px]" : ""
      } z-50 transition-all duration-300 `}
    >
      {sideBarDisplayState ? (
        <ChevronsRight
          onClick={() => setSideBarDisplayState(false)}
          className="absolute -right-10 w-12 cursor-pointer items-center rounded-full bg-ternary lg:hidden"
        />
      ) : (
        <ChevronsLeft
          size={25}
          onClick={() => setSideBarDisplayState(true)}
          className="absolute -right-6 w-12 cursor-pointer items-center rounded-full bg-ternary lg:hidden"
        />
      )}

      <div className="mt-4">
        <div className="mb-4">
          <Link href={"/"} className="flex items-center gap-2 overflow-hidden">
            <Image
              src={"/favicon.ico"}
              width={50}
              height={50}
              alt={"schedule"}
              className="rounded"
            />{" "}
            <h1 className="scroll-m-20 text-xl font-semibold tracking-tight xs:hidden lg:block lg:text-2xl">
              Schedulr{" "}
            </h1>
          </Link>
        </div>

        <div className="flex flex-col border-t pt-3 ">
          <Link href="/events">
            <Button className="w-full justify-start bg-inherit  font-semibold capitalize text-foreground hover:text-secondary">
              <Tag className="mr-2 h-4 w-4 font-semibold" />{" "}
              <span className="xs:hidden lg:block ">Events </span>
            </Button>
          </Link>
          <Button className="w-full justify-start bg-inherit   font-semibold capitalize text-foreground hover:text-secondary">
            <Calendar className="mr-2 h-4 w-4 font-semibold" />
            <span className="xs:hidden lg:block ">calendar </span>
          </Button>
          <Link href="/teams">
            <Button className="w-full justify-start bg-inherit   font-semibold capitalize text-foreground hover:text-secondary">
              <PersonStanding className="mr-2 h-4 w-4 font-semibold" />
              <span className="xs:hidden lg:block ">Team </span>
            </Button>
          </Link>
          <Link href="/requests">
            <Button className="w-full justify-start bg-inherit   font-semibold capitalize text-foreground hover:text-secondary">
              <Mail className="mr-2 h-4 w-4 font-semibold" />{" "}
              <span className="xs:hidden lg:block ">Requests </span>
            </Button>
          </Link>
          <Link href="/settings">
            <Button className="w-full justify-start bg-inherit   font-semibold capitalize text-foreground hover:text-secondary">
              <Settings className="mr-2 h-4 w-4 font-semibold" />{" "}
              <span className="xs:hidden lg:block ">settings </span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 overflow-hidden border-t pt-4">
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-10 ">
              {!sessionData?.user.image ? (
                <Skeleton className="h-10 w-10 rounded-full" />
              ) : (
                <Image
                  sizes="auto"
                  width={100}
                  height={100}
                  src={sessionData?.user.image}
                  alt="Picture of the author"
                  className="rounded-full border border-muted shadow"
                />
              )}
            </div>
            <div className="flex-col gap-1 xs:hidden lg:flex">
              {sessionData?.user.name && sessionData?.user.email ? (
                <div className="flex-col gap-1 xs:hidden lg:flex">
                  <Label>{sessionData?.user.name} </Label>
                  <Label className="text-[12px] text-muted-foreground">
                    {sessionData?.user.email}
                  </Label>
                </div>
              ) : (
                <div className="flex-col gap-1 xs:hidden lg:flex">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-40" />
                </div>
              )}
            </div>
          </div>
        </div>
        <AuthShowcase />
      </div>
    </div>
  );
};

export default MainSidebar;
