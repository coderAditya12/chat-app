"use client";
import userAuthStore from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageLoader from "./PageLoader";

// components/withAuthAndOnboarding.tsx
export function withAuthAndOnboarding(Component: React.ComponentType) {
  return function AuthAndOnboardingComponent(props: any) {
    const router = useRouter();
    const { user, isAuthenticated } = userAuthStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Only check auth if we haven't determined the state yet
      if (loading) {
        if (!isAuthenticated) {
          router.replace("/login");
        } else if (user && user.isOnboard === false) {
          // Only redirect if we're not already on the onboard page
          if (!window.location.pathname.startsWith("/onboard")) {
            router.replace("/onboard");
          } else {
            setLoading(false); // We're where we should be
          }
        } else {
          setLoading(false); // User is authenticated and onboarded
        }
      }
    }, [isAuthenticated, user, loading, router]);

    if (loading) {
      return <PageLoader />;
    }

    // Special case: allow onboard page if user needs onboarding
    if (
      user?.isOnboard === false &&
      window.location.pathname.startsWith("/onboard")
    ) {
      return <Component {...props} />;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
