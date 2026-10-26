import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { getLoaded } from "@/lib/cached";
import type { Approval } from "@/lib/schema";

function ApprovalCard({ a }: { a: Approval }) {
  return (
    <li className={`void-card p-4 ${a.status === "pending" ? "border-l-4 border-l-aethelred-gold" : ""}`}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-semibold text-aethelred-gold">{a.id}</span>
        <StatusBadge status={a.status} />
        <span className="text-xs text-muted-grey">requested by {a.agent || "unknown"}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-row-title">{a.action}</p>
      {a.statusNote && <p className="mt-1 text-xs text-muted-grey">{a.statusNote}</p>}
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-xs text-void-gold-light">Prepared and risk</summary>
        <p className="mt-2 text-list-text"><span className="eyebrow mr-2">Prepared</span>{a.prepared || "None"}</p>
        <p className="mt-2 text-list-text"><span className="eyebrow mr-2">Risk</span>{a.risk || "None stated"}</p>
      </details>
    </li>
  );
}

export default async function ApprovalsPage({ params }: { params: Promise<{ project: string }> }) {
  const { project } = await params;
  const loaded = await getLoaded(project);
  if (!loaded) notFound();
  const pending = loaded.state.approvals.filter((a) => a.status === "pending");
  const decided = loaded.state.approvals.filter((a) => a.status !== "pending");

  return (
    <div className="space-y-10">
      <section aria-labelledby="pending">
        <h1 id="pending" className="mb-1 text-2xl">Waiting for you</h1>
        <p className="mb-4 text-sm text-muted-grey">
          Decisions are made in the project&apos;s approvals file, not here. This page only shows them.
        </p>
        {pending.length === 0 ? (
          <div className="void-card p-5 text-sm">Nothing is waiting for a decision.</div>
        ) : (
          <ul className="space-y-3">{pending.map((a) => <ApprovalCard key={a.id} a={a} />)}</ul>
        )}
      </section>
      <section aria-labelledby="decided">
        <h2 id="decided" className="mb-4 text-xl">Decided</h2>
        <ul className="space-y-3">{decided.map((a) => <ApprovalCard key={a.id} a={a} />)}</ul>
      </section>
    </div>
  );
}
