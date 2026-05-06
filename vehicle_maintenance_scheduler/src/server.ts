import { app } from "./app";
import { env } from "./config/env";

const server = app.listen(env.port, () => {
  console.log(`vehicle_maintenance_scheduler running on port ${env.port}`);
});

const shutdown = (signal: string): void => {
  console.log(`${signal} received. Starting graceful shutdown...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
