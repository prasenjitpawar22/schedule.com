import React, { useState, useEffect, FormEvent } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { useTheme } from "next-themes";
import { Laptop, Moon, Sun } from "lucide-react";

const SettingsThemeCard = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Card
      className={`flex w-fit flex-col items-center justify-center gap-4 bg-ternary p-4 text-foreground transition-all duration-300`}
    >
      <CardHeader>
        <CardTitle className="">Select theme mode</CardTitle>
      </CardHeader>
      <RadioGroup className={"gap-3"} onValueChange={(e) => setTheme(e)}>
        <div className="flex items-center  space-x-2">
          <RadioGroupItem
            checked={theme === "system"}
            value="system"
            id="system"
          />
          <Label htmlFor="system">System</Label>
        </div>
        <div className="flex items-center  space-x-2">
          <RadioGroupItem checked={theme === "dark"} value="dark" id="dark" />
          <Label htmlFor="dark">Dark</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            checked={theme === "light"}
            value="light"
            id="light"
          />
          <Label htmlFor="light">Light</Label>
        </div>
      </RadioGroup>
    </Card>
  );
};

export default SettingsThemeCard;
