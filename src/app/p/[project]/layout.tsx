import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
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
  const errorCount = loaded.state.issues.filter((i) => i.severity === "error").length;

  return (
    <>
      <Nav projects={projects.map((p) => ({ id: p.id, name: p.name }))} current={project} errorCount={errorCount} />
      {loaded.warnings.length > 0 && (
        <div role="status" className="border-b border-aethelred-gold/40 bg-aethelred-gold/10 px-4 py-2 text-center text-sm text-void-gold-light">
          {loaded.warnings[0]}
        </div>
      )}
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <footer className="mx-auto max-w-7xl px-4 pb-10 text-xs text-muted-grey">
        {loaded.project.name} · {loaded.origin === "github" ? "live from GitHub" : "snapshot"} · refreshes about every minute · read-only
      </footer>
    </>
  );
}
