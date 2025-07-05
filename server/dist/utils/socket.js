import { Server } from "socket.io";
export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
        },
    });
    io.on("connection", (socket) => {
        // Fixed: "connection" not "connections"
        console.log("user connected", socket.id);
        socket.on("joinChat", ({ userId, targetUserId }) => {
            // Fixed the console.log - there was a syntax error
            console.log("userId:", userId, "targetUserId:", targetUserId);
            // Create a room name (you can use any logic you want)
            const roomName = [userId, targetUserId].sort().join("-");
            // Join the room
            socket.join(roomName);
            console.log(`User ${userId} joined room: ${roomName}`);
        });
        socket.on("sendMessage", ({ userId, targetUserId, text }) => {
            const roomName = [userId, targetUserId].sort().join("-");
            console.log("messsage recieved", text);
            io.to(roomName).emit("messageRecieved", { text, sender: userId });
        });
        socket.on("disconnect", () => {
            console.log("user disconnected", socket.id);
        });
    });
};
