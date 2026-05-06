import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import { requestContext } from "./middleware/requestContext";
import { requestLogger } from "./middleware/requestLogger";
import { validate } from "./middleware/validate";
import { logSchema } from "./validations/logValidation";

export const app = express();
app.use(express.json());
app.use(requestContext);
app.use(requestLogger);

app.post("/api/v1/logs", validate(logSchema), (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Unauthorized", data: null, requestId: req.requestId });
    return;
  }
  res.status(202).json({ success: true, message: "Log accepted", data: req.body, requestId: req.requestId });
});
app.use(errorHandler);
