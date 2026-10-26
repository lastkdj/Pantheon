import { notFound } from "next/navigation";
import { getLoaded } from "@/lib/cached";

export const metadata = { title: "Costs" };

const usd = (n: number | null) => (n === null ? "n/a" : `$${n.toFixed(2)}`);

export default async function CostsPage({ params }: { params: Promise<{ project: string }> }) {
  const { project } = await params;
  const loaded = await getLoaded(project);
  if (!loaded) notFound();
  const { totals, perTask } = loaded.state.usage;
  const taskTotal = perTask.reduce((sum, r) => sum + (r.usd ?? 0), 0);
  const tokenTotal = perTask.reduce((sum, r) => sum + (r.tokens ?? 0), 0);
  const maxTask = Math.max(...perTask.map((r) => r.usd ?? 0), 0.0001);
  const maxTotal = Math.max(...totals.map((t) => t.usd ?? 0), 0.0001);

  return (
    <div className="space-y-12">
      <section aria-labelledby="per-task">
        <h1 id="per-task" className="text-3xl">Costs</h1>
        {perTask.length > 0 && (
          <p className="mb-6 mt-2 text-stone">
            <span className="text-2xl font-semibold text-marble">{usd(taskTotal)}</span> across {perTask.length} task sessions,{" "}
            {tokenTotal.toLocaleString("en-US")} tokens
          </p>
        )}
        {perTask.length === 0 ? (
          <div className="panel mt-5 p-6">
            <p className="text-marble">No per-task costs yet.</p>
            <p className="mt-1 max-w-xl text-sm text-stone">
              Add a table with the columns <code className="text-bronze-hi">Task | Session | Model | Tokens | USD | Date</code> to the
              usage file, one row per task session, and the breakdown appears here.
            </p>
          </div>
        ) : (
          <div className="panel overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="border-b border-line text-ash">
                <tr>
                  {["Task", "Session", "Model", "Tokens", "Cost"].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {perTask.map((r, i) => (
                  <tr key={i}>
                    <td className="whitespace-nowrap px-4 py-2.5 font-semibold text-bronze">{r.task}</td>
                    <td className="px-4 py-2.5 text-marble">{r.session}</td>
                    <td className="px-4 py-2.5">{r.model}</td>
                    <td className="px-4 py-2.5">{r.tokens === null ? "n/a" : r.tokens.toLocaleString("en-US")}</td>
                    <td className="w-48 px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <span className="w-14 text-marble">{usd(r.usd)}</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-3" aria-hidden="true">
                          <span className="block h-full rounded-full bg-bronze" style={{ width: `${((r.usd ?? 0) / maxTask) * 100}%` }} />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {totals.length > 0 && (
        <section aria-labelledby="totals">
          <h2 id="totals" className="mb-4 text-xl">Measured totals</h2>
          <ul className="ledger panel">
            {totals.map((t, i) => {
              const part = /^of which/i.test(t.label);
              return (
                <li key={i} className={`px-5 py-3.5 ${part ? "bg-ink/40" : ""}`}>
                  <div className={`flex flex-wrap items-baseline gap-x-4 gap-y-1 ${part ? "pl-5" : ""}`}>
                    <span className={part ? "text-stone" : "text-marble"}>{t.label}</span>
                    <span className="ml-auto font-semibold text-bronze-hi">{t.costText}</span>
                  </div>
                  {t.usd !== null && (
                    <div className={`mt-2 h-1 overflow-hidden rounded-full bg-ink-3 ${part ? "ml-5" : ""}`} aria-hidden="true">
                      <div className={`h-full rounded-full ${part ? "bg-stone/60" : "bg-bronze"}`} style={{ width: `${(t.usd / maxTotal) * 100}%` }} />
                    </div>
                  )}
                  {t.notes && <p className={`mt-2 text-xs text-ash ${part ? "pl-5" : ""}`}>{t.notes}</p>}
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-ash">Rows that start with &quot;of which&quot; are parts of the row above. Do not add them up.</p>
        </section>
      )}
    </div>
  );
}
