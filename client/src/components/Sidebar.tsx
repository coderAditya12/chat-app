"use client";
import userAuthStore from "@/store/userStore";
import { HomeIcon, UsersIcon, BellIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const { user } = userAuthStore((state) => state);
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/friends", icon: UsersIcon, label: "Friends" },
    { href: "/notifications", icon: BellIcon, label: "Notifications" },
    { href: "/profile", icon: UserIcon, label: "Profile" },
  ];

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-base-content/70 hover:bg-base-300 hover:text-base-content"
                }`}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Profile at bottom */}
      <div className="p-4 border-t border-base-300">
        <div className="flex items-center gap-3 p-2">
          <div className="avatar">
            <div className="w-10 rounded-full ring ring-primary/30 ring-offset-base-100 ring-offset-1">
              <img src={user?.profilePic || "/default-avatar.png"} alt={user?.fullName} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{user?.fullName}</h4>
            <p className="text-xs text-base-content/50 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
