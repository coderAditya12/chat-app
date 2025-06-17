// components/PublicRouteGuard.tsx
"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import userAuthStore from "@/store/userStore";


const PublicRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated,user } = userAuthStore((state) => state);

  useLayoutEffect(() => {
    if (isAuthenticated || user) {
      // if already logged in, redirect to homepage or dashboard
      router.push("/");
    }
  }, [isAuthenticated]);

  return <>{children}</>; // show login/signup if not authenticated
};

export default PublicRouteGuard;
