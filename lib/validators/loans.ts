import { z } from "zod";

export const loanRequestSchema = z.object({
  item_id: z.string().min(1),
  quantity: z.coerce.number().int().min(1),
  purpose: z.string().min(5).max(500),
  borrow_date: z.string().min(1),
  return_date: z.string().min(1)
}).refine((value) => new Date(value.borrow_date).getTime() <= new Date(value.return_date).getTime(), {
  path: ["return_date"],
  message: "Tanggal kembali harus setelah atau sama dengan tanggal pinjam."
});

export const loanDecisionSchema = z.object({
  loanId: z.string().min(1),
  admin_note: z.string().max(1000).optional().or(z.literal("")),
  admin_image_id: z.string().optional()
});

export const returnLoanSchema = z.object({
  loanId: z.string().min(1),
  admin_note: z.string().max(1000).optional().or(z.literal("")),
  actual_return_date: z.string().min(1)
});

export const requestReturnSchema = z.object({
  loanId: z.string().min(1),
  return_image_id: z.string().min(1, "Foto bukti pengembalian wajib diunggah."),
  user_note: z.string().max(1000).optional().or(z.literal(""))
});
