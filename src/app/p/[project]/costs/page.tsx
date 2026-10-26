import { notFound } from "next/navigation";
import { getLoaded } from "@/lib/cached";

const usd = (n: number | null) => (n === null ? "n/a" : `$${n.toFixed(2)}`);

export default async function CostsPage({ params }: { params: Promise<{ project: string }> }) {
  const { project } = await params;
  const loaded = await getLoaded(project);
  if (!loaded) notFound();
  const { totals, perTask } = loaded.state.usage;
  const taskTotal = perTask.reduce((sum, r) => sum + (r.usd ?? 0), 0);
  const tokenTotal = perTask.reduce((sum, r) => sum + (r.tokens ?? 0), 0);

  return (
    <div className="space-y-10">
      <section aria-labelledby="per-task">
        <h1 id="per-task" className="mb-4 text-2xl">Cost per task</h1>
        {perTask.length === 0 ? (
          <div className="void-card p-5 text-sm">
            <p>No per-task rows yet.</p>
            <p className="mt-2 text-muted-grey">
              Add a table with the columns <code className="text-void-gold-light">Task | Session | Model | Tokens | USD | Date</code> to
              the usage file, one row per task session, and it appears here.
            </p>
          </div>
        ) : (
          <div className="void-card overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="eyebrow border-b border-gunmetal-grey">
                <tr>
                  {["Task", "Session", "Model", "Tokens", "USD", "Date"].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gunmetal-grey">
                {perTask.map((r, i) => (
                  <tr key={i}>
                    <td className="whitespace-nowrap px-4 py-2 font-semibold text-aethelred-gold">{r.task}</td>
                    <td className="px-4 py-2">{r.session}</td>
                    <td className="px-4 py-2">{r.model}</td>
                    <td className="px-4 py-2">{r.tokens === null ? "n/a" : r.tokens.toLocaleString("en-US")}</td>
                    <td className="px-4 py-2">{usd(r.usd)}</td>
                    <td className="px-4 py-2">{r.date}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-gunmetal-grey text-row-title">
                <tr>
                  <th scope="row" colSpan={3} className="px-4 py-3 text-left font-semibold">Total</th>
                  <td className="px-4 py-3">{tokenTotal.toLocaleString("en-US")}</td>
                  <td className="px-4 py-3">{usd(taskTotal)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>

      {totals.length > 0 && (
        <section aria-labelledby="totals">
          <h2 id="totals" className="mb-4 text-xl">Measured totals</h2>
          <div className="void-card overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="eyebrow border-b border-gunmetal-grey">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">What</th>
                  <th scope="col" className="px-4 py-3 font-medium">Cost</th>
                  <th scope="col" className="px-4 py-3 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gunmetal-grey">
                {totals.map((t, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 text-row-title">{t.label}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-void-gold-light">{t.costText}</td>
                    <td className="px-4 py-2">{t.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted-grey">
            Rows marked &quot;of which&quot; are parts of the row above, so do not add them together.
          </p>
        </section>
      )}
    </div>
  );
}
