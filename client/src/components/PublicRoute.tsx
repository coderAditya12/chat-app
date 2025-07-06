// // components/PublicRouteGuard.tsx
// "use client";

// import { useEffect, useLayoutEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import userAuthStore from "@/store/userStore";

// const PublicRouteGuard = ({ children }: { children: React.ReactNode }) => {
//   const router = useRouter();
//   const { user } = userAuthStore((state) => state);

//   useLayoutEffect(() => {
//     if (user && user.isOnboard) {
//       // if already logged in, redirect to homepage or dashboard
//       router.push("/");
//     }
//   }, [user]);

//   return <>{children}</>; // show login/signup if not authenticated
// };

// export default PublicRouteGuard;

// claude code
// components/PublicRouteGuard.tsx
// // components/PublicRouteGuard.tsx
"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import userAuthStore from "@/store/userStore";

const PublicRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isAuthenticated } = userAuthStore((state) => state);

  useLayoutEffect(() => {
    // Only run if we have authentication data
    if (isAuthenticated && user) {
      // If user is fully onboarded, redirect to home
      if (user.isOnboard) {
        router.push("/");
        return;
      }
      
      // If user is not onboarded, redirect to onboard
      if (!user.isOnboard) {
        router.push("/onboard");
        return;
      }
    }
    // If user is not authenticated, stay on current public page (login/signup)
    // This allows users to access login/signup pages when not authenticated
  }, [user, isAuthenticated, router]);

  return <>{children}</>; // show login/signup if not authenticated
};

export default PublicRouteGuard;