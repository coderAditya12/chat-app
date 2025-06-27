import { prisma } from "../utils/db.js";
export const getRecommendedUsers = async (req, res, next) => {
    try {
        const currentUserId = req.user?.id;
        const currentUser = req.user;
        const acceptedFriends = await prisma.friend.find;
    }
    catch (error) {
        console.log(error);
    }
};
export const getFriends = () => { };
