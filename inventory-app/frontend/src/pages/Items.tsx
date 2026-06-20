import { useState, type FormEvent } from "react";
import { api, apiList, ApiError, type Item } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useAsync } from "../lib/useAsync";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Loading, Empty, ErrorState } from "../components/States";

export function Items() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { data, error, loading, reload } = useAsync(
    () => apiList<Item>(`/items?search=${encodeURIComponent(search)}`),
    [search]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Items</h1>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Close" : "Add item"}</Button>
      </div>

      {showForm && <ItemForm onSaved={() => { setShowForm(false); reload(); }} />}

      <input
        aria-label="Search items"
        placeholder="Search by name or SKU…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm rounded-full border border-hairline bg-white px-5 py-2.5 text-sm focus:border-action"
      />

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data || data.data.length === 0 ? (
        <Empty title="No items" hint="Add your first item to start tracking stock." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-hairline bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-hairline text-left text-xs text-ink-muted">
              <tr><th className="p-3">SKU</th><th className="p-3">Name</th><th className="p-3">Unit</th><th className="p-3">Qty</th><th className="p-3">Reorder ≤</th>{user?.role === "admin" && <th className="p-3"></th>}</tr>
            </thead>
            <tbody>
              {data.data.map((i) => (
                <tr key={i.id} className="border-b border-hairline last:border-0">
                  <td className="p-3 font-mono text-xs">{i.sku}</td>
                  <td className="p-3">{i.name}</td>
                  <td className="p-3 text-ink-muted">{i.unit}</td>
                  <td className={`p-3 font-semibold ${i.quantity <= i.reorder_level ? "text-danger" : ""}`}>{i.quantity}</td>
                  <td className="p-3 text-ink-muted">{i.reorder_level}</td>
                  {user?.role === "admin" && (
                    <td className="p-3 text-right">
                      <button
                        onClick={async () => { await api(`/items/${i.id}`, { method: "DELETE" }); reload(); }}
                        className="text-xs font-semibold text-danger active:scale-95"
                      >Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ItemForm({ onSaved }: { onSaved: () => void }) {
  const [form, setForm] = useState({ sku: "", name: "", unit: "pcs", reorder_level: "0" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    try {
      await api("/items", {
        method: "POST",
        body: JSON.stringify({ ...form, reorder_level: Number(form.reorder_level) }),
      });
      onSaved();
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setErrors(Object.fromEntries(err.errors.map((e) => [e.field, e.message])));
      } else {
        setErrors({ _: (err as Error).message });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 rounded-xl border border-hairline bg-white p-6 sm:grid-cols-2">
      <Input label="SKU" name="sku" value={form.sku} onChange={set("sku")} error={errors.sku} required />
      <Input label="Name" name="name" value={form.name} onChange={set("name")} error={errors.name} required />
      <Input label="Unit" name="unit" value={form.unit} onChange={set("unit")} error={errors.unit} />
      <Input label="Reorder level" name="reorder_level" type="number" min={0} value={form.reorder_level} onChange={set("reorder_level")} error={errors.reorder_level} />
      {errors._ && <p className="text-sm text-danger sm:col-span-2" role="alert">{errors._}</p>}
      <div className="sm:col-span-2">
        <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save item"}</Button>
      </div>
    </form>
  );
}
