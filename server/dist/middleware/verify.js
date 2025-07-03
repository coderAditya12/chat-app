import jwt from "jsonwebtoken";
// Create access token
const createAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET);
};
// Create refresh token
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.JWT_REFRESH_SECRET);
};
// Middleware to check access token
export const verifyToken = (req, res, next) => {
    const token = req.cookies.accesstoken;
    if (!token) {
        renewToken(req, res, next);
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || !decoded) {
            renewToken(req, res, next);
            return;
        }
        // Make sure it's an object (not a string)
        if (typeof decoded === "object") {
            req.user = decoded;
        }
        next();
    });
};
// Function to renew token
const renewToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshtoken;
    if (!refreshToken) {
        res
            .status(401)
            .json({ valid: false, message: "No refresh token provided" });
        return;
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err || !decoded || typeof decoded !== "object") {
            res
                .status(403)
                .json({ valid: false, message: "Invalid refresh token" });
            return;
        }
        const newAccessToken = createAccessToken(decoded);
        res.cookie("accesstoken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });
        req.user = decoded;
        next();
    });
};
