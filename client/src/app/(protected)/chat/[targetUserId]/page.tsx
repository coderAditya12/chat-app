
"use client";
import userAuthStore from "@/store/userStore";
import { createSocketConnection } from "@/utils/socket";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";
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

interface SocketMessage {
  id: number;
  senderId: string;
  recieverId: string;
  text: string;
}

const page = () => {
  const params = useParams();
  const { targetUserId } = params;
  const { user } = userAuthStore((state) => state);
  const userId = user?.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, targetUserId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    socketRef.current.emit("sendMessage", {
      id: Date.now(),
      userId,
      targetUserId,
      text: newMessage,
      profilePic: user?.profilePic,
    });

    setNewMessage("");
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
      const response = await axios.get(`${API_URL}/chat/${targetUserId}`, {
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
                          <div
                            className={`px-3 py-2 rounded-lg ${
                              isCurrentUser
                                ? "bg-blue-600 text-white"
                                : "bg-gray-700 text-gray-100"
                            }`}
                          >
                            {message.content.startsWith("http") ? (
                              <Link
                                href={new URL(message.content).pathname} // Extract only internal path
                                className="text-blue-400 underline text-sm"
                              >
                                Join Video Call
                              </Link>
                            ) : (
                              <p className="text-sm">{message.content}</p>
                            )}
                          </div>
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
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input and Send Button */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
