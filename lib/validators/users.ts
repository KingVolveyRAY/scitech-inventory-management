import { z } from "zod";

export const roleUpdateSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["admin", "client"])
});

export const activeUserSchema = z.object({
  userId: z.string().min(1),
  isActive: z.boolean()
});
