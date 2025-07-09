import { Errback, NextFunction, Request, Response } from "express";
import { generateStreamToken } from "../utils/stream.js";
import { CustomRequest } from "../middleware/protected.js";

export const getStreamToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const token = generateStreamToken(userId || "");
    res.status(200).json({ token });
  } catch (error: any) {
    console.log("Error in getStreamToken controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
