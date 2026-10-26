import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/CopyButton";
import { RoleSeal } from "@/components/RoleSeal";
import { Stepper } from "@/components/Stepper";
import { buildBrief } from "@/lib/brief";
import { getLoaded } from "@/lib/cached";
import { branchName, sessionName } from "@/lib/naming";
import { dependencyMet } from "@/lib/validate";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: id };
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-3.5 sm:grid-cols-[9rem_1fr]">
      <dt className="label pt-0.5">{label}</dt>
      <dd className="min-w-0 break-words text-sm text-marble">{children}</dd>
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
        <Link href={`/p/${project}/board`} className="text-sm text-bronze-hi underline-offset-4 hover:underline">Back to the board</Link>
        <div className="mt-4 flex items-center gap-3">
          <RoleSeal role={task.owner} size={40} />
          <div>
            <h1 className="text-3xl leading-none">{task.id}</h1>
            <p className="mt-1 text-sm text-ash">{task.owner}{task.tier ? `, tier ${task.tier}` : ""}</p>
          </div>
        </div>
        <p className="mt-5 max-w-3xl text-lg leading-snug text-marble">{task.title}</p>
      </div>

      <div className="panel px-5 py-5">
        <Stepper status={task.status} />
      </div>

      {issues.length > 0 && (
        <ul className="panel space-y-1 border-oxblood/50 p-4 text-sm text-oxblood" role="alert">
          {issues.map((i, n) => <li key={n}>{i.message}</li>)}
        </ul>
      )}

      <dl className="panel divide-y divide-line px-5">
        <Row label="Session name"><code className="rounded bg-ink-3 px-1.5 py-0.5 text-bronze-hi">{sessionName(loaded.project, task)}</code></Row>
        <Row label="Branch"><code className="text-stone">{branchName(loaded.project, task)}</code></Row>
        {task.pr && (
          <Row label="Pull request">
            <a className="text-bronze-hi underline-offset-4 hover:underline" href={task.pr.url} target="_blank" rel="noopener noreferrer">
              Open PR {task.pr.number} on GitHub
            </a>
          </Row>
        )}
        <Row label="Waits on">
          {task.deps.length === 0 ? "Nothing" : (
            <ul className="space-y-1.5">
              {task.deps.map((d) => {
                const isTask = tasks.some((t) => t.id === d);
                const met = dependencyMet(d, tasks, approvals);
                return (
                  <li key={d} className="flex items-center gap-3">
                    <Link
                      className="font-medium text-bronze-hi underline-offset-4 hover:underline"
                      href={isTask ? `/p/${project}/tasks/${d}` : `/p/${project}/approvals`}
                    >
                      {d}
                    </Link>
                    <span className={met ? "text-verdigris" : "text-ash"}>{met ? "Done" : "Not yet"}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </Row>
        <Row label="Output">{task.output || "None stated"}</Row>
        <Row label="Notes"><span className="whitespace-pre-line text-stone">{task.notes || "None"}</span></Row>
      </dl>

      <section aria-labelledby="brief">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 id="brief" className="text-xl">Start a new session</h2>
          <CopyButton text={brief} />
        </div>
        <p className="mb-3 max-w-2xl text-sm text-stone">
          Open a fresh session{loaded.project.sessionsUrl ? (
            <> at <a className="text-bronze-hi underline-offset-4 hover:underline" href={loaded.project.sessionsUrl} target="_blank" rel="noopener noreferrer">{loaded.project.sessionsUrl.replace("https://", "")}</a></>
          ) : null}, name it exactly as shown above, and paste this brief as the first message.
        </p>
        <pre className="panel overflow-x-auto whitespace-pre-wrap break-words p-4 text-xs leading-relaxed text-stone">{brief}</pre>
      </section>
    </div>
  );
}
