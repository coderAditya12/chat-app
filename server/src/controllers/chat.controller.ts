import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/db.js";
import { CustomRequest } from "../middleware/protected.js";

export const chatHistory = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { targetUserId } = req.params;
  const userId = req.user?.id;
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: targetUserId,
          },
          { senderId: targetUserId, receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            profilePic: true,
          },
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            profilePic: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json({success:true,
        messages:messages.reverse(),
        // hasMore:messages.length ===limit
    })
  } catch (error) {
    console.log("error fetching chat history",error);
    next(error);
  }
};
