import { ConflictError, NotFoundError } from "../../errors.js";
import * as repo from "./items.repository.js";
import type { CreateItemInput, UpdateItemInput, ListQuery } from "./items.schema.js";

export const list = (q: ListQuery) => repo.list(q);

export async function getById(id: number) {
  const item = await repo.findById(id);
  if (!item) throw new NotFoundError("Item");
  return item;
}

export async function create(input: CreateItemInput) {
  if (await repo.findBySku(input.sku)) throw new ConflictError("SKU already exists");
  return repo.create(input as Required<CreateItemInput>);
}

export async function update(id: number, input: UpdateItemInput) {
  await getById(id);
  if (input.sku) {
    const existing = await repo.findBySku(input.sku);
    if (existing && existing.id !== id) throw new ConflictError("SKU already exists");
  }
  await repo.update(id, input);
  return getById(id);
}

export async function remove(id: number) {
  await getById(id);
  await repo.remove(id);
}
