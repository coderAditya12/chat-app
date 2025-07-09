import express from "express";
import cookieparser from "cookie-parser";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import chatRoute from "./routes/chat.route.js";
import tokenRoute from "./routes/token.route.js";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import { createServer } from "http";
import { initializeSocket } from "./utils/socket.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));
app.use("/api/auth", authRoute);
app.use("/api/user", userRouter);
app.use("/api", chatRoute);
app.use("/api", tokenRoute);
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "internal server error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
const httpServer = createServer(app);
initializeSocket(httpServer);
httpServer.listen(5000, () => {
    console.log("Server is running on port 5000");
});
