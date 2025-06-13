import express, { Response, Router, NextFunction } from "express";

import { CustomRequest, verifyToken } from "../middleware/verify.js";
import { googleAuth, signIn, signOut, signUp } from "../controllers/auth.controller.js";


const router: Router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);
router.post("/googleauth", googleAuth);

// Fixed route handler with proper typing
router.get(
  "/verify",
  verifyToken,
  (req: CustomRequest, res: Response, next: NextFunction): void => {
    try {
      res.status(200).json({ valid: true, user: req.user });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
