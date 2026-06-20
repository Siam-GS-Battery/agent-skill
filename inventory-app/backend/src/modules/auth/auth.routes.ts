import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { loginSchema } from "./auth.schema.js";
import * as controller from "./auth.controller.js";

export const authRouter = Router();
authRouter.post("/login", validate({ body: loginSchema }), asyncHandler(controller.login));
