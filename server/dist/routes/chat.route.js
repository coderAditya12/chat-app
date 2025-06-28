import express from "express";
import { protectedRoute } from "../middleware/protected.js";
const router = express.Router();
router.use(protectedRoute);
export default router;
