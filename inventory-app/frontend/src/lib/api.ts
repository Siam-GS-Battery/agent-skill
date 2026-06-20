// Thin fetch wrapper. Reads token from the auth module's storage key.
const TOKEN_KEY = "inv_token";
export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(public status: number, message: string, public errors?: { field: string; message: string }[]) {
    super(message);
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStore.get();
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) {
    throw new ApiError(res.status, body.message ?? "Request failed", body.errors);
  }
  return body.data as T;
}

export interface Item { id: number; sku: string; name: string; unit: string; reorder_level: number; quantity: number; }
export interface Movement { id: number; item_id: number; type: string; change: number; note: string | null; created_at: string; }
export interface ListResult<T> { data: T[]; pagination: { page: number; pageSize: number; total: number; totalPages: number }; }

// list endpoints return data + pagination at the top level, so call fetch directly here.
export async function apiList<T>(path: string): Promise<ListResult<T>> {
  const token = tokenStore.get();
  const res = await fetch(`/api${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) throw new ApiError(res.status, body.message ?? "Request failed");
  return { data: body.data, pagination: body.pagination };
}
