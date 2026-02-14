"use client";
import userAuthStore from "@/store/userStore";
import axios from "axios";
import { BellIcon, LogOut, Globe2, ShipWheelIcon } from "lucide-react";
import React from "react";
import { API_URL } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import ThemeSelector from "@/components/ThemeSelector";

const Navbar = () => {
  const { user, logout } = userAuthStore((state) => state);
  const router = useRouter();
  const pathname = usePathname();
  const isChatPage = pathname?.includes("/chat");

  const logoutHandler = async () => {
    try {
      await axios.get(`${API_URL}/api/auth/signout`, { withCredentials: true });
    } catch (err) { }
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-base-200/80 backdrop-blur-lg border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between">
        {/* Logo */}
        {!isChatPage && (
          <Link href="/" className="flex items-center gap-2 group">
            <ShipWheelIcon className="size-8 text-primary group-hover:rotate-45 transition-transform duration-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ChatLingo
            </span>
          </Link>
        )}

        {/* Spacer */}
        {isChatPage && <div />}

        {/* Right side actions */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <Link href="/notifications" className="btn btn-ghost btn-sm btn-circle">
            <BellIcon className="size-5" />
          </Link>

          {/* Theme Selector */}
          <ThemeSelector />

          {/* User avatar */}
          <div className="avatar ml-1">
            <div className="w-8 rounded-full ring ring-primary/30 ring-offset-base-100 ring-offset-1">
              <img src={user?.profilePic || "/default-avatar.png"} alt="profile" />
            </div>
          </div>

          {/* Logout */}
          <button onClick={logoutHandler} className="btn btn-ghost btn-sm btn-circle text-error/70 hover:text-error">
            <LogOut className="size-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
