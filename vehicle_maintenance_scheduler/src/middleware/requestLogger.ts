import { NextFunction, Request, Response } from "express";
import { Log } from "../utils/logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const started = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - started;
    const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
    void Log("backend", level, "middleware", `${req.method} ${req.originalUrl}`, {
      requestId: req.requestId,
      statusCode: res.statusCode,
      responseTimeMs: ms
    });
  });
  next();
};
