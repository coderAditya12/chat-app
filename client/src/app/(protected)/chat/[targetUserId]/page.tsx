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
import React, { useEffect, useState } from "react";
import { Send } from "lucide-react";

const page = () => {
  const params = useParams();
  const { targetUserId } = params;
  const { user } = userAuthStore((state) => state);
  const userId = user?.id;

  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!", sender: "other" },
    { id: 2, text: "Hi there!", sender: "me" },
    { id: 3, text: "How are you?", sender: "other" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const socket = createSocketConnection();
    
    socket.emit("joinChat", { userId, targetUserId });

    // Add your socket event listeners here
    // socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: "me",
      };

      setMessages((prev) => [...prev, message]);
      setNewMessage("");

      // Add your socket emit here
      // socket.emit("sendMessage", { text: newMessage, targetUserId });
    }
  };

  const handleKeyPress = (e:any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg ${
                message.sender === "me"
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