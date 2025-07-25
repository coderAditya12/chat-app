import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
// Define the type for props
type LayoutProps = {
  children: ReactNode;
  showSidebar?: boolean;
};
const Layout = ({ children, showSidebar = true }: LayoutProps) => {
  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-hidden">
      <div className="flex">
        {showSidebar && <Sidebar />}
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto ">{children}</main>
        </div>
      </div>
    </div>
  );
};
export default Layout;
