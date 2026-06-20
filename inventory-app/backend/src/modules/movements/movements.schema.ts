import { z } from "zod";

export const createMovementSchema = z
  .object({
    item_id: z.number().int().positive(),
    type: z.enum(["in", "out", "adjust"]),
    quantity: z.number().int(),
    note: z.string().max(500).optional(),
  })
  .superRefine((v, ctx) => {
    if (v.type === "adjust") {
      if (v.quantity === 0)
        ctx.addIssue({ code: "custom", path: ["quantity"], message: "adjust delta cannot be 0" });
    } else if (v.quantity <= 0) {
      ctx.addIssue({ code: "custom", path: ["quantity"], message: `${v.type} quantity must be positive` });
    }
  });

export const listMovementQuerySchema = z.object({
  item_id: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type CreateMovementInput = z.infer<typeof createMovementSchema>;
export type ListMovementQuery = z.infer<typeof listMovementQuerySchema>;
