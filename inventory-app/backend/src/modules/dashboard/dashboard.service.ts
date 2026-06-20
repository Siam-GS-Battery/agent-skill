import * as repo from "./dashboard.repository.js";

export async function summary() {
  const [totalItemsCount, lowStock] = await Promise.all([repo.totalItems(), repo.lowStock()]);
  return { totalItems: totalItemsCount, lowStockCount: lowStock.length, lowStock };
}
