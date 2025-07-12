"use client";

import { usePathname } from "next/navigation";
import Layout from "./Layout";
import userAuthStore from "@/store/userStore";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { isAuthenticated } = userAuthStore();

  // Check if current path should exclude the Layout
  const shouldExcludeLayout =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/onboard" ||
    pathname.startsWith("/chat");

  if (!shouldExcludeLayout) {
    if (!isAuthenticated) {
      return <>{children}</>;
    }
  }

  if (shouldExcludeLayout) {
    return <>{children}</>;
  }

  return <Layout>{children}</Layout>;
}
