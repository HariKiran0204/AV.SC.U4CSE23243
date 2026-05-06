import { KnapsackResult, MaintenanceTask } from "../types";

export function solveKnapsack(tasks: MaintenanceTask[], capacity: number): KnapsackResult {
  const n = tasks.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i += 1) {
    const { duration, impactScore } = tasks[i - 1];
    for (let h = 0; h <= capacity; h += 1) {
      dp[i][h] = dp[i - 1][h];
      if (duration <= h) {
        dp[i][h] = Math.max(dp[i][h], dp[i - 1][h - duration] + impactScore);
      }
    }
  }

  const selectedTasks: MaintenanceTask[] = [];
  let h = capacity;
  for (let i = n; i >= 1; i -= 1) {
    if (dp[i][h] !== dp[i - 1][h]) {
      selectedTasks.push(tasks[i - 1]);
      h -= tasks[i - 1].duration;
    }
  }

  const totalHoursUsed = selectedTasks.reduce((sum, t) => sum + t.duration, 0);
  return {
    selectedTasks: selectedTasks.reverse(),
    totalHoursUsed,
    totalImpactScore: dp[n][capacity]
  };
}

export function optimizeScheduleSpaceEfficient(tasks: MaintenanceTask[], capacity: number): number {
  const dp = Array(capacity + 1).fill(0);

  for (const task of tasks) {
    for (let h = capacity; h >= task.duration; h -= 1) {
      dp[h] = Math.max(dp[h], dp[h - task.duration] + task.impactScore);
    }
  }

  return dp[capacity];
}
