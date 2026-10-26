import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { PageTransition } from "@/components/PageTransition";
import { Rail } from "@/components/Rail";
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
  const waiting = state.approvals.filter((a) => a.status === "pending").length;

  return (
    <div className="lg:p-6 xl:p-10">
      <div className="frame mx-auto flex min-h-screen max-w-[1480px] overflow-hidden lg:min-h-[calc(100vh-3rem)] lg:rounded-[36px] xl:min-h-[calc(100vh-5rem)]">
        <Rail
          current={project}
          counts={{ waiting, review: state.tasks.filter((t) => t.status === "review").length, errors: state.issues.filter((i) => i.severity === "error").length }}
        />
        <div className="min-w-0 flex-1 pb-28 lg:pb-8">
          <Header
            projects={projects.map((p) => ({ id: p.id, name: p.name }))}
            current={project}
            waiting={waiting}
            origin={loaded.origin}
          />
          {loaded.warnings.length > 0 && (
            <div role="status" className="mx-4 mt-3 rounded-2xl bg-violet/15 px-4 py-2.5 text-sm text-violet-hi ring-1 ring-violet/30 sm:mx-8">
              {loaded.warnings[0]}
            </div>
          )}
          <main className="px-4 pb-4 pt-6 sm:px-8">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </div>
  );
}
