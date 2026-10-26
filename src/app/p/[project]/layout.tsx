import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { PageTransition } from "@/components/PageTransition";
import { Sidebar } from "@/components/Sidebar";
import { getLoaded } from "@/lib/cached";
import { projects } from "@/lib/config";
import { overview } from "@/lib/stats";

export const revalidate = 60;

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ project: string }>;
}) {
  const { project } = await params;
  const loaded = await getLoaded(project);
  if (!loaded) notFound();
  const { state } = loaded;
  const o = overview(state.tasks, state.approvals, state.usage);
  const list = projects.map((p) => ({ id: p.id, name: p.name }));

  return (
    <div className="flex min-h-screen">
      <Sidebar
        projects={list}
        current={project}
        counts={{ waiting: o.pendingApprovals.length, ready: o.ready.length, errors: state.issues.filter((i) => i.severity === "error").length }}
      />
      <div className="min-w-0 flex-1 pb-28 lg:pb-10">
        <Header projects={list} current={project} waiting={o.pendingApprovals.length} origin={loaded.origin} />
        {loaded.warnings.length > 0 && (
          <div role="status" className="mx-4 mt-3 rounded-xl border border-magenta/30 bg-magenta/10 px-4 py-2.5 text-sm font-medium text-magenta-hi sm:mx-8">
            {loaded.warnings[0]}
          </div>
        )}
        <main className="mx-auto max-w-[1280px] px-4 pb-4 pt-6 sm:px-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
