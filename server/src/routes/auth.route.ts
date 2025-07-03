import express, { Response, Router, NextFunction } from "express";

import { CustomRequest, verifyToken } from "../middleware/verify.js";
import {
  googleAuth,
  onboardUser,
  signIn,
  signOut,
  signUp,
  verifyUser,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/protected.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);
router.post("/googleauth", googleAuth);
router.post("/onboard/:id", protectedRoute, onboardUser);

// Fixed route handler with proper typing
router.get("/verify", verifyToken, verifyUser);

export default router;
