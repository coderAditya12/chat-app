import { prisma } from "../utils/db.js";
export const chatHistory = async (req, res, next) => {
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
        res.status(200).json({ success: true,
            messages: messages.reverse(),
            // hasMore:messages.length ===limit
        });
    }
    catch (error) {
        console.log("error fetching chat history", error);
        next(error);
    }
};
