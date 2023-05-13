import React from "react";
import SettingsThemeCard from "@/src/components/SettingsThemeCard";

const Settings = () => {
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

export default Settings;
