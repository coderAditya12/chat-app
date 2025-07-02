import jwt from "jsonwebtoken";
import errorHandler from "./error.js";
export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.accesstoken;
        console.log("Token from cookies:", token);
        if (!token) {
            return errorHandler(res, 401, "Unauthorized access. Please log in.");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        if (!decoded) {
            return errorHandler(res, 401, "Invalid token. Please log in again.");
        }
        req.user = decoded;
        console.log("User from token:", req.user);
        next();
    }
    catch (error) {
        console.log("Error in protectedRoute middleware:", error);
        next(error);
    }
};
