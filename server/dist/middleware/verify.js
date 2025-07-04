// import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
// import { NextFunction, Request, Response } from "express";
// export interface CustomJwtPayload extends JwtPayload {
//   id: string;
//   // Add other properties you store in your JWT
//   email?: string;
// }
// export interface CustomRequest extends Request {
//   user?: CustomJwtPayload;
// }
// // Utility to create access token
// const createAccessToken = (user: any): string => {
//   return jwt.sign(user, process.env.JWT_SECRET as string);
// };
// // Utility to create refresh token
// const createRefreshToken = (user: object): string => {
//   return jwt.sign(user, process.env.JWT_REFRESH_SECRET as string);
// };
// // Middleware to verify access token and refresh if needed
// export const verifyToken = (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ): void => {
//   const token = req.cookies.accesstoken;
//   if (!token) {
//     renewToken(req, res, next);
//     return;
//   }
//   try {
//     jwt.verify(
//       token,
//       process.env.JWT_SECRET as string,
//       (err: VerifyErrors | null, user: JwtPayload | string | undefined) => {
//         if (err) {
//           renewToken(req, res, next);
//           return;
//         }
//         if (user) {
//           console.log("user", user);
//           req.user = user;
//         }
//         next();
//       }
//     );
//   } catch (error) {
//     console.log("access token",error);
//     next(error);
//   }
// };
// // Function to renew access token using refresh token
// const renewToken = (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ): void => {
//   const refreshToken = req.cookies.refreshtoken;
//   if (!refreshToken) {
//     res
//       .status(401)
//       .json({ valid: false, message: "No refresh token provided" });
//     return;
//   }
//   jwt.verify(
//     refreshToken,
//     process.env.JWT_REFRESH_SECRET as string,
//     (err: VerifyErrors | null, user: JwtPayload | string | undefined) => {
//       if (err || !user) {
//         res
//           .status(403)
//           .json({ valid: false, message: "Invalid refresh token" });
//         return;
//       }
//       // Create new access token
//       const newAccessToken = createAccessToken(user);
//       // Set new access token in cookie
//       res.cookie("accesstoken", newAccessToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 15 * 60 * 1000, // 15 minutes
//       });
//       req.user = user;
//       next();
//     }
//   );
// };
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
