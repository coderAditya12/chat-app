import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import errorHandler from "./error.js";

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  // Add other properties you store in your JWT
  email?: string;
  
}
export interface CustomRequest extends Request {
  user?: CustomJwtPayload;
}
export const protectedRoute = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accesstoken;
    
    console.log("Token from cookies:", token);
    if (!token) {
     return  errorHandler(res, 401, "Unauthorized access. Please log in.");
       
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log("Decoded token:", decoded);
    if (!decoded) {
      return errorHandler(res, 401, "Invalid token. Please log in again.");
       
    }

    
    req.user = decoded as CustomJwtPayload
    console.log("User from token:", req.user);
    next()
  } catch (error) {
    console.log("Error in protectedRoute middleware:", error);
    next(error);
  }
};