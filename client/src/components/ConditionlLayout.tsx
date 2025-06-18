"use client";

import { usePathname } from "next/navigation";
import Layout from "./Layout";

// Define the routes where you don't want the Layout component
const ROUTES_WITHOUT_LAYOUT = ["/login", "/signup", "/onboard"];

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Check if current path should exclude the Layout
  const shouldExcludeLayout = ROUTES_WITHOUT_LAYOUT.includes(pathname);

  if (shouldExcludeLayout) {
    return <>{children}</>;
  }

  return <Layout>{children}</Layout>;
}
