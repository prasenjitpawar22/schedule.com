import React, { useState, useEffect } from "react";
import Link from "next/link";

import {
  Mail,
  Calendar,
  Settings,
  PersonStanding,
  Bell,
  LogIn,
  Tag,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";

import { Button } from "./ui/button";
import AuthShowcase from "./auth-show-case";

const MainSidebar = () => {
  const [sideBarDisplayState, setSideBarDisplayState] = useState(true);

  return (
    <div
      className={`flex h-full min-h-screen flex-col justify-between border-r 
      bg-ternary p-4 shadow-sm shadow-primary-foreground xs:absolute lg:relative lg:translate-x-0 ${
        sideBarDisplayState ? " xs:-translate-x-[88px]" : ""
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
        <div className="mb-12 xs:hidden lg:block ">
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight lg:text-3xl">
            Schedule.com{" "}
          </h1>
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

      <div>
        <AuthShowcase />
      </div>
    </div>
  );
};

export default MainSidebar;
