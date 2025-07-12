// "use client";
// import { withAuthAndOnboarding } from "@/components/HOC";
// import { API_URL } from "@/lib/api";
// import axios from "axios";
// import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const NotificationPage = () => {
//   const [loading, setLoading] = useState(true);
//   const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
//   const [acceptedRequest, setAcceptedRequest] = useState<any[]>([]);
//   const [pending, setPending]= useState(false)

//   const getFriendRequest = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/user/getFriend-requets`, {
//         withCredentials: true,
//       });
//       setIncomingRequests(response.data.incomingRequests);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const acceptRequest = async (id: any) => {

//    try {
//     const response = await axios.put(
//       `${API_URL}/user//friends-request/${id}/accept`,
//       {
//         withCredentials: true,
//       }
//     );
//     console.log("");
//    } catch (error) {

//    }
//   };

//   useEffect(() => {
//     getFriendRequest();
//   }, []);
//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       <div className="container mx-auto max-w-4xl space-y-8">
//         <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
//           Notifications
//         </h1>

//         {loading ? (
//           <div className="flex justify-center py-12">
//             <span className="loading loading-spinner loading-lg"></span>
//           </div>
//         ) : (
//           <>
//             {incomingRequests.length > 0 && (
//               <section className="space-y-4">
//                 <h2 className="text-xl font-semibold flex items-center gap-2">
//                   <UserCheckIcon className="h-5 w-5 text-primary" />
//                   Friend Requests
//                   <span className="badge badge-primary ml-2">
//                     {incomingRequests.length}
//                   </span>
//                 </h2>

//                 <div className="space-y-3">
//                   {incomingRequests.map((request) => (
//                     <div
//                       key={request.id}
//                       className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
//                     >
//                       <div className="card-body p-4">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className="avatar w-14 h-14 rounded-full bg-base-300">
//                               <img
//                                 src={request.sender?.profilePic}
//                                 alt={request.sender?.fullName}
//                               />
//                             </div>
//                             <div>
//                               <h3 className="font-semibold">
//                                 {request.sender.fullName}
//                               </h3>
//                               <div className="flex flex-wrap gap-1.5 mt-1">
//                                 <span className="badge badge-secondary badge-sm">
//                                   Native: {request.sender.nativeLanguage}
//                                 </span>
//                                 <span className="badge badge-outline badge-sm">
//                                   Learning: {request.sender.learningLanguage}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           <button
//                             className="btn btn-primary btn-sm"
//                             onClick={() => acceptRequest(request.id)}
//                             disabled={pending}
//                           >
//                             Accept
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* ACCEPTED REQS NOTIFICATONS */}
//             {acceptedRequest.length > 0 && (
//               <section className="space-y-4">
//                 <h2 className="text-xl font-semibold flex items-center gap-2">
//                   <BellIcon className="h-5 w-5 text-success" />
//                   New Connections
//                 </h2>

