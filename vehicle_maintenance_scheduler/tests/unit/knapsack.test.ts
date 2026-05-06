import { solveKnapsack, optimizeScheduleSpaceEfficient } from "../../src/algorithms/knapsack";

describe("knapsack", () => {
  it("selects optimal tasks", () => {
    const tasks = [
      { taskId: "t1", duration: 2, impactScore: 6 },
      { taskId: "t2", duration: 3, impactScore: 10 },
      { taskId: "t3", duration: 4, impactScore: 12 }
    ];
    const result = solveKnapsack(tasks, 5);
    expect(result.totalImpactScore).toBe(16);
    expect(result.totalHoursUsed).toBe(5);
  });

  it("1D DP returns same best score", () => {
    const tasks = [
      { taskId: "t1", duration: 2, impactScore: 6 },
      { taskId: "t2", duration: 3, impactScore: 10 },
      { taskId: "t3", duration: 4, impactScore: 12 }
    ];
    expect(optimizeScheduleSpaceEfficient(tasks, 5)).toBe(16);
  });
});
