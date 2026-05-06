import cors from "cors";
import express from "express";
import schedulerRoutes from "./routes/schedulerRoutes";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import { requestContext } from "./middleware/requestContext";
import { metricsStore } from "./utils/metrics";
import { fail, ok } from "./utils/apiResponse";

export const app = express();
app.use(cors());
app.use(express.json());
app.use(requestContext);
app.use(requestLogger);

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.get("/health/detailed", (req, res) => {
  res.status(200).json(ok("Detailed health", { status: "ok", ...metricsStore.snapshot() }, req.requestId));
});
app.get("/metrics", (req, res) => {
  res.status(200).json(ok("Metrics", metricsStore.snapshot(), req.requestId));
});
app.use("/api/v1", schedulerRoutes);
app.use((_req, res) => {
  res.status(404).json(fail("Route not found", _req.requestId));
});
app.use(errorHandler);
