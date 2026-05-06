import { Depot, Vehicle } from "../types";

const depots: Depot[] = [
  { depotId: "d1", availableHours: 8 },
  { depotId: "d2", availableHours: 12 }
];

const vehicles: Vehicle[] = [
  {
    vehicleId: "v1",
    depotId: "d1",
    tasks: [
      { taskId: "t1", duration: 2, impactScore: 6 },
      { taskId: "t2", duration: 3, impactScore: 10 },
      { taskId: "t3", duration: 4, impactScore: 12 }
    ]
  },
  {
    vehicleId: "v2",
    depotId: "d1",
    tasks: [
      { taskId: "t4", duration: 2, impactScore: 7 },
      { taskId: "t5", duration: 5, impactScore: 14 }
    ]
  },
  {
    vehicleId: "v3",
    depotId: "d2",
    tasks: [
      { taskId: "t6", duration: 3, impactScore: 8 },
      { taskId: "t7", duration: 6, impactScore: 18 }
    ]
  }
];

export const repository = {
  getDepots: async (): Promise<Depot[]> => depots,
  getVehicles: async (depotId?: string): Promise<Vehicle[]> =>
    depotId ? vehicles.filter((v) => v.depotId === depotId) : vehicles,
  getDepotById: async (depotId: string): Promise<Depot | undefined> => depots.find((d) => d.depotId === depotId)
};
