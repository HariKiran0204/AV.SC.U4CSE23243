import { Router } from "express";
import { schedulerController } from "../controllers/schedulerController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { scheduleDepotSchema, vehicleQuerySchema } from "../validations/schedulerValidation";

const router = Router();
router.use(authMiddleware());
router.get("/depots", schedulerController.getDepots);
router.get("/vehicles", validate(vehicleQuerySchema), schedulerController.getVehicles);
router.post("/depots/:depotId/schedule", validate(scheduleDepotSchema), schedulerController.scheduleDepot);

export default router;
