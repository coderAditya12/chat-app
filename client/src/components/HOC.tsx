// "use client";
// import userAuthStore from "@/store/userStore";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import PageLoader from "./PageLoader";

// // components/withAuthAndOnboarding.tsx
// export function withAuthAndOnboarding(Component: React.ComponentType) {
//   return function AuthAndOnboardingComponent(props: any) {
//     const router = useRouter();
//     const { user, isAuthenticated } = userAuthStore();
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//       if (loading) {
//         if (!isAuthenticated) {
//           router.replace("/login");
//         } else if (user && user.isOnboard === false) {
//           // Only redirect if we're not already on the onboard page
//           if (!window.location.pathname.startsWith("/onboard")) {
//             router.replace("/onboard");
//           } else {
//             setLoading(false); // We're where we should be
//           }
//         } else {
//           setLoading(false); // User is authenticated and onboarded
//         }
//       }
//     }, [isAuthenticated, user, loading, router]);

//     if (loading) {
//       return <PageLoader />;
//     }

//     // Special case: allow onboard page if user needs onboarding
//     if (
//       user?.isOnboard === false &&
//       window.location.pathname.startsWith("/onboard")
//     ) {
//       return <Component {...props} />;
//     }

//     if (!isAuthenticated) {
//       return null;
//     }

//     return <Component {...props} />;
//   };
// }

// claude code
"use client";
import userAuthStore from "@/store/userStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageLoader from "./PageLoader";

// components/withAuthAndOnboarding.tsx
export function withAuthAndOnboarding(Component: React.ComponentType) {
  return function AuthAndOnboardingComponent(props: any) {
    const router = useRouter();
    const pathname = usePathname(); // Use Next.js hook instead of window.location
    const { user, isAuthenticated } = userAuthStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Always set loading to false after initial check
      const timer = setTimeout(() => {
        setLoading(false);
      }, 100);

      // Check authentication status
      if (!isAuthenticated) {
        router.replace("/login");
        return () => clearTimeout(timer);
      }

      // If user is authenticated but not onboarded
      if (user && !user.isOnboard) {
        // Only redirect if we're not already on the onboard page
        if (!pathname.startsWith("/onboard")) {
          router.replace("/onboard");
        }
        return () => clearTimeout(timer);
      }

      // If user is authenticated and onboarded, but trying to access onboard page
      if (user && user.isOnboard && pathname.startsWith("/onboard")) {
        router.replace("/");
        return () => clearTimeout(timer);
      }

      // Clean up timer
      return () => clearTimeout(timer);
    }, [isAuthenticated, user, pathname, router]);

    // Show loader while checking auth
    if (loading) {
      return <PageLoader />;
    }

    // If not authenticated, don't render anything (redirect will happen)
    if (!isAuthenticated) {
      return null;
    }

    // If user needs onboarding but is not on onboard page, don't render
    if (user && !user.isOnboard && !pathname.startsWith("/onboard")) {
      return null;
    }

    // If user is onboarded but trying to access onboard page, don't render
    if (user && user.isOnboard && pathname.startsWith("/onboard")) {
      return null;
    }

    // All checks passed, render the component
    return <Component {...props} />;
  };
}