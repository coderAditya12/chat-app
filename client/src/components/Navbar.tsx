"use client";
import userAuthStore from "@/store/userStore";
import axios from "axios";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ThemeSelector from "./ThemeSelector";
import Image from "next/image";
import { API_URL } from "@/lib/api";

const Navbar = () => {
  const { user, setUser } = userAuthStore((state) => state);
  const router = useRouter();
  const path = usePathname();
  const [loading, setLoading] = useState(false);
  const isChatPage = path?.startsWith("/chat");

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/auth/signout`, {
        withCredentials: true,
      });
      console.log(response);
      if (response.status === 200) {
        router.replace("/login");
        setUser(null, false);
      }
    } catch (error) {
      setUser(null, false);
      // setAuthentication(false);
      router.push("/login");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link href="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                  Streamify
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link href={"/notifications"}>
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          {/* TODO */}
          <ThemeSelector />

          <div className="avatar">
            <div className="w-9 rounded-full">
              <img
                src={user?.profilePic}
                alt="User Avatar"
                onError={(e) => {
                  console.log("Image failed to load:", user?.profilePic);
                  (e.target as HTMLImageElement).src = "/default-avatar.png";
                }}
              />
            </div>
          </div>

          {/* Logout button */}
          <button className="btn btn-ghost btn-circle" onClick={handleLogout}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
