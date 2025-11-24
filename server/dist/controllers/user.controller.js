import { prisma } from "../utils/db.js";
import errorHandler from "../middleware/error.js";
import { client } from "../index.js";
export const getRecommendedUsers = async (req, res, next) => {
    try {
        const currentUserId = req.user?.id;
        // Step 1: Get all friend relationships of current user
        const friends = await prisma.friend.findMany({
            where: {
                OR: [{ userId: currentUserId }, { friendId: currentUserId }],
                status: "accepted",
            },
            select: {
                userId: true,
                friendId: true,
            },
        });
        // Step 2: Extract friend IDs
        const friendIds = friends.map((f) => {
            // If currentUserId is userId, friend is friendId — and vice versa
            return f.userId === currentUserId ? f.friendId : f.userId;
        });
        // Step 3: Find recommended users
        const recommendedUsers = await prisma.user.findMany({
            where: {
                AND: [
                    { id: { not: currentUserId } }, // exclude self
                    { id: { notIn: friendIds } }, // exclude friends
                    { isOnboard: true }, // only onboarded
                ],
            },
        });
        const cacheRecommendedUsers = await client.set("recommendedUsers", JSON.stringify(recommendedUsers));
        res.status(200).json({
            success: true,
            data: recommendedUsers,
        });
    }
    catch (error) {
        next(error);
        console.log(error);
    }
};
export const getFriends = async (req, res, next) => {
    const currentUserId = req.user?.id;
    try {
        const friends = await prisma.friend.findMany({
            where: {
                status: "accepted",
                OR: [{ userId: currentUserId }, { friendId: currentUserId }],
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        profilePic: true,
                        nativeLanguage: true,
                        learningLanguage: true,
                    },
                },
                friend: {
                    select: {
                        id: true,
                        fullName: true,
                        profilePic: true,
                        nativeLanguage: true,
                        learningLanguage: true,
                    },
                },
            },
        });
        const myFriends = friends.map((f) => f.userId === currentUserId ? f.friend : f.user);
        res.status(200).json(myFriends);
    }
    catch (error) {
        console.log("Error fetching friends:", error);
        next(error);
    }
};
export const sendFriendRequest = async (req, res, next) => {
    const myId = req.user?.id;
    const recipientId = req.params.id;
    if (!myId) {
        res.status(401).json({ message: "Unauthorized: user id missing" });
        return;
    }
    try {
        // Step 1: Prevent sending request to self
        if (myId === recipientId) {
            res
                .status(400)
                .json({ message: "You can't send friend request to yourself" });
            return;
        }
        // Step 2: Check if recipient exists
        const recipient = await prisma.user.findUnique({
            where: { id: recipientId },
        });
        if (!recipient) {
            res.status(404).json({ message: "Recipient not found" });
            return;
        }
        // Step 3: Check if already friends
        const alreadyFriends = await prisma.friend.findFirst({
            where: {
                OR: [
                    { userId: myId, friendId: recipientId },
                    { userId: recipientId, friendId: myId },
                ],
                status: "accepted",
            },
        });
        if (alreadyFriends) {
            res
                .status(400)
                .json({ message: "You are already friends with this user" });
            return;
        }
        // Step 4: Check if a request already exists
        const existingRequest = await prisma.friend.findFirst({
            where: {
                OR: [
                    { userId: myId, friendId: recipientId },
                    { userId: recipientId, friendId: myId },
                ],
                status: "pending",
            },
        });
        if (existingRequest) {
            res.status(400).json({
                message: "A friend request already exists between you and this user",
            });
            return;
        }
        // Step 5: Create friend request
        const newRequest = await prisma.friend.create({
            data: {
                userId: myId,
                friendId: recipientId,
                status: "pending",
            },
        });
        res.status(201).json(newRequest);
    }
    catch (error) {
        console.log("Error sending friend request:", error);
        next(error);
    }
};
export const acceptFriendRequest = async (req, res, next) => {
    try {
        const { id: requestId } = req.params;
        const currentUserId = req.user?.id;
        //find teh friend request by ID
        const friendRequest = await prisma.friend.findUnique({
            where: { id: Number(requestId) },
        });
        if (!friendRequest) {
            errorHandler(res, 404, "Friend request not found");
            return;
        }
        //only the recipient can accept the request
        if (friendRequest.friendId !== currentUserId) {
            errorHandler(res, 403, "You are not authorized to accept this request");
            return;
        }
        //update the status to accepted
        const updatedFriendRequest = await prisma.friend.update({
            where: { id: friendRequest.id },
            data: { status: "accepted" },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        profilePic: true,
                        nativeLanguage: true,
                        learningLanguage: true,
                    },
                },
            },
        });
        // res.status(200).json({ message: "Friend request accepted successfully" });
        res.status(200).json({
            message: "Friend request accepted successfully",
            acceptedRequest: {
                id: updatedFriendRequest.id,
                status: updatedFriendRequest.status,
                friend: updatedFriendRequest.user, // This provides the friend data
                createdAt: updatedFriendRequest.createdAt,
                updatedAt: updatedFriendRequest.updatedAt,
            },
        });
    }
    catch (error) {
        console.log("Error accepting friend request:", error);
        next(error);
    }
};
export const getFriendRequests = async (req, res, next) => {
    const currentUserId = req.user?.id;
    //get incoming friend requests(other people sent me)
    try {
        const incomingRequests = await prisma.friend.findMany({
            where: {
                friendId: currentUserId,
                status: "pending",
            },
            include: {
                user: {
                    select: {
                        fullName: true,
                        profilePic: true,
                        nativeLanguage: true,
                        learningLanguage: true,
                    },
                },
            },
        });
        //get accepted request i sent( and were accepted)
        const acceptedRequests = await prisma.friend.findMany({
            where: {
                userId: currentUserId,
                status: "accepted",
            },
            include: {
                friend: {
                    select: {
                        fullName: true,
                        profilePic: true,
                    },
                },
            },
        });
        res.status(200).json({ incomingRequests, acceptedRequests });
    }
    catch (error) {
        console.log("Error fetching friend requests:", error);
        next(error);
    }
};
export const getOutgoingFriendRequests = async (req, res, next) => {
    const currentUserId = req.user?.id;
    try {
        const outgoingRequests = await prisma.friend.findMany({
            where: {
                userId: currentUserId, // i am the one who sent the request
                status: "pending", //request is still not accepted
            },
            include: {
                friend: {
                    //this is the person i sent the request to
                    select: {
                        fullName: true,
                        profilePic: true,
                        nativeLanguage: true,
                        learningLanguage: true,
                    },
                },
            },
        });
        res.status(200).json(outgoingRequests);
    }
    catch (error) {
        console.log("Error fetching outgoing friend requests:", error);
        next(error);
    }
};
