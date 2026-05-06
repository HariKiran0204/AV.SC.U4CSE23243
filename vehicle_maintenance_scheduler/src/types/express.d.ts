import "express";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: {
        email: string;
        role: "admin" | "scheduler";
      };
    }
  }
}

export {};
