import { NextFunction, Request, Response } from "express";

export const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction): void => {
  res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
    data: null,
    requestId: req.requestId
  });
};
