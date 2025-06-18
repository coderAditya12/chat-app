// components/ThemeWrapper.tsx
"use client";
import { useThemeStore } from "@/store/ThemeStore";
import { useEffect } from "react";

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useThemeStore();

  return (
    <div className="w-screen h-full" data-theme={theme}>
      {children}
    </div>
  );
};

export default ThemeWrapper;
