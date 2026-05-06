import axios from "axios";
import { evaluationAuthService } from "./evaluationAuthService";

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown;
  for (let i = 1; i <= attempts; i += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < attempts) {
        await sleep(100 * 2 ** (i - 1));
      }
    }
  }
  throw lastError;
}

export const externalApiService = {
  getDepots: async () =>
    withRetry(async () => {
      const token = await evaluationAuthService.getAccessToken();
      const response = await axios.get(`${process.env.BASE_URL}/depots`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });
      return (response.data?.depots || []).map((d: { ID: number; MechanicHours: number }) => ({
        depotId: String(d.ID),
        availableHours: d.MechanicHours
      }));
    }),
  getDepotById: async (depotId: string) => {
    const depots = await externalApiService.getDepots();
    return depots.find((d: { depotId: string }) => d.depotId === depotId);
  },
  getVehicles: async (depotId?: string) =>
    withRetry(async () => {
      const token = await evaluationAuthService.getAccessToken();
      const response = await axios.get(`${process.env.BASE_URL}/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });
      const raw = response.data?.vehicles || [];
      const mapped = raw.map((t: { TaskID: string; Duration: number; Impact: number }, idx: number) => ({
        vehicleId: `v-${idx + 1}`,
        depotId: depotId || "all",
        tasks: [{ taskId: t.TaskID, duration: t.Duration, impactScore: t.Impact }]
      }));
      return mapped;
    })
};
