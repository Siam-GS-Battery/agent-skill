import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { authenticate } from "../../middleware/auth.js";
import * as c from "./movements.controller.js";
import { createMovementSchema, listMovementQuerySchema } from "./movements.schema.js";

export const movementsRouter = Router();
movementsRouter.use(authenticate);
movementsRouter.get("/", validate({ query: listMovementQuerySchema }), asyncHandler(c.list));
movementsRouter.post("/", validate({ body: createMovementSchema }), asyncHandler(c.create));
