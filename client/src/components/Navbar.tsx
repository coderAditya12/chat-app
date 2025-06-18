"use client";
import userAuthStore from "@/store/userStore";
import axios from "axios";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import ThemeSelector from "./ThemeSelector";

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

          <div className="avatar">
            <div className="w-9 rounded-full">
              <img
                src={
                  user?.profilePicture ||
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACUCAMAAABGFyDbAAAAMFBMVEXk5ueutLepsLPZ3N7n6erIzM7P0tTq7O2yuLvBxsje4eLV2NrR1da2u767wMPEycvljgLtAAADY0lEQVR4nO2byXLbMAxAuYDiou3//7akXLfxIosABciZ4bskMz3kDQiBC1ClOp1Op9PpdDqdTqfT6XR+DQDPv1wOeGUHF5dMjG6yX2EGaopaa6Nv5J8hWnWxGaR1vhv9x4ThWrGoX6VuXCcGbleqRGy8xAvSsut0I15hZQ+kcsDmJG41HVoVkuxCwrSfVQ9YSS8Y6qRKvAStxspYZYKcVwrVVlrPUsvoZ4SVNk7GC4b6JdwYRbSOC9YTQSJc/qi4v2AGfi+wyCXUMl8jOlgiWY/OrA1uLYj4Nczh4j7kAMVK64XZCrHt/IQ56YGQ8AUzsWop1L7zg8iaXLTvsOA5tYiplVeR0wocWctyakWiVc55xuTCnbQe4Nx/POZY+gjnp+ipqZXrfNfqWh+1vjTlv7NA0A6BBdZy+qWbT8NWzXuwIec868GGch3bgsV7DKQeIQzvOwTlTl3gvlcT6zxnjS/QSgT79ZV4yeD9DhUt6c3AbaVU+s6HJI/eF1n3w38kdLBE3nTRT7pCL/OwYLykHsAV7oFkYS8OdzBbkGBzRcFYrSXaG65+FRRt3NXGK4j30SF96J/fMItw8/XG0e4oVxkegOnjwIFwWv3wgjW8FzNBZB/cFUvuVcyYebp8ygZsnENW+Wukw+wuyfQXQNlxWMukVHTD+B2DUgXY8N5vP6+2UUXIg0o5WIPbGHK0bMqG132F+boxuvh6+y+TZcs62iQ+kQc+jW6ZjdmtW/mfstuQxMzyH7Ku/sC1jkqgWOR6sM77QXoXtxCZq1jO7oH2ksQ4xQh+3B8FPIzZwjMsCGp8MzOJIbjTxcBPqOvO+4jNZ4tZ4ivgM+HE1whIa3Ok7pjltGNY/TWnSuyUlQRFbhHsec3tAQO7c/5sovWUXz3IicO0DfDSezxHhBYtNqvsRU4waCzrnzHUE397Xf8MKV5Ab2nWQokXY17dwb99wXn7zScvZLioU21IsP081DB1ixdqUrahg4/1wiwh9uW9AcSMpdQSblQPM+K7Ok1Uv9uLWtVmPX3SjsZcFyvRzNK1TVDJz/DGXJNdDcNQREzN1kho+rayHic9OHGrqqQ/6f6MoeKAI/0dFiomcOgz3g1ax/dGmYPWE4eNY/qYXQuHlQsWcwWHBdVegcx/fut0Op1O5xfyBzfiKaWdaPkVAAAAAElFTkSuQmCC"
                }
                alt="User Avatar"
                rel="noreferrer"
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
