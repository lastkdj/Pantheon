import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { HalfGauge } from "@/components/HalfGauge";
import { IconArrowUpRight, IconDollar, IconEye, IconShield, IconTasks } from "@/components/icons";
import { KpiCard } from "@/components/KpiCard";
import { Rings, type RingSlice } from "@/components/Rings";
import { StackedBars } from "@/components/StackedBars";
import { getLoaded } from "@/lib/cached";
import { riskLevel } from "@/lib/roles";
import { overview } from "@/lib/stats";
import { STACK } from "@/lib/stack";

export const metadata = { title: "Overview" };

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n).trimEnd()}…` : s);
const pct = (n: number, total: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

interface NeedRow {
  key: string;
  kind: "Decision" | "Review" | "Blocked";
  id: string;
  title: string;
  role: string;
  meta: string;
  href: string;
}

const KIND_CHIP = {
  Decision: "bg-magenta/15 text-magenta-hi",
  Review: "bg-cyan/15 text-cyan",
  Blocked: "bg-coral/15 text-coral",
} as const;

export default async function OverviewPage({ params }: { params: Promise<{ project: string }> }) {
  const { project } = await params;
  const loaded = await getLoaded(project);
  if (!loaded) notFound();
  const { tasks, approvals, usage } = loaded.state;
  const o = overview(tasks, approvals, usage);
  const waiting = o.pendingApprovals.length;

  const headline =
    waiting > 0
      ? `${plural(waiting, "decision")} waiting for you`
      : o.inReview.length > 0
        ? `${plural(o.inReview.length, "change")} ready to review`
        : o.blocked.length > 0
          ? `${plural(o.blocked.length, "task")} blocked`
          : "Nothing needs you right now";

  const needs: NeedRow[] = [
    ...o.pendingApprovals.map((a): NeedRow => {
      const level = riskLevel(a.risk);
      return { key: a.id, kind: "Decision", id: a.id, title: a.action, role: a.agent || "unknown", meta: level ? `${level[0].toUpperCase()}${level.slice(1)} risk` : "Needs a decision", href: `/p/${project}/approvals` };
    }),
    ...o.inReview.map((t): NeedRow => ({ key: t.id, kind: "Review", id: t.id, title: t.title, role: t.owner, meta: t.pr ? `PR ${t.pr.number}` : "In review", href: `/p/${project}/tasks/${t.id}` })),
    ...o.blocked.map((t): NeedRow => ({ key: t.id, kind: "Blocked", id: t.id, title: t.title, role: t.owner, meta: "Blocked", href: `/p/${project}/tasks/${t.id}` })),
  ];

  const inFlight = o.byStatus["in-progress"] + o.byStatus.review;
  const slices: RingSlice[] = [
    { label: "Done", value: o.byStatus.done, from: "#2DD4A0", to: "#0A9495" },
    { label: "In flight", value: inFlight, from: "#02C3FF", to: "#2D5BFF" },
    { label: "To do", value: o.byStatus.todo, from: "#C77DFF", to: "#8B2CF5" },
    { label: "Blocked", value: o.byStatus.blocked, from: "#FF8A9E", to: "#E0334F" },
  ];
  const ringDots = ["bg-mint", "bg-cyan", "bg-violet-hi", "bg-coral"];
  const decidedPct = pct(o.approvalTally.decided, o.approvalTally.total);

  return (
    <div className="space-y-6">
      <div className="rise">
        <h1 className="text-xl font-bold text-snow sm:text-2xl">{headline}</h1>
        <p className="mt-1 text-sm text-dusk">
          {plural(o.total, "task")} on the board, {o.percentDone}% done.{" "}
          {o.ready.length > 0 && (
            <Link href={`/p/${project}/health`} className="font-semibold text-violet-hi underline-offset-4 hover:underline">
              {o.ready.length} ready to start
            </Link>
          )}
        </p>
      </div>

      <section aria-label="Key numbers" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <KpiCard index={0} tone="magenta" icon={<IconTasks />} label="Open tasks" value={o.total - o.byStatus.done} chip={`${o.percentDone}% done`} chipTone="mint" fill={o.percentDone / 100} />
        <KpiCard index={1} tone="cyan" icon={<IconEye />} label="In review" value={o.byStatus.review} chip={o.byStatus.blocked > 0 ? `${o.byStatus.blocked} blocked` : "none blocked"} chipTone={o.byStatus.blocked > 0 ? "coral" : "mint"} fill={o.total ? o.byStatus.review / o.total : 0} />
        <KpiCard index={2} tone="coral" icon={<IconShield />} label="Waiting for you" value={waiting} chip={`${o.approvalTally.decided} decided`} chipTone="mint" fill={o.approvalTally.total ? waiting / o.approvalTally.total : 0} />
        {o.spend ? (
          <KpiCard index={3} tone="mint" icon={<IconDollar />} label="Spend" value={o.spend.usd} decimals={2} prefix="$" chip={o.spend.basis} chipTone="azure" />
        ) : (
          <KpiCard index={3} tone="mint" icon={<IconDollar />} label="Spend" value={0} decimals={2} prefix="$" chip="not tracked yet" chipTone="azure" />
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-12">
        <section aria-labelledby="flow" className="panel rise p-6 xl:col-span-4" style={{ ["--i" as string]: 2 }}>
          <h2 id="flow" className="mb-5 text-base font-bold">Task flow</h2>
          <Rings slices={slices} total={o.total} centerLabel="tasks" />
          <ul className="mt-6 space-y-3.5 text-sm">
            {slices.map((s, i) => (
              <li key={s.label} className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${ringDots[i]}`} />
                <span className="flex-1 text-mist">{s.label}</span>
                <span className="text-dusk">{s.value}</span>
                <span className="w-10 text-right font-bold text-snow">{pct(s.value, o.total)}%</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="load" className="panel rise min-w-0 p-6 xl:col-span-8" style={{ ["--i" as string]: 3 }}>
          <h2 id="load" className="mb-1 text-base font-bold">Workload by agent</h2>
          <p className="mb-5 text-sm text-dusk">Every task, stacked by where it is now.</p>
          <StackedBars items={o.workload} />
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <section aria-labelledby="needs" className="panel rise min-w-0 xl:col-span-8" style={{ ["--i" as string]: 4 }}>
          <div className="flex items-center justify-between px-6 pb-3 pt-6">
            <h2 id="needs" className="text-base font-bold">Needs you</h2>
            <Link href={`/p/${project}/approvals`} className="flex items-center gap-1 text-xs font-semibold text-violet-hi hover:underline">
              All approvals <IconArrowUpRight />
            </Link>
          </div>
          {needs.length === 0 ? (
            <p className="px-6 pb-6 text-sm text-dusk">Nothing is waiting on you. New decisions, reviews and blocked work show up here.</p>
          ) : (
            <ul className="ledger max-h-[26rem] overflow-y-auto">
              {needs.map((n, i) => (
                <li key={n.key}>
                  <Link
                    href={n.href}
                    style={{ ["--i" as string]: Math.min(i, 8) }}
                    className="rise grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 px-6 py-3.5 transition-colors hover:bg-night-4/60 md:grid-cols-[auto_5.5rem_1fr_auto]"
                  >
                    <Avatar role={n.role} size={34} />
                    <span className="md:contents">
                      <span className="flex items-center gap-2 md:block">
                        <span className="text-sm font-bold text-snow">{n.id}</span>
                        <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold md:mt-1 md:inline-block ${KIND_CHIP[n.kind]}`}>{n.kind}</span>
                      </span>
                      <span className="col-span-2 line-clamp-2 text-sm text-mist md:col-span-1">{clip(n.title, 150)}</span>
                      <span className="col-span-2 text-xs font-semibold text-dusk md:col-span-1 md:text-right">{n.meta}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="decided" className="panel rise p-6 xl:col-span-4" style={{ ["--i" as string]: 5 }}>
          <h2 id="decided" className="mb-6 text-base font-bold">Approvals decided</h2>
          <HalfGauge percent={decidedPct} label="of all requests" />
          <ul className="mt-6 space-y-3.5 text-sm">
            {[
              { label: "Decided", value: o.approvalTally.decided, dot: "bg-mint" },
              { label: "Waiting for you", value: o.approvalTally.pending, dot: "bg-magenta" },
              { label: "Total requests", value: o.approvalTally.total, dot: "bg-dusk" },
            ].map((r) => (
              <li key={r.label} className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${r.dot}`} />
                <span className="flex-1 text-mist">{r.label}</span>
                <span className="font-bold text-snow">{r.value}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="agents" className="panel rise overflow-hidden" style={{ ["--i" as string]: 6 }}>
        <h2 id="agents" className="px-6 pb-3 pt-6 text-base font-bold">Agents</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="text-xs text-dusk">
              <tr className="border-y border-edge">
                <th scope="col" className="px-6 py-3 font-semibold">Agent</th>
                {STACK.slice().reverse().map((s) => (
                  <th key={s.status} scope="col" className="px-3 py-3 text-center font-semibold">{s.label}</th>
                ))}
                <th scope="col" className="w-56 px-6 py-3 font-semibold">Done</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {o.workload.map((w) => {
                const done = pct(w.byStatus.done, w.total);
                return (
                  <tr key={w.owner} className="transition-colors hover:bg-night-4/50">
                    <td className="px-6 py-3">
                      <span className="flex items-center gap-3">
                        <Avatar role={w.owner} size={30} />
                        <span className="font-bold text-snow">{w.owner}</span>
                      </span>
                    </td>
                    {STACK.slice().reverse().map((s) => (
                      <td key={s.status} className={`px-3 py-3 text-center font-semibold ${w.byStatus[s.status] === 0 ? "text-dusk/60" : s.status === "blocked" ? "text-coral" : "text-snow"}`}>
                        {w.byStatus[s.status]}
                      </td>
                    ))}
                    <td className="px-6 py-3">
                      <span className="flex items-center gap-3">
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-night-2" aria-hidden="true">
                          <span className="block h-full origin-left animate-grow rounded-full bg-gradient-to-r from-mint to-cyan" style={{ width: `${done}%` }} />
                        </span>
                        <span className="w-10 text-right text-xs font-bold text-snow">{done}%</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
