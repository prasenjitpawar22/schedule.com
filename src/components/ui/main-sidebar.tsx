import React, { useState, useEffect } from "react";
import Link from "next/link";

import { useTheme } from "next-themes";
import { Mail, Calendar, Settings, PersonStanding } from "lucide-react";
import { useRouter } from "next/router";

import { Button } from "./button";
import AuthShowcase from "./auth-show-case";

const MainSidebar = () => {
  return (
    <div className="flex flex-col justify-between p-4 shadow-lg shadow-gray-500">
      <div className="mt-4">
        <div className="mb-12">
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight lg:text-3xl">
            schedule.com{" "}
          </h1>
        </div>

        <div className="flex flex-col ">
          <Link href="/events">
            <Button className="w-full justify-start bg-inherit font-semibold capitalize text-foreground hover:text-secondary">
              <Mail className="mr-2 h-4 w-4 font-semibold" /> Events{" "}
            </Button>
          </Link>
          <Button className="w-full justify-start bg-inherit  font-semibold capitalize text-foreground hover:text-secondary">
            <Calendar className="mr-2 h-4 w-4 font-semibold" /> calendar
          </Button>

          <Button className="w-full justify-start bg-inherit  font-semibold capitalize text-foreground hover:text-secondary">
            <PersonStanding className="mr-2 h-4 w-4 font-semibold" /> Team
          </Button>
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
