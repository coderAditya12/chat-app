import PublicRouteGuard from "@/components/PublicRoute";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <PublicRouteGuard>{children}</PublicRouteGuard>;
};

export default layout;
