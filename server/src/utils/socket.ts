import { Server } from "socket.io";
import { prisma } from "./db.js";
interface onlineUsers {
  userId: string;
  socketId: string;
}
let onlineUsers: onlineUsers[] = [];
export const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    // Fixed: "connection" not "connections"
    console.log("user connected", socket.id);

    socket.on(
      "joinChat",
      ({ userId, targetUserId }: { userId: string; targetUserId: string }) => {
        // Fixed the console.log - there was a syntax error
        console.log("userId:", userId, "targetUserId:", targetUserId);
        socket.data.userId = userId;

        // Create a room name (you can use any logic you want)
        const roomName = [userId, targetUserId].sort().join("-");

        // Join the room
        socket.join(roomName);
        console.log(`User ${userId} joined room: ${roomName}`);
      }
    );

    socket.on(
      "sendMessage",
      async ({
        id,
        userId,
        targetUserId,
        text,
        profilePic,
      }: {
        id: number;
        userId: string;
        targetUserId: string;
        text: string;
        profilePic: string;
      }) => {
        const roomName = [userId, targetUserId].sort().join("-");
        console.log("messsage recieved", text);
        io.to(roomName).emit("messageRecieved", {
          id,
          senderId: userId,
          recieverId: targetUserId,
          text,
          profilePic,
        });
        try {
          const newMessage = await prisma.message.create({
            data: {
              senderId: userId,
              receiverId: targetUserId,
              content: text,
            },
            include: {
              sender: {
                select: {
                  id: true,
                  fullName: true,
                  profilePic: true,
                },
              },
              receiver: {
                select: {
                  id: true,
                  fullName: true,
                  profilePic: true,
                },
              },
            },
          });
        } catch (error) {
          console.log("error in sending the message", error);
        }
      }
    );
    socket.on("user-online", (userId) => {
      console.log(userId);
      if (!onlineUsers.some((user) => user.userId === userId)) {
        onlineUsers.push({ userId, socketId: socket.id });
      }
      const idsOnly = onlineUsers.map((user) => user.userId);
      io.emit("onlineuserlist", idsOnly);
      console.log("ids only Users:", idsOnly);
    });
 socket.on("typing", ({ targetUserId }: { targetUserId: string }) => {
   const userId = socket.data.userId;
   if (userId && targetUserId) {
     const roomName = [userId, targetUserId].sort().join("-");
     // Emit to room but exclude the sender
     socket.to(roomName).emit("typing", {
       from: userId,
       targetUserId: targetUserId,
     });
     console.log(`${userId} is typing in room ${roomName}`);
   }
 });

 socket.on("stopTyping", ({ targetUserId }: { targetUserId: string }) => {
   const userId = socket.data.userId;
   if (userId && targetUserId) {
     const roomName = [userId, targetUserId].sort().join("-");
     // Emit to room but exclude the sender
     socket.to(roomName).emit("stopTyping", {
       from: userId,
       targetUserId: targetUserId,
     });
     console.log(`${userId} stopped typing in room ${roomName}`);
   }
 });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      const idsOnly = onlineUsers.map((user) => user.userId);
      io.emit("updateOnlineUsers", idsOnly);
      console.log("❌ Disconnected:", socket.id);
    });
  });
};
