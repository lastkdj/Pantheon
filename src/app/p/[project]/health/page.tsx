import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { getLoaded } from "@/lib/cached";
import { readyTasks } from "@/lib/validate";

export const metadata = { title: "Health" };

export default async function HealthPage({ params }: { params: Promise<{ project: string }> }) {
  const { project } = await params;
  const loaded = await getLoaded(project);
  if (!loaded) notFound();
  const { tasks, approvals, issues } = loaded.state;
  const ready = readyTasks(tasks, approvals);
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  return (
    <div className="space-y-12">
      <section aria-labelledby="parse">
        <h1 id="parse" className="sr-only">Health</h1>
        {issues.length === 0 ? (
          <div className="panel flex items-center gap-3 p-5" role="status">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-mint" />
            <p className="text-snow">All {tasks.length} tasks and {approvals.length} approvals were read without problems.</p>
          </div>
        ) : (
          <>
            <p className="mb-3 text-sm text-mist">
              {errors.length} {errors.length === 1 ? "error" : "errors"}, {warnings.length} {warnings.length === 1 ? "warning" : "warnings"}. Rows with errors are left out of the board until the file is fixed.
            </p>
            <ul className="ledger panel">
              {[...errors, ...warnings].map((i, n) => (
                <li key={n} className="flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:gap-4">
                  <span className={`w-16 shrink-0 text-xs font-semibold ${i.severity === "error" ? "text-coral" : "text-violet-hi"}`}>
                    {i.severity === "error" ? "Error" : "Warning"}
                  </span>
                  <span className="text-snow">{i.message}</span>
                  <span className="text-xs text-dusk sm:ml-auto">{i.file}{i.line ? `, line ${i.line}` : ""}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section aria-labelledby="ready">
        <h2 id="ready" className="text-xl">Ready to start</h2>
        <p className="mb-4 mt-1 text-sm text-mist">To do, with everything they wait on already done.</p>
        {ready.length === 0 ? (
          <div className="panel p-5 text-sm text-mist">Every open task is waiting on something else.</div>
        ) : (
          <ul className="ledger panel">
            {ready.map((t) => (
              <li key={t.id}>
                <Link href={`/p/${project}/tasks/${t.id}`} className="flex items-start gap-3 px-4 py-3.5 hover:bg-night-3">
                  <Avatar role={t.owner} size={28} />
                  <span className="whitespace-nowrap font-bold text-violet-hi">{t.id}</span>
                  <span className="min-w-0 flex-1 break-words text-sm text-mist">{t.title.length > 150 ? `${t.title.slice(0, 150)}…` : t.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
