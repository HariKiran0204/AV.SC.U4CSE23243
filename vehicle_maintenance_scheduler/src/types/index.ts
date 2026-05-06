export type Stack = "backend" | "frontend";
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export type LogPackage =
  | "cache"
  | "controller"
  | "cron_job"
  | "db"
  | "domain"
  | "handler"
  | "repository"
  | "route"
  | "service"
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style"
  | "auth"
  | "config"
  | "middleware"
  | "utils";

export interface MaintenanceTask {
  taskId: string;
  duration: number;
  impactScore: number;
}

export interface Depot {
  depotId: string;
  availableHours: number;
}

export interface Vehicle {
  vehicleId: string;
  depotId: string;
  tasks: MaintenanceTask[];
}

export interface KnapsackResult {
  selectedTasks: MaintenanceTask[];
  totalHoursUsed: number;
  totalImpactScore: number;
}

export interface SchedulerMetrics {
  totalTasks: number;
  selectedTasksCount: number;
  optimizationTimeMs: number;
  dpRows: number;
  dpCols: number;
}
