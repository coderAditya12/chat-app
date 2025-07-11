import { Server } from "socket.io";
import { prisma } from "./db.js";
interface onlineUsers {
  userId: string;
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
      const isAlreadyOnline = onlineUsers.includes(userId);
      if (!isAlreadyOnline) {
        onlineUsers.push(userId);
      }
      socket.emit("onlineuserlist", onlineUsers);
      console.log("online Users:", onlineUsers);
    });
    //user offline
    socket.on("user-offline", (userId) => {
      if (onlineUsers.includes(userId)) {
        onlineUsers = onlineUsers.filter((id) => id !== userId);
      }
      // socket.emit("user-disconnected",onli)
    });

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    });
  });
};
