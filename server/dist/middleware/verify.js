import jwt from "jsonwebtoken";
// Utility to create access token
const createAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET);
};
// Utility to create refresh token
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.JWT_REFRESH_SECRET);
};
// Middleware to verify access token and refresh if needed
export const verifyToken = (req, res, next) => {
    const token = req.cookies.accesstoken;
    if (!token) {
        renewToken(req, res, next);
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            renewToken(req, res, next);
            return;
        }
        if (user) {
            req.user = user;
        }
        next();
    });
};
// Function to renew access token using refresh token
const renewToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshtoken;
    if (!refreshToken) {
        res
            .status(401)
            .json({ valid: false, message: "No refresh token provided" });
        return;
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err || !user) {
            res
                .status(403)
                .json({ valid: false, message: "Invalid refresh token" });
            return;
        }
        // Create new access token
        const newAccessToken = createAccessToken(user);
        // Set new access token in cookie
        res.cookie("accesstoken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        req.user = user;
        next();
    });
};
