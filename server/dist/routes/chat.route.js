import express from "express";
import { protectedRoute } from "../middleware/protected.js";
import { chatHistory } from "../controllers/chat.controller.js";
const router = express.Router();
router.use(protectedRoute);
router.get('/chat/:targetUserId', chatHistory);
export default router;
