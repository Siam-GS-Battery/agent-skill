import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ok } from "../../response.js";
import * as service from "./dashboard.service.js";

export const dashboardRouter = Router();
dashboardRouter.get("/", authenticate, asyncHandler(async (_req, res) => ok(res, await service.summary())));
