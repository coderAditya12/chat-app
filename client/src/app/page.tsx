"use client";
import FriendCard, { getLanguageFlag } from "@/components/FriendCard";
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
  Globe,
  MessageCircle,
  ShipWheelIcon,
  Video,
  Users,
  Languages,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

// ===================== LANDING PAGE (Unauthenticated) =====================
const LandingPage = () => {
  const features = [
    {
      icon: Languages,
      title: "Language Exchange",
      description: "Connect with native speakers who want to learn your language",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Send text messages and images instantly with Socket.io",
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      icon: Video,
      title: "Video Calls",
      description: "Practice speaking with face-to-face video calls via Stream",
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: Users,
      title: "Smart Matching",
      description: "Get recommended partners based on your language goals",
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
      <nav className="bg-base-200/80 backdrop-blur-lg border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
        <div className="max-w-6xl mx-auto w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShipWheelIcon className="size-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ChatLingo
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn btn-ghost btn-sm">
              Log in
            </Link>
            <Link href="/signup" className="btn btn-primary btn-sm">
              Sign up free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Sparkles className="size-4" />
              Free language exchange platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              Learn languages by{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                chatting
              </span>{" "}
              with native speakers
            </h1>
            <p className="text-lg sm:text-xl text-base-content/60 mb-10 max-w-2xl mx-auto">
              Connect with language partners worldwide. Practice through real-time
              messaging, image sharing, and video calls — all for free.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="btn btn-primary btn-lg gap-2">
                Get Started Free
                <ArrowRight className="size-5" />
              </Link>
              <Link href="/login" className="btn btn-outline btn-lg">
                I have an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-base-200/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to practice
            </h2>
            <p className="text-base-content/60 max-w-xl mx-auto">
              ChatLingo gives you all the tools to have meaningful language exchanges
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card bg-base-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-base-300/50"
              >
                <div className="card-body items-center text-center p-6">
                  <div className={`${feature.bg} p-3 rounded-2xl mb-3`}>
                    <feature.icon className={`size-7 ${feature.color}`} />
                  </div>
                  <h3 className="font-bold text-lg">{feature.title}</h3>
                  <p className="text-sm text-base-content/60">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Get started in 3 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create your profile",
                desc: "Sign up with email or Google, set your native & target language",
              },
              {
                step: "2",
                title: "Find partners",
                desc: "Browse recommended learners who speak the language you want to learn",
              },
              {
                step: "3",
                title: "Start chatting",
                desc: "Send messages, share images, and hop on video calls to practice",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-content font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-base-content/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to start learning?
          </h2>
          <p className="text-base-content/60 mb-8">
            Join ChatLingo today and connect with language learners from around the world.
          </p>
          <Link href="/signup" className="btn btn-primary btn-lg gap-2">
            Create Free Account
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-200 border-t border-base-300 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShipWheelIcon className="size-5 text-primary" />
            <span className="font-bold">ChatLingo</span>
          </div>
          <p className="text-sm text-base-content/50">
            © 2025 ChatLingo. Built with ❤️ for language learners.
          </p>
        </div>
      </footer>
    </div>
  );
};

// ===================== HOME PAGE (Authenticated) =====================
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
  // Mutation state
  const [isPending, setIsPending] = useState(false);
  const [currentRequestUserId, setCurrentRequestUserId] = useState<string>("");

  // API functions
  const getUserFriends = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/friends`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getRecommendedUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user`, {
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
        `${API_URL}/api/user/outgoing-friend-requests`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/user/friends-request/${userId}`,
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
        setLoadingFriends(true);
        const friendsData = await getUserFriends();
        if (isMounted) {
          setFriends(friendsData);
          setLoadingFriends(false);
        }

        setLoadingUsers(true);
        const usersData = await getRecommendedUsers();
        if (isMounted) {
          setRecommendedUsers(usersData);
          setLoadingUsers(false);
        }

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

  // Update outgoing requests IDs
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

  // Send friend request mutation
  const sendRequestMutation = async (userId: string) => {
    if (isPending) return;

    setIsPending(true);
    setCurrentRequestUserId(userId);

    try {
      await sendFriendRequest(userId);
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
    socketRef.current.on("updateOnlineUsers", (idsOnly: any[]) => {
      setOnlineUsersList(new Set(idsOnly));
    });
    socketRef.current.on("onlineuserlist", (idsOnly: any[]) => {
      setOnlineUsersList(new Set(idsOnly));
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const isUserOnline = (userId: string) => {
    return onlineUsersList.has(userId);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        {/* ==================== WELCOME BANNER ==================== */}
        <div className="card bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-base-300">
          <div className="card-body p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={user?.profilePic}
                    alt={user?.fullName}
                  />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  Welcome back, {user?.fullName?.split(" ")[0]}! 👋
                </h1>
                <p className="text-base-content/60 text-sm mt-0.5">
                  {friends.length > 0
                    ? `You have ${friends.length} friend${friends.length > 1 ? "s" : ""}. Keep learning together!`
                    : "Start connecting with language partners below!"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== FRIENDS SECTION ==================== */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <MessageCircle className="size-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Your Friends
                </h2>
                <p className="text-base-content/60 text-sm">
                  Chat with your language partners
                </p>
              </div>
            </div>
            <Link href="/notifications" className="btn btn-outline btn-sm gap-2">
              <UsersIcon className="size-4" />
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
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* ==================== RECOMMENDED USERS SECTION ==================== */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary/10 p-2 rounded-lg">
                  <Globe className="size-5 text-secondary" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Meet New Learners
                  </h2>
                  <p className="text-base-content/60 text-sm">
                    Discover perfect language exchange partners based on your
                    profile
                  </p>
                </div>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="bg-base-300 rounded-full p-4">
                  <Globe className="size-8 text-base-content/40" />
                </div>
                <h3 className="font-semibold text-lg">
                  No recommendations available
                </h3>
                <p className="text-base-content/60 max-w-sm">
                  Check back later for new language partners!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const userId = user._id || user.id;
                const hasRequestBeenSent = outgoingRequestsIds.has(userId);
                const isCurrentlyPending =
                  isPending && currentRequestUserId === userId;

                return (
                  <div
                    key={userId}
                    className="card bg-base-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-base-300/50"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-14 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-1">
                            <img src={user.profilePic} alt={user.fullName} />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs text-base-content/60 mt-0.5">
                              <MapPinIcon className="size-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary gap-1">
                          {getLanguageFlag({ language: user.nativeLanguage })}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline gap-1">
                          {getLanguageFlag({ language: user.learningLanguage })}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && (
                        <p className="text-sm text-base-content/60 line-clamp-2">
                          {user.bio}
                        </p>
                      )}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 ${hasRequestBeenSent
                            ? "btn-disabled"
                            : "btn-primary"
                          }`}
                        onClick={() => sendRequestMutation(userId)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {isCurrentlyPending ? (
                          <>
                            <span className="loading loading-spinner loading-xs" />
                            Sending...
                          </>
                        ) : hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4" />
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

// ===================== ROOT PAGE =====================
const RootPage = () => {
  const { isAuthenticated } = userAuthStore();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <HomePage />;
};

export default RootPage;
