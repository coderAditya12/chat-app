"use client";
import FriendCard, { getLanguageFlag } from "@/components/FriendCard";
import { withAuthAndOnboarding } from "@/components/HOC";
import NoFriendsFound from "@/components/NoFriendsFound";
import { API_URL } from "@/lib/api";
import { capitialize } from "@/lib/utilis";
import axios from "axios";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

// Utility function from the original code

const HomePage = () => {
  // State management (replacing TanStack Query)
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

  // Enhanced debug logging for component state
  console.group("🏠 HOME COMPONENT STATE");
  console.log("📊 Current State:", {
    friends: {
      count: friends.length,
      loading: loadingFriends,
      data: friends.map((f) => ({ id: f._id || f.id, name: f.fullName })),
    },
    recommendedUsers: {
      count: recommendedUsers.length,
      loading: loadingUsers,
      data: recommendedUsers.map((u) => ({
        id: u._id || u.id,
        name: u.fullName,
      })),
    },
    outgoingRequests: {
      count: outgoingFriendReqs.length,
      loading: loadingOutgoingReqs,
      idsSet: Array.from(outgoingRequestsIds),
      data: outgoingFriendReqs.map((req) => ({
        id: req._id || req.id,
        recipientId: req.recipient?._id || req.recipient?.id,
      })),
    },
    mutation: {
      isPending,
      currentRequestUserId,
    },
  });
  console.log("🌐 API_URL:", API_URL);
  console.groupEnd();

  // API functions (replacing imported functions from lib/api)
  const getUserFriends = async () => {
    console.log("🔄 Fetching user friends...");
    try {
      const response = await axios.get(`${API_URL}/user/friends`, {
        withCredentials: true,
      });
      console.log("✅ Friends API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching friends:", error);
      throw error;
    }
  };

  const getRecommendedUsers = async () => {
    console.log("🔄 Fetching recommended users...");
    try {
      const response = await axios.get(`${API_URL}/user`, {
        withCredentials: true,
      });
      console.log("✅ Recommended Users API Response:", response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error("❌ Error fetching recommended users:", error);
      throw error;
    }
  };

  const getOutgoingFriendReqs = async () => {
    console.log("🔄 Fetching outgoing friend requests...");
    try {
      const response = await axios.get(
        `${API_URL}/user/outgoing-friend-requests`,
        {
          withCredentials: true,
        }
      );
      console.log("✅ Outgoing Friend Requests API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching outgoing friend requests:", error);
      throw error;
    }
  };

  const sendFriendRequest = async (userId: string) => {
    console.log(`📤 Sending friend request to userId: ${userId}`);
    try {
      const response = await axios.post(
        `${API_URL}/user/friends-request/${userId}`,
        {},
        { withCredentials: true }
      );
      console.log("✅ Friend request sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error sending friend request:", error);
      throw error;
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    console.log("🚀 useEffect triggered - Starting initial data fetch");
    let isMounted = true;

    const fetchAllData = async () => {
      console.log("📦 Fetching all data in parallel...");

      try {
        // Fetch friends
        console.log("🔄 Starting friends fetch...");
        setLoadingFriends(true);
        const friendsData = await getUserFriends();
        if (isMounted) {
          console.log("✅ Setting friends data:", friendsData);
          setFriends(friendsData);
          setLoadingFriends(false);
        }

        // Fetch recommended users
        console.log("🔄 Starting recommended users fetch...");
        setLoadingUsers(true);
        const usersData = await getRecommendedUsers();
        if (isMounted) {
          console.log("✅ Setting recommended users data:", usersData);
          setRecommendedUsers(usersData);
          setLoadingUsers(false);
        }

        // Fetch outgoing friend requests
        console.log("🔄 Starting outgoing requests fetch...");
        setLoadingOutgoingReqs(true);
        const outgoingData = await getOutgoingFriendReqs();
        if (isMounted) {
          console.log("✅ Setting outgoing requests data:", outgoingData);
          setOutgoingFriendReqs(outgoingData);
          setLoadingOutgoingReqs(false);
        }
      } catch (error) {
        console.error("❌ Error in fetchAllData:", error);
        if (isMounted) {
          setLoadingFriends(false);
          setLoadingUsers(false);
          setLoadingOutgoingReqs(false);
        }
      }
    };

    fetchAllData();

    return () => {
      console.log("🧹 Cleanup - component unmounting");
      isMounted = false;
    };
  }, []);

  // Update outgoing requests IDs when outgoing requests change
  useEffect(() => {
    console.log("🔄 Processing outgoing friend requests for IDs set...");
    const outgoingIds = new Set();

    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      console.log("📝 Processing outgoing requests:", outgoingFriendReqs);

      outgoingFriendReqs.forEach((req) => {
        const recipientId = req.friendId;
        console.log(
          "➕ Adding recipient ID to set:",
          recipientId,
          "from request:",
          req
        );
        if (recipientId) {
          outgoingIds.add(recipientId);
        }
      });

      console.log("✅ Final outgoing IDs set:", Array.from(outgoingIds));
      setOutgoingRequestsIds(outgoingIds);
    } else {
      console.log("ℹ️ No outgoing friend requests found");
      setOutgoingRequestsIds(new Set());
    }
  }, [outgoingFriendReqs]);

  // Send friend request mutation (replacing useMutation)
  const sendRequestMutation = async (userId: string) => {
    if (isPending) {
      console.log("⏳ Request already pending, ignoring...");
      return;
    }

    console.log(`🚀 Starting friend request mutation for userId: ${userId}`);
    setIsPending(true);
    setCurrentRequestUserId(userId);

    try {
      const result = await sendFriendRequest(userId);
      console.log("✅ Friend request mutation successful:", result);

      // Simulate query invalidation by refetching outgoing requests
      console.log(
        "🔄 Refetching outgoing requests after successful mutation..."
      );
      const updatedOutgoingReqs = await getOutgoingFriendReqs();
      setOutgoingFriendReqs(updatedOutgoingReqs);

      console.log("✅ Mutation and refetch completed successfully");
    } catch (error) {
      console.error("❌ Friend request mutation failed:", error);
    } finally {
      setIsPending(false);
      setCurrentRequestUserId("");
      console.log("🏁 Mutation process completed");
    }
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
              const friendId = friend._id || friend.id;
              console.log("🧑‍🤝‍🧑 Rendering friend:", {
                id: friendId,
                name: friend.fullName,
              });
              return <FriendCard key={friendId} friend={friend} />;
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
