import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export interface CustomRequest extends Request {
  user?: JwtPayload | string;
}

// Utility to create access token
const createAccessToken = (user: any): string => {
  return jwt.sign(user, process.env.JWT_SECRET as string);
};

// Utility to create refresh token
const createRefreshToken = (user: object): string => {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET as string);
};

// Middleware to verify access token and refresh if needed
export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.accesstoken;

  if (!token) {
    renewToken(req, res, next);
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: VerifyErrors | null, user: JwtPayload | string | undefined) => {
      if (err) {
        renewToken(req, res, next);
        return;
      }

      if (user) {
        req.user = user;
      }
      next();
    }
  );
};

// Function to renew access token using refresh token
const renewToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const refreshToken = req.cookies.refreshtoken;

  if (!refreshToken) {
    res
      .status(401)
      .json({ valid: false, message: "No refresh token provided" });
    return;
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET as string,
    (err: VerifyErrors | null, user: JwtPayload | string | undefined) => {
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
    }
  );
};
