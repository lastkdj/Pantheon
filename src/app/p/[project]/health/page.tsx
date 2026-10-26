import Link from "next/link";
import { notFound } from "next/navigation";
import { getLoaded } from "@/lib/cached";
import { readyTasks } from "@/lib/validate";

export default async function HealthPage({ params }: { params: Promise<{ project: string }> }) {
  const { project } = await params;
  const loaded = await getLoaded(project);
  if (!loaded) notFound();
  const { tasks, approvals, issues } = loaded.state;
  const ready = readyTasks(tasks, approvals);
  const blocked = tasks.filter((t) => t.status === "blocked");
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  const taskLink = (id: string, title: string) => (
    <li key={id} className="py-2">
      <Link className="font-semibold text-aethelred-gold hover:underline" href={`/p/${project}/tasks/${id}`}>{id}</Link>
      <span className="ml-3 text-sm text-list-text">{title.length > 150 ? `${title.slice(0, 150)}…` : title}</span>
    </li>
  );

  return (
    <div className="space-y-10">
      <section aria-labelledby="parse">
        <h1 id="parse" className="mb-4 text-2xl">Health</h1>
        {issues.length === 0 ? (
          <div className="void-card p-5 text-sm text-success" role="status">
            All {tasks.length} tasks and {approvals.length} approvals parsed cleanly.
          </div>
        ) : (
          <ul className="void-card divide-y divide-gunmetal-grey">
            {[...errors, ...warnings].map((i, n) => (
              <li key={n} className="flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:gap-4">
                <span className={`w-16 shrink-0 text-xs font-semibold uppercase ${i.severity === "error" ? "text-destruction" : "text-void-gold-light"}`}>
                  {i.severity}
                </span>
                <span className="text-list-text">{i.message}</span>
                <span className="text-xs text-muted-grey sm:ml-auto">{i.file}{i.line ? `:${i.line}` : ""}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="ready">
        <h2 id="ready" className="mb-3 text-xl">Ready to start</h2>
        <p className="mb-2 text-sm text-muted-grey">To do, with every dependency met.</p>
        {ready.length === 0 ? <p className="text-sm">None.</p> : <ul className="void-card divide-y divide-gunmetal-grey px-4">{ready.map((t) => taskLink(t.id, t.title))}</ul>}
      </section>

      <section aria-labelledby="blocked">
        <h2 id="blocked" className="mb-3 text-xl">Blocked</h2>
        {blocked.length === 0 ? <p className="text-sm">None.</p> : (
          <ul className="void-card divide-y divide-gunmetal-grey px-4">
            {blocked.map((t) => taskLink(t.id, t.notes ? `${t.title}. ${t.notes.slice(0, 160)}` : t.title))}
          </ul>
        )}
      </section>
    </div>
  );
}
