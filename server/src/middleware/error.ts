import { Response } from "express";

const errorHandler = (res: Response, status: number, message: string) => {
  res.status(status).json({ message });
};
export default errorHandler;
