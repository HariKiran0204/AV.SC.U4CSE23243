import { z } from "zod";

export const scheduleDepotSchema = z.object({
  params: z.object({
    depotId: z.string().min(1)
  })
});

export const vehicleQuerySchema = z.object({
  query: z.object({
    depotId: z.string().optional()
  })
});
