import { notFound } from "next/navigation";
import { SideNav } from "@/components/SideNav";
import { getLoaded } from "@/lib/cached";
import { projects } from "@/lib/config";

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

  return (
    <div className="lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)]">
      <SideNav
        projects={projects.map((p) => ({ id: p.id, name: p.name }))}
        current={project}
        origin={loaded.origin}
        counts={{
          waiting: state.approvals.filter((a) => a.status === "pending").length,
          review: state.tasks.filter((t) => t.status === "review").length,
          errors: state.issues.filter((i) => i.severity === "error").length,
        }}
      />
      <div className="min-w-0">
        {loaded.warnings.length > 0 && (
          <div role="status" className="border-b border-bronze/30 bg-bronze/10 px-6 py-2.5 text-sm text-bronze-hi">
            {loaded.warnings[0]}
          </div>
        )}
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
