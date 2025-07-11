"use client";
import FriendCard, { getLanguageFlag } from "@/components/FriendCard";
import { withAuthAndOnboarding } from "@/components/HOC";
import NoFriendsFound from "@/components/NoFriendsFound";
import { API_URL } from "@/lib/api";
import { capitialize } from "@/lib/utilis";
import userAuthStore from "@/store/userStore";
import { createSocketConnection } from "@/utils/socket";
import axios from "axios";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
const HomePage = () => {
  const { user } = userAuthStore((state) => state);
  const [onlineUsersList, setOnlineUsersList] = useState<Set<string>>(
    new Set()
  );
  const socketRef = useRef<any>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [recommendedUsers, setRecommendedUsers] = useState<any[]>([]);
  const [outgoingFriendReqs, setOutgoingFriendReqs] = useState<any[]>([]);
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  // Loading states
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingOutgoingReqs, setLoadingOutgoingReqs] = useState(true);
  // Mutation state (replacing useMutation)
  const [isPending, setIsPending] = useState(false);
  const [currentRequestUserId, setCurrentRequestUserId] = useState<string>("");

  // API functions (replacing imported functions from lib/api)
  const getUserFriends = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/friends`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getRecommendedUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/user`, {
        withCredentials: true,
      });

      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  };

  const getOutgoingFriendReqs = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/user/outgoing-friend-requests`,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/user/friends-request/${userId}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        // Fetch friends
        setLoadingFriends(true);
        const friendsData = await getUserFriends();
        if (isMounted) {
          setFriends(friendsData);
          setLoadingFriends(false);
        }

        // Fetch recommended users

        setLoadingUsers(true);
        const usersData = await getRecommendedUsers();
        if (isMounted) {
          setRecommendedUsers(usersData);
          setLoadingUsers(false);
        }

        // Fetch outgoing friend requests

        setLoadingOutgoingReqs(true);
        const outgoingData = await getOutgoingFriendReqs();

        if (isMounted) {
          setOutgoingFriendReqs(outgoingData);
          setLoadingOutgoingReqs(false);
        }
      } catch (error) {
        if (isMounted) {
          setLoadingFriends(false);
          setLoadingUsers(false);
          setLoadingOutgoingReqs(false);
        }
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update outgoing requests IDs when outgoing requests change
  useEffect(() => {
    const outgoingIds = new Set();

    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        const recipientId = req.friendId;

        if (recipientId) {
          outgoingIds.add(recipientId);
        }
      });

      setOutgoingRequestsIds(outgoingIds);
    } else {
      setOutgoingRequestsIds(new Set());
    }
  }, [outgoingFriendReqs]);

  // Send friend request mutation (replacing useMutation)
  const sendRequestMutation = async (userId: string) => {
    if (isPending) {
      return;
    }

    setIsPending(true);
    setCurrentRequestUserId(userId);

    try {
      const result = await sendFriendRequest(userId);

      // Simulate query invalidation by refetching outgoing requests

      const updatedOutgoingReqs = await getOutgoingFriendReqs();
      setOutgoingFriendReqs(updatedOutgoingReqs);
    } catch (error) {
    } finally {
      setIsPending(false);
      setCurrentRequestUserId("");
    }
  };

  useEffect(() => {
    const socket = createSocketConnection();
    socketRef.current = socket;
    if (user?.id) {
      socketRef.current.emit("user-online", user.id);
    }
    socketRef.current.on("onlineuserlist", (onlineUsers: any[]) => {
      console.log("online Users", onlineUsers);
      setOnlineUsersList(new Set(onlineUsers))
    });
    socketRef.current.on("user-disconnected", (onlineUsers: any[]) => {

      setOnlineUsersList(new Set(onlineUsers))
    });
    return () => {
      if(socketRef.current && user?.id){
        socketRef.current.emit("user-offline",user.id)
      }
      socket.disconnect();
    };
  }, []);
   const isUserOnline = (userId: string) => {
     return onlineUsersList.has(userId);
   };
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link href="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => {
              const friendId = friend.id;

              return (
                <FriendCard
                  key={friendId}
                  friend={friend}
                  isOnline={isUserOnline(friendId)}
                  // isOnline={isOnline}
                />
              );
            })}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet New Learners
                </h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your
                  profile
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                No recommendations available
              </h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const userId = user._id || user.id;
                const hasRequestBeenSent = outgoingRequestsIds.has(userId);
                const isCurrentlyPending =
                  isPending && currentRequestUserId === userId;

                console.log("👤 Rendering recommended user:", {
                  id: userId,
                  name: user.fullName,
                  hasRequestBeenSent,
                  isCurrentlyPending,
                  outgoingIdsSet: Array.from(outgoingRequestsIds),
                });

                return (
                  <div
                    key={userId}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && (
                        <p className="text-sm opacity-70">{user.bio}</p>
                      )}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        } `}
                        onClick={() => {
                          console.log(`🖱️ Button clicked for user ${userId}`);
                          sendRequestMutation(userId);
                        }}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {isCurrentlyPending ? (
                          <>
                            <span className="loading loading-spinner loading-xs mr-2" />
                            Sending...
                          </>
                        ) : hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
export default withAuthAndOnboarding(HomePage);
