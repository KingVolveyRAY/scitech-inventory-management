import { z } from "zod";

export const itemSchema = z.object({
  name: z.string().min(1).max(160),
  description: z.string().max(2000).optional().or(z.literal("")),
  category: z.string().min(1),
  quantity_total: z.coerce.number().int().min(0),
  quantity_available: z.coerce.number().int().min(0),
  is_available: z.boolean().default(true),
  image_id: z.string().optional()
}).refine((value) => value.quantity_available <= value.quantity_total, {
  path: ["quantity_available"],
  message: "Stok tersedia tidak boleh melebihi stok total."
});
