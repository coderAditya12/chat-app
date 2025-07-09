import { generateStreamToken } from "../utils/stream.js";
export const getStreamToken = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const token = generateStreamToken(userId || "");
        res.status(200).json({ token });
    }
    catch (error) {
        console.log("Error in getStreamToken controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
