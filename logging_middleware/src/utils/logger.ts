import axios from "axios";

export type Stack = "backend" | "frontend";
export type Level = "debug" | "info" | "warn" | "error" | "fatal";
export type Pkg =
  | "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service"
  | "api" | "component" | "hook" | "page" | "state" | "style"
  | "auth" | "config" | "middleware" | "utils";

export interface LogInput {
  stack: Stack;
  level: Level;
  package: Pkg;
  message: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export async function Log(input: LogInput): Promise<void> {
  const payload = { ...input, timestamp: input.timestamp || new Date().toISOString() };
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await axios.post(process.env.LOG_API_URL || "http://localhost:4000/api/v1/logs", payload, {
        headers: { Authorization: `Bearer ${process.env.API_AUTH_TOKEN || "local-dev-token"}` },
        timeout: 1000
      });
      return;
    } catch {
      if (attempt === 3) {
        console.log(JSON.stringify({ ...payload, fallback: true }));
        return;
      }
      await sleep(100 * 2 ** (attempt - 1));
    }
  }
}
