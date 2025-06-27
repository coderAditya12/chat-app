import express from "express";
import { getFriends, getRecommendedUsers } from "../controllers/user.controller.js";
import { protectedRoute } from "../middleware/protected.js";
const router = express.Router();
router.get("/", protectedRoute, getRecommendedUsers);
router.get("/friends", getFriends);
