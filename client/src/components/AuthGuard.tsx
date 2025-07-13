"use client";
import userAuthStore from "@/store/userStore";
import { usePathname, useRouter } from "next/navigation";
import React, {  useLayoutEffect, useState } from "react";
import PageLoader from "./PageLoader";

let hasAuthStarted = false;
let authInterval: NodeJS.Timeout | null = null;

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const path = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { checkAuth } = userAuthStore((state) => state);

  useLayoutEffect(() => {
    const initAuth = async () => {
      if (!hasAuthStarted) {
        hasAuthStarted = true;

        // AWAIT the checkAuth function since it's async
        const isValid = await checkAuth();
        

        // If not valid and on root path, redirect to signup
        if (!isValid && path === "/") {
          router.push("/signup");
          setIsLoading(false);
          return;
        }

        // Set interval to call checkAuth every 14 minutes
        authInterval = setInterval(async () => {
          const stillValid = await checkAuth();
          
          if (!stillValid) {
            router.push("/login");
          }
        }, 14 * 60 * 1000); // 14 minutes
      }

      setIsLoading(false);
    };

    initAuth();

    // Cleanup function
    return () => {
      if (authInterval) {
        clearInterval(authInterval);
        hasAuthStarted = false;
      }
    };
  }, []);

  if (isLoading) return <PageLoader />;
  return <>{children}</>;
};

export default AuthGuard;