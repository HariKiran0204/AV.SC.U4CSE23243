import { Request, Response } from "express";
import { authService } from "../services/authService";
import { ok } from "../utils/apiResponse";
import { AppError } from "../utils/appError";
import { Log } from "../utils/logger";

export const authController = {
  register: async (req: Request, res: Response) => {
    const { email, name, password, role } = req.body;
    authService.register({ email, name, password, role: role || "scheduler" });
    void Log("backend", "info", "auth", "User registered", { requestId: req.requestId, email, role: role || "scheduler" });
    res.status(201).json(ok("Registered", { email, role: role || "scheduler" }, req.requestId));
  },
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const tokens = authService.login(email, password);
    res.status(200).json(ok("Authenticated", { ...tokens, tokenType: "Bearer" }, req.requestId));
  },
  refresh: async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const data = authService.refresh(refreshToken);
    res.status(200).json(ok("Token refreshed", data, req.requestId));
  },
  validateToken: (token: string): boolean => {
    try {
      authService.verifyAccessToken(token);
      return true;
    } catch {
      throw new AppError("Invalid token", 401);
    }
  }
};
