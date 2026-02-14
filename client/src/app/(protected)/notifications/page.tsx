"use client"
import { withAuthAndOnboarding } from "@/components/HOC";
import NoNotificationsFound from "@/components/NoNotification";
import { API_URL } from "@/lib/api";
import axios from "axios";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
  UserXIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const NotificationPage = () => {
  const [loading, setLoading] = useState(true);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [acceptedRequest, setAcceptedRequest] = useState<any[]>([]);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const getFriendRequest = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/user/getFriend-requets`,
        { withCredentials: true }
      );
      setIncomingRequests(response.data.incomingRequests || []);
      setAcceptedRequest(response.data.acceptedRequests || []);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (id: string) => {
    setPendingId(id);
    try {
      const response = await axios.put(
        `${API_URL}/api/user/friends-request/${id}/accept`,
        {},
        { withCredentials: true }
      );

      toast.success(
        `You and ${response.data.acceptedRequest.friend.fullName} are now friends! 🎉`
      );

      // Animate out the request before removing
      setIncomingRequests((prev) =>
        prev.filter((request) => request.id !== id)
      );
      setAcceptedRequest((prev) => [...prev, response.data.acceptedRequest]);
    } catch (error) {
      toast.error("Something went wrong, please try again later");
    } finally {
      setPendingId(null);
    }
  };

  useEffect(() => {
    getFriendRequest();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <BellIcon className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Notifications
            </h1>
            <p className="text-base-content/60 text-sm">
              Manage friend requests and connections
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {/* ==================== INCOMING REQUESTS ==================== */}
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <UserCheckIcon className="size-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary badge-sm">
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="card bg-base-200 border border-base-300/50 hover:shadow-md transition-all duration-300"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="avatar">
                              <div className="w-12 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-1">
                                <img
                                  src={
                                    request.user?.profilePic ||
                                    "/default-avatar.png"
                                  }
                                  alt={request.user?.fullName || "User"}
                                  onError={(e) => {
                                    e.currentTarget.src = "/default-avatar.png";
                                  }}
                                />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold truncate">
                                {request.user?.fullName || "Unknown User"}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-xs">
                                  Native:{" "}
                                  {request.user?.nativeLanguage || "N/A"}
                                </span>
                                <span className="badge badge-outline badge-xs">
                                  Learning:{" "}
                                  {request.user?.learningLanguage || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              className="btn btn-primary btn-sm gap-1"
                              onClick={() => acceptRequest(request.id)}
                              disabled={pendingId === request.id}
                            >
                              {pendingId === request.id ? (
                                <span className="loading loading-spinner loading-xs" />
                              ) : (
                                <CheckIcon className="size-4" />
                              )}
                              Accept
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ==================== ACCEPTED / NEW CONNECTIONS ==================== */}
            {acceptedRequest.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <BellIcon className="size-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequest.map((notification) => {
                    const friendData =
                      notification.friend || notification.user || notification;

                    return (
                      <div
                        key={notification.id}
                        className="card bg-base-200 border border-base-300/50"
                      >
                        <div className="card-body p-4">
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="w-10 rounded-full">
                                <img
                                  src={
                                    friendData?.profilePic ||
                                    "/default-avatar.png"
                                  }
                                  alt={friendData?.fullName || "Friend"}
                                />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate">
                                {friendData?.fullName || "Unknown User"}
                              </h3>
                              <p className="text-sm text-base-content/60">
                                You are now connected! Start chatting 🎉
                              </p>
                            </div>
                            <Link
                              href={`/chat/${friendData?.id}`}
                              className="btn btn-success btn-sm gap-1"
                            >
                              <MessageSquareIcon className="size-4" />
                              Chat
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequest.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default withAuthAndOnboarding(NotificationPage);