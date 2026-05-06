import axios, { AxiosError } from "axios";
import { evaluationAuthService } from "./evaluationAuthService";

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const client = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 1200
});

client.interceptors.request.use(async (config) => {
  const token = await evaluationAuthService.getAccessToken();
  config.headers = config.headers || {};
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await evaluationAuthService.getAccessToken();
    }
    return Promise.reject(error);
  }
);

export interface LogPayload {
  stack: "backend" | "frontend";
  level: "debug" | "info" | "warn" | "error" | "fatal";
  package: string;
  message: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

export const loggerService = {
  async send(payload: LogPayload): Promise<void> {
    const body = {
      ...payload,
      timestamp: payload.timestamp || new Date().toISOString()
    };

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        await client.post("/logs", body);
        return;
      } catch (error) {
        if (attempt === 3) {
          console.log(JSON.stringify({
            ...body,
            fallback: true,
            error: error instanceof Error ? error.message : "Unknown logging error"
          }));
          return;
        }
        await sleep(100 * 2 ** (attempt - 1));
      }
    }
  }
};
