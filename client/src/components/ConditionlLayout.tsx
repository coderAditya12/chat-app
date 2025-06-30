// "use client";

// import { usePathname } from "next/navigation";
// import Layout from "./Layout";

// // Define the routes where you don't want the Layout component
// const ROUTES_WITHOUT_LAYOUT = ["/login", "/signup", "/onboard"];

// interface ConditionalLayoutProps {
//   children: React.ReactNode;
// }

// export default function ConditionalLayout({
//   children,
// }: ConditionalLayoutProps) {
//   const pathname = usePathname();

//   // Check if current path should exclude the Layout
//   const shouldExcludeLayout = ROUTES_WITHOUT_LAYOUT.includes(pathname);

//   if (shouldExcludeLayout) {
//     return <>{children}</>;
//   }

//   return <Layout>{children}</Layout>;
// }
"use client";

import { usePathname } from "next/navigation";
import Layout from "./Layout";
import userAuthStore from "@/store/userStore"; // Import your auth store

// Define the routes where you don't want the Layout component
const ROUTES_WITHOUT_LAYOUT = ["/login", "/signup", "/onboard"];

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  // 🔥 NEW: Get loading state from your auth store
  const { isAuthenticated, user } = userAuthStore();
  // Check if current path should exclude the Layout
  const shouldExcludeLayout = ROUTES_WITHOUT_LAYOUT.includes(pathname);

  // 🔥 NEW: Don't render Layout if user is not authenticated
  // This prevents navbar/sidebar from showing during auth loading
  if (!shouldExcludeLayout) {
    // If we need layout but user isn't authenticated yet, just return children
    // (AuthGuard will handle the loading state and redirects)
    if (!isAuthenticated) {
      return <>{children}</>;
    }
  }
  if (shouldExcludeLayout) {
    return <>{children}</>;
  }
  return <Layout>{children}</Layout>;
}
