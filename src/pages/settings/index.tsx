import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "next-themes";
import { NextPage } from "next";
import SettingsThemeCard from "@/src/components/SettingsThemeCard";

const index: NextPage = () => {
  return (
    <>
      <div className="m-12">
        <div className="mb-12">
          <h1 className="scroll-m-20 text-xl font-semibold tracking-tight lg:text-2xl">
            Settings
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          <SettingsThemeCard />
        </div>
      </div>
    </>
  );
};

export default index;
