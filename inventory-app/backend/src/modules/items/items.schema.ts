import { z } from "zod";
export const createItemSchema = z.object({
  sku: z.string().min(1).max(60),
  name: z.string().min(1).max(160),
  unit: z.string().min(1).max(20).default("pcs"),
  reorder_level: z.number().int().min(0).default(0),
});
export const updateItemSchema = createItemSchema.partial();
export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
});
export const idParamSchema = z.object({ id: z.coerce.number().int().positive() });
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;
