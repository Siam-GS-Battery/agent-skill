import { useState, type FormEvent } from "react";
import { api, apiList, ApiError, type Movement, type Item } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Loading, Empty, ErrorState } from "../components/States";

export function Movements() {
  const items = useAsync(() => apiList<Item>("/items?pageSize=100"), []);
  const moves = useAsync(() => apiList<Movement>("/movements"), []);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ item_id: "", type: "in", quantity: "1", note: "" });
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/movements", {
        method: "POST",
        body: JSON.stringify({
          item_id: Number(form.item_id),
          type: form.type,
          quantity: Number(form.quantity),
          note: form.note || undefined,
        }),
      });
      setForm({ ...form, quantity: "1", note: "" });
      moves.reload();
      items.reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : (err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const itemName = (id: number) => items.data?.data.find((i) => i.id === id)?.sku ?? `#${id}`;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Stock movements</h1>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 rounded-xl border border-hairline bg-white p-6 sm:grid-cols-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-muted">Item</span>
          <select required value={form.item_id} onChange={(e) => setForm({ ...form, item_id: e.target.value })}
                  className="w-full rounded-lg border border-hairline bg-white px-3.5 py-2.5 text-sm focus:border-action">
            <option value="" disabled>Select…</option>
            {items.data?.data.map((i) => <option key={i.id} value={i.id}>{i.sku} — {i.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-muted">Type</span>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-lg border border-hairline bg-white px-3.5 py-2.5 text-sm focus:border-action">
            <option value="in">In</option><option value="out">Out</option><option value="adjust">Adjust</option>
          </select>
        </label>
        <Input label={form.type === "adjust" ? "Delta (±)" : "Quantity"} name="quantity" type="number"
               value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
        <Input label="Note (optional)" name="note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        {error && <p className="text-sm text-danger sm:col-span-4" role="alert">{error}</p>}
        <div className="sm:col-span-4"><Button type="submit" disabled={busy}>{busy ? "Recording…" : "Record movement"}</Button></div>
      </form>

      {moves.loading ? (
        <Loading />
      ) : moves.error ? (
        <ErrorState message={moves.error} onRetry={moves.reload} />
      ) : !moves.data || moves.data.data.length === 0 ? (
        <Empty title="No movements yet" hint="Record stock in or out above." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-hairline bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-hairline text-left text-xs text-ink-muted">
              <tr><th className="p-3">When</th><th className="p-3">Item</th><th className="p-3">Type</th><th className="p-3">Change</th><th className="p-3">Note</th></tr>
            </thead>
            <tbody>
              {moves.data.data.map((m) => (
                <tr key={m.id} className="border-b border-hairline last:border-0">
                  <td className="p-3 text-ink-muted">{new Date(m.created_at).toLocaleString()}</td>
                  <td className="p-3 font-mono text-xs">{itemName(m.item_id)}</td>
                  <td className="p-3 capitalize">{m.type}</td>
                  <td className={`p-3 font-semibold ${m.change < 0 ? "text-danger" : "text-ok"}`}>{m.change > 0 ? `+${m.change}` : m.change}</td>
                  <td className="p-3 text-ink-muted">{m.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
