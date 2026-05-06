import { NextFunction, Request, Response } from "express";

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const started = Date.now();
  res.on("finish", () => {
    const payload = {
      requestId: req.requestId,
      timestamp: new Date().toISOString(),
      level: res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info",
      stack: "backend",
      package: "middleware",
      message: `${req.method} ${req.originalUrl}`,
      metadata: {
        statusCode: res.statusCode,
        responseTimeMs: Date.now() - started
      }
    };
    console.log(JSON.stringify(payload));
  });
  next();
};
