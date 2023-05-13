import React, { useState, useEffect } from "react";
import Link from "next/link";

import { Mail, Calendar, Settings, PersonStanding, Bell } from "lucide-react";

import { Button } from "./ui/button";
import AuthShowcase from "./auth-show-case";

const MainSidebar = () => {
  return (
    <div
      className={`flex flex-col justify-between  border-r p-4 shadow-sm shadow-primary-foreground `}
    >
      <div className="mt-4">
        <div className="mb-12">
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight lg:text-3xl">
            Schedule.com{" "}
          </h1>
        </div>

        <div className="flex flex-col border-t pt-3 ">
          <Link href="/events">
            <Button className="w-full justify-start bg-inherit font-semibold capitalize text-foreground hover:text-secondary">
              <Mail className="mr-2 h-4 w-4 font-semibold" /> Events{" "}
            </Button>
          </Link>
          <Button className="w-full justify-start bg-inherit  font-semibold capitalize text-foreground hover:text-secondary">
            <Calendar className="mr-2 h-4 w-4 font-semibold" /> calendar
          </Button>
          <Link href="/teams">
            <Button className="w-full justify-start bg-inherit  font-semibold capitalize text-foreground hover:text-secondary">
              <PersonStanding className="mr-2 h-4 w-4 font-semibold" /> Team
            </Button>
          </Link>
          <Link href="/requests">
            <Button className="w-full justify-start bg-inherit  font-semibold capitalize text-foreground hover:text-secondary">
              <Mail className="mr-2 h-4 w-4 font-semibold" /> Requests{" "}
            </Button>
          </Link>
          <Link href="/settings">
            <Button className="w-full justify-start bg-inherit  font-semibold capitalize text-foreground hover:text-secondary">
              <Settings className="mr-2 h-4 w-4 font-semibold" /> settings{" "}
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
