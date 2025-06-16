"use client";
import userAuthStore from "@/store/userStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import PageLoader from "./PageLoader";

// This flag and timer will live outside the component.
// So it will NOT reset on route change.
let hasAuthStarted = false;
let authInterval: NodeJS.Timeout | null = null;

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { checkAuth } = userAuthStore((state) => state);
  console.log("api called");

  useEffect(() => {
    const initAuth = async () => {
      if (!hasAuthStarted) {
        hasAuthStarted = true; // mark as already started

        // AWAIT the checkAuth function since it's async
        const isValid = await checkAuth(); // check once on first load
        console.log("Initial auth check:", isValid);

        if (!isValid) {
          router.push("/signup");
          setIsLoading(false);
          return; // Exit early if not valid
        }

        // set interval to call checkAuth every 14 minutes
        authInterval = setInterval(async () => {
          const stillValid = await checkAuth(); // AWAIT here too
          console.log("Periodic auth check:", stillValid);
          if (!stillValid) {
            router.push("/login");
          }
        }, 14 * 60 * 1000); // 14 minutes
      }

      setIsLoading(false);
    };

    initAuth();

    // Cleanup function (optional, but good practice)
    return () => {
      // You can choose to clear the interval here if needed
      // if (authInterval) {
      //   clearInterval(authInterval);
      //   hasAuthStarted = false;
      // }
    };
  }, [checkAuth, router]);

  if (isLoading) return <PageLoader />;
  return <>{children}</>;
};

export default AuthGuard;
