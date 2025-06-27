import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middleware/protected.js";
import { prisma } from "../utils/db.js";

export const getRecommendedUsers = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUserId = req.user?.id;
    const currentUser = req.user;

    const acceptedFriends = await prisma.friend.findMany();
  } catch (error) {
    console.log(error);
  }
};
export const getFriends = () => {};
