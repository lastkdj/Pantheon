import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/CopyButton";
import { StatusBadge } from "@/components/StatusBadge";
import { buildBrief } from "@/lib/brief";
import { getLoaded } from "@/lib/cached";
import { branchName, sessionName } from "@/lib/naming";
import { dependencyMet } from "@/lib/validate";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr]">
      <dt className="eyebrow">{label}</dt>
      <dd className="min-w-0 break-words text-sm text-list-text">{children}</dd>
    </div>
  );
}

export default async function TaskPage({ params }: { params: Promise<{ project: string; id: string }> }) {
  const { project, id } = await params;
  const loaded = await getLoaded(project);
  if (!loaded) notFound();
  const { tasks, approvals } = loaded.state;
  const task = tasks.find((t) => t.id === id);
  if (!task) notFound();

  const brief = buildBrief(loaded.project, task, tasks);
  const issues = loaded.state.issues.filter((i) => i.message.startsWith(`${task.id}:`) || i.message.startsWith(`${task.id} `));

  return (
    <div className="space-y-8">
      <div>
        <Link href={`/p/${project}`} className="text-sm text-void-gold-light hover:underline">← Board</Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl">{task.id}</h1>
          <StatusBadge status={task.status} />
        </div>
        <p className="mt-2 text-lg text-row-title">{task.title}</p>
      </div>

      {issues.length > 0 && (
        <ul className="void-card space-y-1 border-destruction/60 p-4 text-sm text-destruction" role="alert">
          {issues.map((i, n) => <li key={n}>{i.message}</li>)}
        </ul>
      )}

      <dl className="void-card divide-y divide-gunmetal-grey px-5">
        <Row label="Owner role">{task.owner}</Row>
        {task.tier && <Row label="Tier">{task.tier}</Row>}
        <Row label="Session name"><code className="text-void-gold-light">{sessionName(loaded.project, task)}</code></Row>
        <Row label="Branch"><code>{branchName(loaded.project, task)}</code></Row>
        {task.pr && (
          <Row label="Pull request">
            <a className="text-void-gold-light hover:underline" href={task.pr.url} target="_blank" rel="noopener noreferrer">
              #{task.pr.number}
            </a>
          </Row>
        )}
        <Row label="Depends on">
          {task.deps.length === 0 ? "Nothing" : (
            <ul className="space-y-1">
              {task.deps.map((d) => {
                const isTask = tasks.some((t) => t.id === d);
                const met = dependencyMet(d, tasks, approvals);
                return (
                  <li key={d} className="flex items-center gap-2">
                    {isTask ? (
                      <Link className="text-void-gold-light hover:underline" href={`/p/${project}/tasks/${d}`}>{d}</Link>
                    ) : (
                      <Link className="text-void-gold-light hover:underline" href={`/p/${project}/approvals`}>{d}</Link>
                    )}
                    <span className={met ? "text-success" : "text-muted-grey"}>{met ? "met" : "not yet"}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </Row>
        <Row label="Output">{task.output || "None stated"}</Row>
        <Row label="Notes">{task.notes || "None"}</Row>
      </dl>

      <section aria-labelledby="brief">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 id="brief" className="text-lg">Start a new session</h2>
          <CopyButton text={brief} />
        </div>
        <p className="mb-3 text-sm text-muted-grey">
          Open a new session{loaded.project.sessionsUrl ? (
            <> at <a className="text-void-gold-light hover:underline" href={loaded.project.sessionsUrl} target="_blank" rel="noopener noreferrer">{loaded.project.sessionsUrl.replace("https://", "")}</a></>
          ) : null}, name it as shown above, and paste this brief as the first message.
        </p>
        <pre className="void-card overflow-x-auto whitespace-pre-wrap break-words p-4 text-xs leading-relaxed text-list-text">{brief}</pre>
      </section>
    </div>
  );
}
