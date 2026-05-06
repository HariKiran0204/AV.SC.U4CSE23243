import { z } from "zod";

export const logSchema = z.object({
  body: z.object({
    stack: z.enum(["backend", "frontend"]),
    level: z.enum(["debug", "info", "warn", "error", "fatal"]),
    package: z.enum([
      "cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service",
      "api", "component", "hook", "page", "state", "style",
      "auth", "config", "middleware", "utils"
    ]),
    message: z.string().min(1),
    requestId: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
    timestamp: z.string().optional()
  })
});
