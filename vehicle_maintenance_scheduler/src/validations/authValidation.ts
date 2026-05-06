import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().min(2),
    password: z.string().min(6),
    role: z.enum(["admin", "scheduler"]).default("scheduler")
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10)
  })
});
