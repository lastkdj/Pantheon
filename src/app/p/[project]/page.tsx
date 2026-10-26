import Link from "next/link";
import { notFound } from "next/navigation";
import { getLoaded } from "@/lib/cached";
import { sessionName } from "@/lib/naming";
import { TASK_STATUSES, type Task, type TaskStatus } from "@/lib/schema";

const LABELS: Record<TaskStatus, string> = {
  todo: "To do",
  "in-progress": "In progress",
  review: "In review",
  blocked: "Blocked",
  done: "Done",
};

function TaskCard({ task, project, session }: { task: Task; project: string; session: string }) {
  return (
    <li>
      <Link
        href={`/p/${project}/tasks/${task.id}`}
        className="void-card block p-3 hover:border-aethelred-gold"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-aethelred-gold">{task.id}</span>
          <span className="truncate text-xs text-muted-grey">{task.owner}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm font-medium text-row-title">{task.title}</p>
        <p className="mt-2 truncate text-[11px] text-muted-grey" title={session}>{session}</p>
        <div className="mt-1 flex gap-3 text-[11px] text-muted-grey">
          {task.pr && <span>PR #{task.pr.number}</span>}
          {task.deps.length > 0 && <span>{task.deps.length} dep{task.deps.length > 1 ? "s" : ""}</span>}
          {task.tier && <span>Tier {task.tier}</span>}
        </div>
      </Link>
    </li>
  );
}

export default async function BoardPage({ params }: { params: Promise<{ project: string }> }) {
  const { project } = await params;
  const loaded = await getLoaded(project);
  if (!loaded) notFound();
  const { tasks } = loaded.state;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl">{loaded.project.name} board</h1>
        <p className="text-sm text-muted-grey">{tasks.length} tasks</p>
      </div>
      {tasks.length === 0 && (
        <div className="void-card p-6 text-sm">No tasks found. Check the Health page for parse errors.</div>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {TASK_STATUSES.map((status) => {
          const column = tasks.filter((t) => t.status === status);
          const list = (
            <ul className="space-y-2">
              {column.map((t) => (
                <TaskCard key={t.id} task={t} project={project} session={sessionName(loaded.project, t)} />
              ))}
              {column.length === 0 && <li className="px-1 text-xs text-muted-grey">Nothing here.</li>}
            </ul>
          );
          return (
            <section key={status} aria-labelledby={`col-${status}`} className="min-w-0">
              <div className="mb-3 flex items-center justify-between">
                <h2 id={`col-${status}`} className="eyebrow !font-montserrat">{LABELS[status]}</h2>
                <span className="text-xs font-semibold text-aethelred-gold">{column.length}</span>
              </div>
              {status === "done" ? (
                <details>
                  <summary className="mb-2 cursor-pointer text-xs text-void-gold-light">
                    {column.length} finished (show)
                  </summary>
                  {list}
                </details>
              ) : (
                list
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
