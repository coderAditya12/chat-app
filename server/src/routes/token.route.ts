import express from "express";
import { protectedRoute } from "../middleware/protected.js";
import { getStreamToken } from "../controllers/token.controller.js";


const router = express.Router();

router.get("/token", protectedRoute, getStreamToken);

export default router;
