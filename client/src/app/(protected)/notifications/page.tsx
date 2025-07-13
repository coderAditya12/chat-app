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
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const NotificationPage = () => {
  const [loading, setLoading] = useState(true);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [acceptedRequest, setAcceptedRequest] = useState<any[]>([]);
  const [pending, setPending] = useState(false);

  const getFriendRequest = async () => {
    
    try {
      const response = await axios.get(
        `${API_URL}/api/user/getFriend-requets`,
        {
          withCredentials: true,
        }
      );

      
      setIncomingRequests(response.data.incomingRequests || []);
      setAcceptedRequest(response.data.acceptedRequests || []);
    } catch (error) {
      
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (id: string) => {
    
    setPending(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/user/friends-request/${id}/accept`,
        {}, // Empty body
        {
          withCredentials: true,
        }
      );

     
      toast.success(`you and ${response.data.acceptedRequest.friend.fullName} are now friends`);
      // Remove from incoming requests
      setIncomingRequests((prev) =>
        prev.filter((request) => request.id !== id)
      );

      // Add to accepted requests
      setAcceptedRequest((prev) => [...prev, response.data.acceptedRequest]);
      

      // Refresh the data to get the latest state
      getFriendRequest();

    } catch (error) {
      toast.error('something went wrong,please try again later')
      
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    getFriendRequest();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notifications
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
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
                            <div>
                              <h3 className="font-semibold">
                                {request.user?.fullName || "Unknown User"}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">
                                  Native:{" "}
                                  {request.user?.nativeLanguage || "N/A"}
                                </span>
                                <span className="badge badge-outline badge-sm">
                                  Learning:{" "}
                                  {request.user?.learningLanguage || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              
                              acceptRequest(request.id);
                            }}
                            disabled={pending}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATIONS */}
            {acceptedRequest.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequest.map((notification) => {
                    // Debug logging
                   

                    // Try different possible structures
                    const friendData =
                      notification.friend || notification.user || notification;

                    return (
                      <div
                        key={notification.id}
                        className="card bg-base-200 shadow-sm"
                      >
                        <div className="card-body p-4">
                          <div className="flex items-start gap-3">
                            <div className="avatar mt-1 size-10 rounded-full">
                              <img
                                src={
                                  friendData?.profilePic ||
                                  "/default-avatar.png"
                                }
                                alt={friendData?.fullName || "Friend"}
                               
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">
                                {friendData?.fullName || "Unknown User"}
                              </h3>
                              <p className="text-sm my-1">
                                {friendData?.fullName || "Someone"} accepted
                                your friend request
                              </p>
                              <p className="text-xs flex items-center opacity-70">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                Recently
                              </p>
                            </div>
                            <div className="badge badge-success">
                              <MessageSquareIcon className="h-3 w-3 mr-1" />
                              New Friend
                            </div>
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