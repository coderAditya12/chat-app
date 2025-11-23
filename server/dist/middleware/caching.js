import { client } from "../index.js";
export const checkUserInCache = async (req, res, next) => {
    console.log("Checking cache for user data");
    const userId = req.user?.id;
    try {
        const result = await client.get("recommendedUsers:" + userId);
        console.log(result);
        if (result) {
            const data = JSON.parse(result);
            res.status(200).json({ success: true, data: data });
            return;
        }
        next();
    }
    catch (error) {
        next();
    }
};
