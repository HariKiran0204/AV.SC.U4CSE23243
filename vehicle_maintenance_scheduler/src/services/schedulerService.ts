import { solveKnapsack } from "../algorithms/knapsack";
import { Vehicle } from "../types";
import { AppError } from "../utils/appError";
import { Log } from "../utils/logger";
import { externalApiService } from "./externalApiService";

function validateTasks(depotId: string, tasks: Array<{ taskId: string; duration: number; impactScore: number }>): void {
  for (const task of tasks) {
    if (!task.taskId || task.duration <= 0 || task.impactScore <= 0) {
      throw new AppError(`Invalid task in depot ${depotId}`, 422, { task });
    }
  }
}

export const schedulerService = {
  getDepots: () => externalApiService.getDepots(),
  getVehicles: (depotId?: string) => externalApiService.getVehicles(depotId),
  scheduleDepotTasks: async (depotId: string, requestId?: string) => {
    const depot = await externalApiService.getDepotById(depotId);
    if (!depot) {
      throw new AppError("Depot not found", 404, { depotId });
    }
    const vehicles = await externalApiService.getVehicles(depotId) as Vehicle[];
    const tasks = vehicles.flatMap((v: Vehicle) => v.tasks);
    validateTasks(depotId, tasks);

    const result = solveKnapsack(tasks, depot.availableHours);
    await Log("backend", "info", "service", "Scheduling optimization completed", {
      requestId,
      totalTasks: tasks.length,
      selectedTasksCount: result.selectedTasks.length
    });

    return {
      depotId: depot.depotId,
      availableHours: depot.availableHours,
      ...result
    };
  }
};
