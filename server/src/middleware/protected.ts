import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import errorHandler from "./error.js";

export interface CustomRequest extends Request {
  user?: JwtPayload | string;
}
export const protectedRoute = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.refreshtoken;
    if (!token) {
      return errorHandler(res, 401, "Unauthorized access. Please log in.");
    }
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
    console.log("Decoded token:", decoded);
    if (!decoded) {
      return errorHandler(res, 401, "Invalid token. Please log in again.");
    }

    
    req.user = decoded;
    next()
  } catch (error) {
    next(error);
  }
};