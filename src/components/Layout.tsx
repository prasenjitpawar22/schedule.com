import React from "react";

import MainSidebar from "./ui/main-sidebar";

interface GlobalLayout {
  children: React.ReactNode;
}

const Layout = ({ children }: GlobalLayout) => {
  return (
    <div className="flex min-h-screen">
      <MainSidebar />
      <div className="min-h-screen w-full overflow-y-clip bg-primary-foreground">
        {children}
      </div>
    </div>
  );
};

export default Layout;
