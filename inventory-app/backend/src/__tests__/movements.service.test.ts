import { describe, it, expect, vi, beforeEach } from "vitest";
import * as repo from "../modules/movements/movements.repository.js";
import { signedChange, create } from "../modules/movements/movements.service.js";

vi.mock("../modules/movements/movements.repository.js");

describe("signedChange", () => {
  it("in is positive, out is negative, adjust passes through", () => {
    expect(signedChange("in", 10)).toBe(10);
    expect(signedChange("out", 10)).toBe(-10);
    expect(signedChange("adjust", -3)).toBe(-3);
  });
});

describe("movement create", () => {
  beforeEach(() => vi.resetAllMocks());

  it("AC1: 'in' raises quantity and inserts a +delta", async () => {
    vi.mocked(repo.currentQuantity).mockResolvedValue(0);
    vi.mocked(repo.insert).mockResolvedValue({ id: 1 } as never);
    await create({ item_id: 1, type: "in", quantity: 10 }, 1);
    expect(repo.insert).toHaveBeenCalledWith(1, "in", 10, null, 1);
  });

  it("AC2: 'out' below zero is rejected with 400", async () => {
    vi.mocked(repo.currentQuantity).mockResolvedValue(5);
    await expect(create({ item_id: 1, type: "out", quantity: 10 }, 1)).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it("AC3: movement on missing item is 404", async () => {
    vi.mocked(repo.currentQuantity).mockResolvedValue(null);
    await expect(create({ item_id: 99, type: "in", quantity: 1 }, 1)).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
