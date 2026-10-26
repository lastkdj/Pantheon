import { notFound } from "next/navigation";
import { Mascot } from "@/components/Mascot";
import { StatusBadge } from "@/components/StatusBadge";
import { getLoaded } from "@/lib/cached";
import { riskLevel } from "@/lib/roles";
import type { Approval } from "@/lib/schema";

export const metadata = { title: "Approvals" };

const RISK_STYLE = {
  critical: "text-coral",
  high: "text-coral",
  medium: "text-violet-hi",
  low: "text-mint",
} as const;

function ApprovalRow({ a }: { a: Approval }) {
  const level = riskLevel(a.risk);
  return (
    <li className={a.status === "pending" ? "border-l-2 border-l-violet" : ""}>
      <div className="flex gap-4 px-5 py-4">
        <Mascot role={a.agent || "unknown"} size={40} animate={false} />
        <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-semibold text-violet">{a.id}</span>
          <StatusBadge status={a.status} />
          {level && <span className={`text-xs font-medium ${RISK_STYLE[level]}`}>{level[0].toUpperCase() + level.slice(1)} risk</span>}
          <span className="text-xs text-dusk sm:ml-auto">Asked by {a.agent || "unknown"}</span>
        </div>
        <p className="mt-2 max-w-3xl text-snow">{a.action}</p>
        {a.statusNote && <p className="mt-1.5 max-w-3xl text-sm text-dusk">{a.statusNote}</p>}
        <details className="mt-3 max-w-3xl text-sm">
          <summary className="cursor-pointer text-violet-hi">What is prepared and what could go wrong</summary>
          <dl className="mt-3 space-y-3">
            <div><dt className="label">Prepared</dt><dd className="mt-0.5 text-mist">{a.prepared || "Nothing stated"}</dd></div>
            <div><dt className="label">Risk</dt><dd className="mt-0.5 text-mist">{a.risk || "Nothing stated"}</dd></div>
          </dl>
        </details>
        </div>
      </div>
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
    <div className="space-y-12">
      <section aria-labelledby="pending">
        <h1 id="pending" className="text-3xl">{pending.length > 0 ? "Waiting for you" : "Approvals"}</h1>
        <p className="mb-5 mt-2 max-w-xl text-sm text-mist">
          Decide in the project&apos;s approvals file. This page only shows the state.
        </p>
        {pending.length === 0 ? (
          <div className="panel p-6">
            <p className="text-snow">Nothing is waiting for a decision.</p>
            <p className="mt-1 text-sm text-mist">New requests appear here as soon as an agent adds a row marked pending.</p>
          </div>
        ) : (
          <ul className="ledger panel">{pending.map((a) => <ApprovalRow key={a.id} a={a} />)}</ul>
        )}
      </section>
      {decided.length > 0 && (
        <section aria-labelledby="decided">
          <h2 id="decided" className="mb-4 text-xl">Decided</h2>
          <ul className="ledger panel">{decided.map((a) => <ApprovalRow key={a.id} a={a} />)}</ul>
        </section>
      )}
    </div>
  );
}
