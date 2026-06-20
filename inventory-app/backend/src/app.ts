import express from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/auth.routes.js";
import { itemsRouter } from "./modules/items/items.routes.js";
import { movementsRouter } from "./modules/movements/movements.routes.js";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

// App is built here (no listen) so tests can import it with supertest.
export function buildApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));
  app.use("/api/auth", authRouter);
  app.use("/api/items", itemsRouter);
  app.use("/api/movements", movementsRouter);
  app.use("/api/dashboard", dashboardRouter);

  app.use((_req, res) => res.status(404).json({ success: false, message: "Not found" }));
  app.use(errorHandler);
  return app;
}
