import { z } from "zod";

export const logSchema = z.object({
  body: z.object({
    stack: z.enum(["backend", "frontend"]),
    level: z.enum(["debug", "info", "warn", "error", "fatal"]),
    package: z.enum(["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service", "auth", "config", "middleware", "utils"]),
    message: z.string().min(1)
  })
});
