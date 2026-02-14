"use client";
import FriendCard from "@/components/FriendCard";
import { withAuthAndOnboarding } from "@/components/HOC";
import NoFriendsFound from "@/components/NoFriendsFound";
import { API_URL } from "@/lib/api";
import userAuthStore from "@/store/userStore";
import { createSocketConnection } from "@/utils/socket";
import axios from "axios";
import { UsersIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const FriendsPage = () => {
  const { user } = userAuthStore((state) => state);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsersList, setOnlineUsersList] = useState<Set<string>>(new Set());
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/user/friends`, {
          withCredentials: true,
        });
        setFriends(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    const socket = createSocketConnection();
    socketRef.current = socket;
    if (user?.id) {
      socket.emit("user-online", user.id);
    }
    socket.on("updateOnlineUsers", (idsOnly: any[]) => {
      setOnlineUsersList(new Set(idsOnly));
    });
    socket.on("onlineuserlist", (idsOnly: any[]) => {
      setOnlineUsersList(new Set(idsOnly));
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const isUserOnline = (userId: string) => onlineUsersList.has(userId);

  const onlineFriends = friends.filter((f) => isUserOnline(f.id));
  const offlineFriends = friends.filter((f) => !isUserOnline(f.id));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <UsersIcon className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Friends</h1>
              <p className="text-base-content/60 text-sm">
                {friends.length} friend{friends.length !== 1 ? "s" : ""}{" "}
                {onlineFriends.length > 0 && (
                  <span className="text-success">• {onlineFriends.length} online</span>
                )}
              </p>
            </div>
          </div>
          <Link href="/notifications" className="btn btn-outline btn-sm gap-2">
            <UsersIcon className="size-4" />
            Friend Requests
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="space-y-8">
            {/* Online Friends */}
            {onlineFriends.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-success uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  Online — {onlineFriends.length}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {onlineFriends.map((friend) => (
                    <FriendCard
                      key={friend.id}
                      friend={friend}
                      isOnline={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Offline Friends */}
            {offlineFriends.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-base-content/40 uppercase tracking-wider mb-4">
                  Offline — {offlineFriends.length}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {offlineFriends.map((friend) => (
                    <FriendCard
                      key={friend.id}
                      friend={friend}
                      isOnline={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuthAndOnboarding(FriendsPage);