//                 <div className="space-y-3">
//                   {acceptedRequest.map((notification) => (
//                     <div
//                       key={notification._id}
//                       className="card bg-base-200 shadow-sm"
//                     >
//                       <div className="card-body p-4">
//                         <div className="flex items-start gap-3">
//                           <div className="avatar mt-1 size-10 rounded-full">
//                             <img
//                               src={notification.recipient.profilePic}
//                               alt={notification.recipient.fullName}
//                             />
//                           </div>
//                           <div className="flex-1">
//                             <h3 className="font-semibold">
//                               {notification.recipient.fullName}
//                             </h3>
//                             <p className="text-sm my-1">
//                               {notification.recipient.fullName} accepted your
//                               friend request
//                             </p>
//                             <p className="text-xs flex items-center opacity-70">
//                               <ClockIcon className="h-3 w-3 mr-1" />
//                               Recently
//                             </p>
//                           </div>
//                           <div className="badge badge-success">
//                             <MessageSquareIcon className="h-3 w-3 mr-1" />
//                             New Friend
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {incomingRequests.length === 0 && acceptedRequest.length === 0 && (
//               // <NoNotificationsFound />
//               <p>no notification found</p>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default withAuthAndOnboarding(NotificationPage);

// "use client";
// import { withAuthAndOnboarding } from "@/components/HOC";
// import NoNotificationsFound from "@/components/NoNotification";
// import { API_URL } from "@/lib/api";
// import axios from "axios";
// import {
//   BellIcon,
//   ClockIcon,
//   MessageSquareIcon,
//   UserCheckIcon,
// } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const NotificationPage = () => {
//   const [loading, setLoading] = useState(true);
//   const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
//   const [acceptedRequest, setAcceptedRequest] = useState<any[]>([]);
//   const [pending, setPending] = useState(false);

//   const getFriendRequest = async () => {
//     console.log("Fetching friend requests...");
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/user/getFriend-requets`,
//         {
//           withCredentials: true,
//         }
//       );

//       console.log("Friend requests fetched:", response.data);

//       setIncomingRequests(response.data.incomingRequests || []);
//       setAcceptedRequest(response.data.acceptedRequests || []);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const acceptRequest = async (id: string) => {
//     console.log("Accepting friend request with id:", id);
//     setPending(true);
//     try {
//       const response = await axios.put(
//         `${API_URL}/api/user/friends-request/${id}/accept`,
//         {}, // Empty body
//         {
//           withCredentials: true,
//         }
//       );

//       console.log("Friend request accepted:", response.data);

//       // Optionally update UI after accepting
//       // setIncomingRequests((prev) =>
//       //   prev.filter((request) => request.id !== id)
//       // );
//       // setAcceptedRequest((prev) => [...prev, response.data.acceptedRequest]);
//     } catch (error) {
//       console.error("Error accepting request:", error);
//     } finally {
//       setPending(false);
//     }
//   };

//   useEffect(() => {
//     getFriendRequest();
//   }, []);

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       <div className="container mx-auto max-w-4xl space-y-8">
//         <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
//           Notifications
//         </h1>

//         {loading ? (
//           <div className="flex justify-center py-12">
//             <span className="loading loading-spinner loading-lg"></span>
//           </div>
//         ) : (
//           <>
//             {incomingRequests.length > 0 && (
//               <section className="space-y-4">
//                 <h2 className="text-xl font-semibold flex items-center gap-2">
//                   <UserCheckIcon className="h-5 w-5 text-primary" />
//                   Friend Requests
//                   <span className="badge badge-primary ml-2">
//                     {incomingRequests.length}
//                   </span>
//                 </h2>

//                 <div className="space-y-3">
//                   {incomingRequests.map((request) => (
//                     <div
//                       key={request.id}
//                       className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
//                     >
//                       <div className="card-body p-4">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className="avatar w-14 h-14 rounded-full bg-base-300">
//                               <img
//                                 src={request.user?.profilePic}
//                                 alt={request.user?.fullName}
//                               />
//                             </div>
//                             <div>
//                               <h3 className="font-semibold">
//                                 {request.user.fullName}
//                               </h3>
//                               <div className="flex flex-wrap gap-1.5 mt-1">
//                                 <span className="badge badge-secondary badge-sm">
//                                   Native: {request.user.nativeLanguage}
//                                 </span>
//                                 <span className="badge badge-outline badge-sm">
//                                   Learning: {request.user.learningLanguage}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           <button
//                             className="btn btn-primary btn-sm"
//                             onClick={() => {
//                               console.log(
//                                 "Accept button clicked for:",
//                                 request.id
//                               );
//                               acceptRequest(request.id);
//                             }}
//                             disabled={pending}
//                           >
//                             Accept
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* ACCEPTED REQS NOTIFICATONS */}
//             {acceptedRequest.length > 0 && (
//               <section className="space-y-4">
//                 <h2 className="text-xl font-semibold flex items-center gap-2">
//                   <BellIcon className="h-5 w-5 text-success" />
//                   New Connections
//                 </h2>

//                 <div className="space-y-3">
//                   {acceptedRequest.map((notification) => {
//                     console.log()(
//                     <div
//                       key={notification.id}
//                       className="card bg-base-200 shadow-sm"
//                     >
//                       <div className="card-body p-4">
//                         <div className="flex items-start gap-3">
//                           <div className="avatar mt-1 size-10 rounded-full">
//                             <img
//                               src={notification.friend.profilePic}
//                               alt={notification.friend.fullName}
//                               onError={() => {
//                                 console.log(Error);
//                               }}
//                             />
//                           </div>
//                           <div className="flex-1">
//                             <h3 className="font-semibold">
//                               {notification.friend.fullName}
//                             </h3>
//                             <p className="text-sm my-1">
//                               {notification.friend.fullName} accepted your
//                               friend request
//                             </p>
//                             <p className="text-xs flex items-center opacity-70">
//                               <ClockIcon className="h-3 w-3 mr-1" />
//                               Recently
//                             </p>
//                           </div>
//                           <div className="badge badge-success">
//                             <MessageSquareIcon className="h-3 w-3 mr-1" />
//                             New Friend
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )})}
//                 </div>
//               </section>
//             )}

//             {incomingRequests.length === 0 && acceptedRequest.length === 0 && (
//               <NoNotificationsFound />
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default withAuthAndOnboarding(NotificationPage);
"use client";
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
    console.log("Fetching friend requests...");
    try {
      const response = await axios.get(
        `${API_URL}/api/user/getFriend-requets`,
        {
          withCredentials: true,
        }
      );

      console.log("Friend requests fetched:", response.data);

      setIncomingRequests(response.data.incomingRequests || []);
      setAcceptedRequest(response.data.acceptedRequests || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (id: string) => {
    console.log("Accepting friend request with id:", id);
    setPending(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/user/friends-request/${id}/accept`,
        {}, // Empty body
        {
          withCredentials: true,
        }
      );

      console.log("Friend request accepted:", response.data);
      console.log("Accepted request structure:", response.data.acceptedRequest);
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
      console.error("Error accepting request:", error);
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
                              console.log(
                                "Accept button clicked for:",
                                request.id
                              );
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
                    console.log("Notification object:", notification);

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
                                onError={(e) => {
                                  console.log(
                                    "Image load error for:",
                                    friendData
                                  );
                                  e.currentTarget.src = "/default-avatar.png";
                                }}
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