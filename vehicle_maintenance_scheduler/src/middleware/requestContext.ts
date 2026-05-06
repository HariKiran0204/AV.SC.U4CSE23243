import { NextFunction, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { metricsStore } from "../utils/metrics";

export const requestContext = (req: Request, res: Response, next: NextFunction): void => {
  req.requestId = req.headers["x-request-id"]?.toString() || uuid();
  res.setHeader("x-request-id", req.requestId);
  metricsStore.incRequest();
  next();
};
