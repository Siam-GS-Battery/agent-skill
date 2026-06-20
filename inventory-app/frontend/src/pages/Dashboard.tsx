import { api, type Item } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import { Loading, Empty, ErrorState } from "../components/States";

interface Summary { totalItems: number; lowStockCount: number; lowStock: Item[]; }

export function Dashboard() {
  const { data, error, loading, reload } = useAsync<Summary>(() => api("/dashboard"));

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Stat label="Total items" value={data.totalItems} />
        <Stat label="Low stock" value={data.lowStockCount} warn={data.lowStockCount > 0} />
      </div>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Low-stock items</h2>
        {data.lowStock.length === 0 ? (
          <Empty title="All stocked up" hint="No items at or below their reorder level." />
        ) : (
          <div className="overflow-hidden rounded-xl border border-hairline bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-hairline text-left text-xs text-ink-muted">
                <tr><th className="p-3">SKU</th><th className="p-3">Name</th><th className="p-3">Qty</th><th className="p-3">Reorder ≤</th></tr>
              </thead>
              <tbody>
                {data.lowStock.map((i) => (
                  <tr key={i.id} className="border-b border-hairline last:border-0">
                    <td className="p-3 font-mono text-xs">{i.sku}</td>
                    <td className="p-3">{i.name}</td>
                    <td className="p-3 font-semibold text-danger">{i.quantity}</td>
                    <td className="p-3 text-ink-muted">{i.reorder_level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className="rounded-xl border border-hairline bg-white p-6">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${warn ? "text-warn" : "text-ink"}`}>{value}</p>
    </div>
  );
}
