import { AnyZodObject, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";
import { fail } from "../utils/apiResponse";

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query
    });
    next();
  } catch (error) {
    const details = error instanceof ZodError ? error.issues : undefined;
    res.status(422).json({
      ...fail("Validation failed", req.requestId),
      details
    });
  }
};
