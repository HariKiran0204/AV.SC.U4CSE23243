import { Router } from "express";
import { validate } from "../middleware/validate";
import { logSchema } from "../validations/logValidation";
import { fail, ok } from "../utils/apiResponse";

const router = Router();

router.post("/logs", validate(logSchema), (req, res) => {
  const token = req.headers.authorization;
  if (!token?.startsWith("Bearer ")) {
    res.status(401).json(fail("Unauthorized", req.requestId));
    return;
  }
  res.status(202).json(ok("Log accepted", { accepted: true, payload: req.body }, req.requestId));
});

export default router;
