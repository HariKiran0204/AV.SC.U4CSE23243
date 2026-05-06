import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { AppError } from "../utils/appError";

export interface UserRecord {
  email: string;
  name: string;
  password: string;
  role: "admin" | "scheduler";
}

const users = new Map<string, UserRecord>();
const refreshTokens = new Map<string, { email: string; expiresAt: number }>();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh-secret";
const ACCESS_EXPIRES_SEC = Number(process.env.JWT_ACCESS_EXPIRES_SEC || 900);
const REFRESH_EXPIRES_SEC = Number(process.env.JWT_REFRESH_EXPIRES_SEC || 604800);

export const authService = {
  register: (payload: UserRecord): void => {
    users.set(payload.email, payload);
  },

  login: (email: string, password: string): { accessToken: string; refreshToken: string; expiresIn: number } => {
    const user = users.get(email);
    if (!user || user.password !== password) {
      throw new AppError("Invalid credentials", 401);
    }

    const accessToken = jwt.sign({ email: user.email, role: user.role }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_SEC });
    const refreshToken = jwt.sign({ tokenId: uuid(), email: user.email }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_SEC });

    refreshTokens.set(refreshToken, {
      email: user.email,
      expiresAt: Date.now() + REFRESH_EXPIRES_SEC * 1000
    });

    return { accessToken, refreshToken, expiresIn: ACCESS_EXPIRES_SEC };
  },

  refresh: (refreshToken: string): { accessToken: string; expiresIn: number } => {
    const saved = refreshTokens.get(refreshToken);
    if (!saved || saved.expiresAt < Date.now()) {
      throw new AppError("Refresh token expired or invalid", 401);
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { email: string };
    const user = users.get(decoded.email);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const accessToken = jwt.sign({ email: user.email, role: user.role }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_SEC });
    return { accessToken, expiresIn: ACCESS_EXPIRES_SEC };
  },

  verifyAccessToken: (token: string): { email: string; role: "admin" | "scheduler" } => {
    return jwt.verify(token, ACCESS_SECRET) as { email: string; role: "admin" | "scheduler" };
  }
};
