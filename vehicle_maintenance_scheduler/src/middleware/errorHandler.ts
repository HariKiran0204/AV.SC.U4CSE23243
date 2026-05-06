import { NextFunction, Request, Response } from "express";
import { Log } from "../utils/logger";
import { fail } from "../utils/apiResponse";
import { AppError } from "../utils/appError";
import { metricsStore } from "../utils/metrics";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  metricsStore.incError();
  void Log("backend", "error", "handler", err.message, {
    requestId: _req.requestId,
    ...(err instanceof AppError ? { details: err.details } : {}),
    statusCode
  });
  res.status(statusCode).json(fail(err.message || "Internal server error", _req.requestId));
};
