// "use client";
// import userAuthStore from "@/store/userStore";
// import { createSocketConnection } from "@/utils/socket";
// import { useParams } from "next/navigation";
// import React, { useEffect } from "react";

// const page = () => {
//   const params = useParams();
//   const { targetUserId } = params;
//   const { user } = userAuthStore((state) => state);
//   const userId = user?.id;
//   useEffect(() => {
//     const socket = createSocketConnection();
//     socket.emit("joinChat",{userId,targetUserId});
//   }, []);

//   return <div>{targetUserId}</div>;
// };
// export default page;
"use client";
import userAuthStore from "@/store/userStore";
import { createSocketConnection } from "@/utils/socket";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";
type Message = {
  text: string;
  sender: string;
};

const page = () => {
  const params = useParams();
  const { targetUserId } = params;
  const { user } = userAuthStore((state) => state);
  const userId = user?.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = createSocketConnection();
    if (!socket) return;

    socketRef.current = socket;

    socket.emit("joinChat", { userId, targetUserId });

    socket.on(
      "messageRecieved",
      ({ text, sender }: { text: string; sender: string }) => {
        setMessages((prevMessages) => [...prevMessages, { text, sender }]);
      }
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, targetUserId]);

  const handleSendMessage = () => {
    socketRef.current.emit("sendMessage", {
      userId,
      targetUserId,
      text: newMessage,
    });
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <div
            key={Math.random()}
            className={`flex ${
              message.sender === user?.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg ${
                message.sender === user?.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
