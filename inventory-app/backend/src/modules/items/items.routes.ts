import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { authenticate, authorize } from "../../middleware/auth.js";
import * as c from "./items.controller.js";
import { createItemSchema, updateItemSchema, listQuerySchema, idParamSchema } from "./items.schema.js";

export const itemsRouter = Router();
itemsRouter.use(authenticate);
itemsRouter.get("/", validate({ query: listQuerySchema }), asyncHandler(c.list));
itemsRouter.get("/:id", validate({ params: idParamSchema }), asyncHandler(c.getById));
itemsRouter.post("/", validate({ body: createItemSchema }), asyncHandler(c.create));
itemsRouter.put("/:id", validate({ params: idParamSchema, body: updateItemSchema }), asyncHandler(c.update));
itemsRouter.delete("/:id", authorize("admin"), validate({ params: idParamSchema }), asyncHandler(c.remove));
