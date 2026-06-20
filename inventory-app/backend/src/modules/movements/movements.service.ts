import { NotFoundError, ValidationError } from "../../errors.js";
import * as repo from "./movements.repository.js";
import type { CreateMovementInput, ListMovementQuery } from "./movements.schema.js";

// Pure: turn a typed quantity into a signed delta. Unit-tested directly.
export function signedChange(type: CreateMovementInput["type"], quantity: number): number {
  if (type === "out") return -Math.abs(quantity);
  if (type === "in") return Math.abs(quantity);
  return quantity; // adjust: caller-supplied signed delta
}

export async function create(input: CreateMovementInput, userId: number | null) {
  const current = await repo.currentQuantity(input.item_id);
  if (current === null) throw new NotFoundError("Item");
  const change = signedChange(input.type, input.quantity);
  if (current + change < 0)
    throw new ValidationError(`Insufficient stock: have ${current}, change ${change}`);
  return repo.insert(input.item_id, input.type, change, input.note ?? null, userId);
}

export const list = (q: ListMovementQuery) => repo.list(q);
