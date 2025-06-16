// components/PublicRouteGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import userAuthStore from "@/store/userStore";


const PublicRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated } = userAuthStore((state) => state);

  useEffect(() => {
    if (isAuthenticated) {
      // if already logged in, redirect to homepage or dashboard
      router.push("/");
    }
  }, [isAuthenticated]);

  return <>{children}</>; // show login/signup if not authenticated
};

export default PublicRouteGuard;
