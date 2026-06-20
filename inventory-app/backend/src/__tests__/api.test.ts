import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import request from "supertest";
import { buildApp } from "../app.js";
import * as authRepo from "../modules/auth/auth.repository.js";
import * as itemsRepo from "../modules/items/items.repository.js";

vi.mock("../modules/auth/auth.repository.js");
vi.mock("../modules/items/items.repository.js");

const app = buildApp();
const pwHash = bcrypt.hashSync("secret", 10);

async function token() {
  vi.mocked(authRepo.findByEmail).mockResolvedValue({
    id: 1, email: "a@b.co", password_hash: pwHash, name: "A", role: "admin", is_active: true,
  });
  const res = await request(app).post("/api/auth/login").send({ email: "a@b.co", password: "secret" });
  return res.body.data.token as string;
}

describe("API integration", () => {
  beforeEach(() => vi.resetAllMocks());

  it("health returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: { status: "ok" } });
  });

  it("login with bad body -> 400 with errors[]", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "nope" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it("login ok -> token + user without hash", async () => {
    const t = await token();
    expect(typeof t).toBe("string");
  });

  it("items list without token -> 401", async () => {
    const res = await request(app).get("/api/items");
    expect(res.status).toBe(401);
  });

  it("items list with token -> standard list shape", async () => {
    const t = await token();
    vi.mocked(itemsRepo.list).mockResolvedValue({ rows: [], total: 0 });
    const res = await request(app).get("/api/items").set("Authorization", `Bearer ${t}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, data: [], pagination: { page: 1, totalPages: 1 } });
  });

  it("create item with duplicate sku -> 409", async () => {
    const t = await token();
    vi.mocked(itemsRepo.findBySku).mockResolvedValue({ id: 7 });
    const res = await request(app)
      .post("/api/items")
      .set("Authorization", `Bearer ${t}`)
      .send({ sku: "DUP", name: "x" });
    expect(res.status).toBe(409);
  });
});
