"use client";
import userAuthStore from "@/store/userStore";
import { createSocketConnection } from "@/utils/socket";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import {
  Send,
  X,
  Image as ImageIcon,
  ArrowLeft,
  VideoIcon,
  Loader2,
  MessageCircle,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "@/lib/api";
import ChatLoader from "@/components/ChatLoader";
import Link from "next/link";

interface UserInfo {
  id: string;
  fullName: string;
  profilePic: string;
}

interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  sender: UserInfo;
  receiver: UserInfo;
}

const ChatPage = () => {
  const params = useParams();
  const router = useRouter();
  const { targetUserId } = params;
  const { user } = userAuthStore((state) => state);
  const userId = user?.id;
  const [isTyping, setIstyping] = useState<boolean>(false);
  const [otherUserTyping, setOtherUserTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Target user info — fetched separately so header always shows it
  const [targetUser, setTargetUser] = useState<UserInfo | null>(null);
  const [isTargetOnline, setIsTargetOnline] = useState<boolean>(false);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch target user info from friends list
  useEffect(() => {
    const fetchTargetUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user/friends`, {
          withCredentials: true,
        });
        const friends = response.data;
        const friend = friends.find((f: any) => f.id === targetUserId);
        if (friend) {
          setTargetUser({
            id: friend.id,
            fullName: friend.fullName,
            profilePic: friend.profilePic,
          });
        }
      } catch (error) {
        console.error("Error fetching target user info", error);
      }
    };

    if (targetUserId) {
      fetchTargetUser();
    }
  }, [targetUserId]);

  // Also extract target user from messages if not already set
  useEffect(() => {
    if (!targetUser && messages.length > 0) {
      const msg = messages[0];
      const other =
        msg.sender.id !== userId ? msg.sender : msg.receiver;
      setTargetUser(other);
    }
  }, [messages, targetUser, userId]);

  useEffect(() => {
    const socket = createSocketConnection();
    if (!socket) return;

    socketRef.current = socket;

    // Register as online and join chat room
    if (userId) {
      socket.emit("user-online", userId);
    }
    socket.emit("joinChat", { userId, targetUserId });

    // Listen for online status updates
    const handleOnlineUsers = (idsOnly: string[]) => {
      setIsTargetOnline(idsOnly.includes(targetUserId as string));
    };
    socket.on("onlineuserlist", handleOnlineUsers);
    socket.on("updateOnlineUsers", handleOnlineUsers);

    socket.on(
      "messageRecieved",
      ({
        id,
        senderId,
        recieverId,
        text,
        profilePic,
      }: {
        id: number;
        senderId: string;
        recieverId: string;
        text: string;
        profilePic: string;
      }) => {
        const newSocketMessage: Message = {
          id,
          senderId,
          receiverId: recieverId,
          content: text,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sender: {
            id: senderId,
            fullName: senderId === userId ? user?.fullName || "You" : targetUser?.fullName || "User",
            profilePic:
              senderId === userId ? user?.profilePic || "" : profilePic || targetUser?.profilePic || "",
          },
          receiver: {
            id: recieverId,
            fullName:
              recieverId === userId ? user?.fullName || "You" : targetUser?.fullName || "User",
            profilePic: recieverId === userId ? user?.profilePic || "" : "",
          },
        };

        setMessages((prevMessages) => [...prevMessages, newSocketMessage]);
      }
    );
    socket.on("typing", ({ from }: { from: string }) => {
      if (from === targetUserId) {
        setOtherUserTyping(true);
      }
    });

    socket.on("stopTyping", ({ from }: { from: string }) => {
      if (from === targetUserId) {
        setOtherUserTyping(false);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, targetUserId]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError("Image size should be less than 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreview(previewUrl);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Cancel image selection
  const cancelImageSelection = () => {
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setUploadError(null);
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chatlingo");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dbxsllyrx/auto/upload",
        formData,
        { timeout: 30000 }
      );
      return response.data.secure_url;
    } catch (error) {
      throw new Error("Failed to upload image. Please try again.");
    }
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (selectedImage) {
      try {
        setIsUploading(true);
        setUploadError(null);

        const imageUrl = await uploadImageToCloudinary(selectedImage);

        socketRef.current.emit("sendMessage", {
          id: Date.now(),
          userId,
          targetUserId,
          text: imageUrl,
          profilePic: user?.profilePic,
        });

        cancelImageSelection();
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Failed to upload image"
        );
      } finally {
        setIsUploading(false);
      }
    } else if (newMessage.trim()) {
      socketRef.current.emit("sendMessage", {
        id: Date.now(),
        userId,
        targetUserId,
        text: newMessage,
        profilePic: user?.profilePic,
      });

      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const chatHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/chat/${targetUserId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && targetUserId) {
      chatHistory();
    }
  }, [userId, targetUserId]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleVideoCall = () => {
    if (user && targetUserId) {
      const channel = [user.id, targetUserId].sort().join("-");
      const callUrl = `${window.location.origin}/call/${channel}`;
      socketRef.current.emit("sendMessage", {
        id: Date.now(),
        userId,
        targetUserId,
        text: callUrl,
        profilePic: user?.profilePic,
      });
    }
  };

  const isSendDisabled = !newMessage.trim() && !selectedImage;

  return (
    <div className="flex flex-col h-screen bg-base-100">
      {/* ==================== CHAT HEADER ==================== */}
      <div className="bg-base-200 border-b border-base-300 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="btn btn-ghost btn-sm btn-circle"
        >
          <ArrowLeft className="size-5" />
        </button>

        {/* User info */}
        {targetUser ? (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="avatar relative">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                <img
                  src={targetUser.profilePic || "/default-avatar.png"}
                  alt={targetUser.fullName}
                />
              </div>
              {isTargetOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success border-2 border-base-100 rounded-full"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-base-content truncate">
                {targetUser.fullName}
              </h2>
              {otherUserTyping ? (
                <p className="text-xs text-primary animate-pulse">
                  typing...
                </p>
              ) : (
                <p className={`text-xs ${isTargetOnline ? "text-success" : "text-base-content/50"}`}>
                  {isTargetOnline ? "Online" : "Offline"}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-1">
            <div className="avatar placeholder">
              <div className="bg-base-300 text-base-content rounded-full w-10">
                <span className="loading loading-spinner loading-xs"></span>
              </div>
            </div>
            <div>
              <div className="h-4 w-24 bg-base-300 rounded animate-pulse"></div>
              <div className="h-3 w-16 bg-base-300 rounded animate-pulse mt-1"></div>
            </div>
          </div>
        )}

        {/* Video call button */}
        <button
          onClick={handleVideoCall}
          className="btn btn-ghost btn-sm btn-circle text-success hover:bg-success/10"
          title="Start Video Call"
        >
          <VideoIcon className="size-5" />
        </button>
      </div>

      {/* ==================== MESSAGES AREA ==================== */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1 bg-base-100">
        {loading ? (
          <ChatLoader />
        ) : messages.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
            <div className="bg-base-200 rounded-full p-6 mb-4">
              <MessageCircle className="size-12 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-base-content mb-1">
              No messages yet
            </h3>
            <p className="text-sm text-base-content/60 max-w-xs">
              Say hello and start practicing languages together! 🌍
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === userId;
              const showDate =
                index === 0 ||
                formatDate(messages[index - 1].createdAt) !==
                formatDate(message.createdAt);

              return (
                <div key={message.id}>
                  {/* Date divider */}
                  {showDate && (
                    <div className="divider text-xs text-base-content/40 my-6">
                      {formatDate(message.createdAt)}
                    </div>
                  )}

                  {/* DaisyUI Chat Bubble */}
                  <div
                    className={`chat ${isCurrentUser ? "chat-end" : "chat-start"
                      }`}
                  >
                    {/* Avatar */}
                    <div className="chat-image avatar">
                      <div className="w-8 rounded-full">
                        <img
                          src={
                            (isCurrentUser
                              ? user?.profilePic
                              : message.sender?.profilePic || targetUser?.profilePic) ||
                            "/default-avatar.png"
                          }
                          alt="avatar"
                        />
                      </div>
                    </div>

                    {/* Header (name + time) */}
                    <div className="chat-header text-xs text-base-content/50 mb-1">
                      {isCurrentUser ? "You" : (message.sender?.fullName || targetUser?.fullName)}
                      <time className="ml-2">
                        {formatTime(message.createdAt)}
                      </time>
                    </div>

                    {/* Bubble */}
                    <div
                      className={`chat-bubble ${isCurrentUser
                          ? "chat-bubble-primary"
                          : "chat-bubble"
                        }`}
                    >
                      {message.content.match(
                        /\.(jpeg|jpg|gif|png|webp)$/i
                      ) ? (
                        <img
                          src={message.content}
                          alt="sent image"
                          className="max-w-52 max-h-52 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          loading="lazy"
                        />
                      ) : message.content.includes("/call/") ? (
                        <Link
                          href={new URL(message.content).pathname}
                          className="flex items-center gap-2 font-medium hover:underline"
                        >
                          <VideoIcon className="size-4" />
                          Join Video Call 📹
                        </Link>
                      ) : (
                        <p>{message.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {otherUserTyping && (
              <div className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={targetUser?.profilePic || "/default-avatar.png"}
                      alt="typing"
                    />
                  </div>
                </div>
                <div className="chat-bubble bg-base-300">
                  <span className="loading loading-dots loading-sm text-base-content/60"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* ==================== IMAGE PREVIEW ==================== */}
      {imagePreview && (
        <div className="bg-base-200 border-t border-base-300 p-3">
          <div className="flex items-start gap-3">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-24 rounded-lg border border-base-300 object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-base-300/80 flex items-center justify-center rounded-lg">
                  <span className="loading loading-spinner loading-sm text-primary"></span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={cancelImageSelection}
                className="btn btn-ghost btn-xs btn-circle"
                disabled={isUploading}
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
          {uploadError && (
            <p className="text-error text-xs mt-2">{uploadError}</p>
          )}
        </div>
      )}

      {/* ==================== INPUT BAR ==================== */}
      <div className="bg-base-200 border-t border-base-300 p-3">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Image upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="btn btn-ghost btn-sm btn-circle"
            title="Upload Image"
          >
            <ImageIcon className="size-5 text-base-content/70" />
          </button>

          {/* Text input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);

              if (!isTyping) {
                setIstyping(true);
                socketRef.current?.emit("typing", { targetUserId });
              }

              if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
              }

              typingTimeoutRef.current = setTimeout(() => {
                setIstyping(false);
                socketRef.current?.emit("stopTyping", { targetUserId });
              }, 500);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={isUploading}
            className="input input-bordered flex-1 input-sm sm:input-md focus:input-primary"
          />

          {/* Send button */}
          <button
            onClick={handleSendMessage}
            disabled={isSendDisabled || isUploading}
            className="btn btn-primary btn-sm sm:btn-md btn-circle"
          >
            {isUploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatPage;
