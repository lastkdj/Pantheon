import { notFound } from "next/navigation";
import { BoardView, type BoardCard } from "@/components/BoardView";
import { getLoaded } from "@/lib/cached";
import { sessionName } from "@/lib/naming";
import { dependencyMet } from "@/lib/validate";

export const metadata = { title: "Board" };

export default async function BoardPage({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project } = await params;
  const loaded = await getLoaded(project);
  if (!loaded) notFound();
  const { tasks, approvals } = loaded.state;

  const cards: BoardCard[] = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    owner: t.owner,
    status: t.status,
    session: sessionName(loaded.project, t),
    prNumber: t.pr?.number,
    tier: t.tier,
    waitingOn: t.status === "done" ? [] : t.deps.filter((d) => !dependencyMet(d, tasks, approvals)),
  }));

  return (
    <>
      <h1 className="sr-only">Board</h1>
      {tasks.length === 0 ? (
        <div className="panel p-6 text-sm text-mist">No tasks found. Open Health to see which rows could not be read.</div>
      ) : (
        <BoardView project={project} cards={cards} />
      )}
    </>
  );
}
