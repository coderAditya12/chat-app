import express from 'express';
import cookieparser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin: "http://localhost:3000",
    methods: "*",
    credentials: true,
}));
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "internal server error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
