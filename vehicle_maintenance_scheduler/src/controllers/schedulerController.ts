import { Request, Response } from "express";
import { schedulerService } from "../services/schedulerService";
import { Vehicle } from "../types";
import { Log } from "../utils/logger";

export const schedulerController = {
  getDepots: async (req: Request, res: Response) => {
    const depots = await schedulerService.getDepots();
    void Log("backend", "info", "controller", "Fetched depots", { requestId: req.requestId });
    res.status(200).json({ depots });
  },
  getVehicles: async (req: Request, res: Response) => {
    const depotId = req.query.depotId as string | undefined;
    const vehicles = await schedulerService.getVehicles(depotId);
    res.status(200).json({
      vehicles: (vehicles as Vehicle[])
        .flatMap((v) => v.tasks)
        .map((t) => ({ TaskID: t.taskId, Duration: t.duration, Impact: t.impactScore }))
    });
  },
  scheduleDepot: async (req: Request, res: Response) => {
    const { depotId } = req.params;
    const output = await schedulerService.scheduleDepotTasks(depotId, req.requestId);
    res.status(200).json(output);
  }
};
