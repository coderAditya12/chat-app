"use client";
import userAuthStore from "@/store/userStore";
import axios from "axios";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import ThemeSelector from "./ThemeSelector";
import Image from "next/image";

const Navbar = () => {
  const { user, setUser } = userAuthStore((state) => state);
  const router = useRouter();
  const path = usePathname();
  const isChatPage = path?.startsWith("/chat");

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/signout",
        { withCredentials: true }
      );
      console.log(response);
      if (response.status === 200) {
        setUser(null, false);
        // setAuthentication(false);
        router.push("/login");
      }
    } catch (error) {
      setUser(null, false);
      // setAuthentication(false);
      router.push("/login");
      console.log(error);
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

          {/* <div className="avatar">
            <div className="w-9 rounded-full">
              <img
                src={
                  user?.profilePicture 
                }
                
                alt="User Avatar"
                rel="noreferrer"
              />
            </div>
          </div> */}
          <div className="avatar">
            <div className="w-9 rounded-full">
              
              <img
              src={user?.profilePic || '/default-avatar.png'}
              alt="User Avatar"
              onError={(e) => {
                console.log('Image failed to load:', user?.profilePic);
                (e.target as HTMLImageElement).src = '/default-avatar.png';
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
