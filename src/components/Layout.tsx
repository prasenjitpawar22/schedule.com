import React from "react";

import MainSidebar from "./ui/main-sidebar";

interface GlobalLayout {
  children: React.ReactNode;
}

const Layout = ({ children }: GlobalLayout) => {
  return (
    <div className="flex min-h-screen">
      <MainSidebar />
      {children}
    </div>
  );
};

export default Layout;
