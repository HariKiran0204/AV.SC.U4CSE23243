import { loggerService, LogPayload } from "../services/loggerService";
import { LogLevel, LogPackage, Stack } from "../types";

const ALLOWED_STACK: Stack[] = ["backend", "frontend"];
const ALLOWED_LEVEL: LogLevel[] = ["debug", "info", "warn", "error", "fatal"];
const ALLOWED_PACKAGE: string[] = [
  "cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service",
  "auth", "config", "middleware", "utils"
];

type LogInput = Omit<LogPayload, "package"> & { package: LogPackage };

export async function Log(stack: Stack, level: LogLevel, pkg: LogPackage, message: string, metadata?: Record<string, unknown>): Promise<void> {
  if (process.env.NODE_ENV === "test") {
    return;
  }
  if (!ALLOWED_STACK.includes(stack) || !ALLOWED_LEVEL.includes(level)) {
    return;
  }
  if (!ALLOWED_PACKAGE.includes(pkg)) {
    return;
  }
  const input: LogInput = { stack, level, package: pkg, message, metadata };
  await loggerService.send(input);
}
