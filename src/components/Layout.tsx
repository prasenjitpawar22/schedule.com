import React from "react";

import MainSidebar from "./main-sidebar";

interface GlobalLayout {
  children: React.ReactNode;
}

const Layout = ({ children }: GlobalLayout) => {
  return (
    <div className="flex h-full min-h-screen w-full">
      <MainSidebar />
      <div className="max-h-screen min-h-screen w-full overflow-y-scroll bg-primary-foreground transition-all duration-300">
        {children}
      </div>
    </div>
  );
};

export default Layout;
