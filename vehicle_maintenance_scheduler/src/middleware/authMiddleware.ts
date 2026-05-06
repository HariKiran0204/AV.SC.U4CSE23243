import { NextFunction, Request, Response } from "express";
import { fail } from "../utils/apiResponse";

export const authMiddleware = () =>
  (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json(fail("Missing token", req.requestId));
      return;
    }
    next();
};
