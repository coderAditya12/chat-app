"use client";
import userAuthStore from "@/store/userStore";
import { createSocketConnection } from "@/utils/socket";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { Send, X, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/lib/api";
import ChatLoader from "@/components/ChatLoader";
import CallButton from "@/components/CallButton";
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


const page = () => {
  const params = useParams();
  const { targetUserId } = params;
  const { user } = userAuthStore((state) => state);
  const userId = user?.id;
  const [isTyping, setIstyping] = useState<boolean>(false);
  const [otherUserTyping, setOtherUserTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

  useEffect(() => {
    const socket = createSocketConnection();
    if (!socket) return;

    socketRef.current = socket;

    socket.emit("joinChat", { userId, targetUserId });

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
        console.log(id, senderId, recieverId, text, profilePic);

        // Convert socket message to Message format
        const newSocketMessage: Message = {
          id,
          senderId,
          receiverId: recieverId,
          content: text,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sender: {
            id: senderId,
            fullName: senderId === userId ? user?.fullName || "You" : "Unknown",
            profilePic:
              senderId === userId ? user?.profilePic || "" : profilePic,
          },
          receiver: {
            id: recieverId,
            fullName:
              recieverId === userId ? user?.fullName || "You" : "Unknown",
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

  // Handle file selection (not upload yet)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset any previous errors
    setUploadError(null);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError("Image size should be less than 5MB");
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreview(previewUrl);

    // Clear the file input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Cancel image selection
  const cancelImageSelection = () => {
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview); // Clean up memory
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
        {
          timeout: 30000, // 30 seconds timeout
        }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Failed to upload image. Please try again.");
    }
  };

  // Handle sending message (text or image)
  const handleSendMessage = async () => {
    // If there's a selected image, upload and send it
    if (selectedImage) {
      try {
        setIsUploading(true);
        setUploadError(null);

        const imageUrl = await uploadImageToCloudinary(selectedImage);

        // Send image message
        socketRef.current.emit("sendMessage", {
          id: Date.now(),
          userId,
          targetUserId,
          text: imageUrl,
          profilePic: user?.profilePic,
        });

        // Clean up image selection
        cancelImageSelection();
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploadError(
          error instanceof Error ? error.message : "Failed to upload image"
        );
      } finally {
        setIsUploading(false);
      }
    }
    // If there's text message, send it
    else if (newMessage.trim()) {
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

      console.log("Chat history response:", response.data);

      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.log("Error fetching messages:", error);
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

  // Check if send button should be disabled
  const isSendDisabled = !newMessage.trim() && !selectedImage;

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <CallButton handleVideoCall={handleVideoCall} />
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <h2 className="text-white text-lg font-semibold">
          {messages.length > 0 && messages[0].sender.id !== userId
            ? messages[0].sender.fullName
            : messages.length > 0 && messages[0].receiver.id !== userId
            ? messages[0].receiver.fullName
            : "Chat"}
        </h2>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <ChatLoader />
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
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start gap-2 max-w-xs ${
                        isCurrentUser ? "flex-row-reverse" : ""
                      }`}
                    >
                      {/* Profile Picture */}
                      <img
                        src={
                          message.sender?.profilePic || "/default-avatar.png"
                        }
                        alt={message.sender.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />

                      {/* Message Bubble */}
                      <div
                        className={`flex flex-col ${
                          isCurrentUser ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`px-3 py-2 rounded-lg ${
                            isCurrentUser
                              ? "bg-blue-600 text-white"
                              : "bg-gray-700 text-gray-100"
                          }`}
                        >
                          {message.content.match(
                            /\.(jpeg|jpg|gif|png|webp)$/i
                          ) ? (
                            <img
                              src={message.content}
                              alt="sent image"
                              className="max-w-48 max-h-48 rounded-lg border border-gray-600 object-cover"
                              loading="lazy"
                            />
                          ) : message.content.includes("/call/") ? (
                            <Link
                              href={new URL(message.content).pathname}
                              className="text-blue-400 underline text-sm"
                            >
                              Join Video Call
                            </Link>
                          ) : (
                            <p className="text-sm">{message.content}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {otherUserTyping && (
              <div className="text-sm text-gray-400 mb-2 ml-2">Typing...</div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Image Preview Section */}
      {imagePreview && (
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm">Image Preview</span>
            <button
              onClick={cancelImageSelection}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-32 max-h-32 rounded-lg border border-gray-600 object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          {uploadError && (
            <p className="text-red-400 text-sm mt-2">{uploadError}</p>
          )}
        </div>
      )}

      {/* Input and Send Button */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex gap-2 items-end">
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
            className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
            title="Upload Image"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Text input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);

              // Start typing if not already typing
              if (!isTyping) {
                setIstyping(true);
                socketRef.current?.emit("typing", { targetUserId });
              }

              // Clear existing timeout
              if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
              }

              // Set new timeout
              typingTimeoutRef.current = setTimeout(() => {
                setIstyping(false);
                socketRef.current?.emit("stopTyping", { targetUserId });
              }, 500);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={isUploading}
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />

          {/* Send button */}
          <button
            onClick={handleSendMessage}
            disabled={isSendDisabled || isUploading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isUploading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default page;
