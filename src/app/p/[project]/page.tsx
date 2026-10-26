import Link from "next/link";
import { notFound } from "next/navigation";
import { Donut } from "@/components/Donut";
import { Mascot } from "@/components/Mascot";
import { NeedsCarousel, type NeedItem } from "@/components/NeedsCarousel";
import { StatTile } from "@/components/StatTile";
import { WorkloadChart } from "@/components/WorkloadChart";
import { getLoaded } from "@/lib/cached";
import { riskLevel } from "@/lib/roles";
import { overview } from "@/lib/stats";

export const metadata = { title: "Overview" };

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n).trimEnd()}…` : s);

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

  const needs: NeedItem[] = [
    ...o.pendingApprovals.map((a): NeedItem => {
      const level = riskLevel(a.risk);
      return {
        key: a.id, kind: "decision", id: a.id, title: clip(a.action, 90), role: a.agent || "unknown",
        meta: level ? `${level[0].toUpperCase()}${level.slice(1)} risk` : "Needs a decision",
        href: `/p/${project}/approvals`,
      };
    }),
    ...o.inReview.map((t): NeedItem => ({
      key: t.id, kind: "review", id: t.id, title: clip(t.title, 90), role: t.owner,
      meta: t.pr ? `PR ${t.pr.number}` : "In review", href: `/p/${project}/tasks/${t.id}`,
    })),
    ...o.blocked.map((t): NeedItem => ({
      key: t.id, kind: "blocked", id: t.id, title: clip(t.title, 90), role: t.owner,
      meta: "Blocked", href: `/p/${project}/tasks/${t.id}`,
    })),
  ].slice(0, 14);

  const inFlight = o.byStatus["in-progress"] + o.byStatus.review;
  const legend = [
    { label: "Done", value: o.byStatus.done, dot: "bg-mint" },
    { label: "In flight", value: inFlight, dot: "bg-violet-hi" },
    { label: "To do", value: o.byStatus.todo, dot: "bg-dusk" },
    { label: "Blocked", value: o.byStatus.blocked, dot: "bg-coral" },
  ];

  return (
    <div className="space-y-6">
      <div className="rise">
        <p className="text-sm text-dusk">{loaded.project.name}</p>
        <h1 className="mt-1 font-display text-2xl font-semibold leading-tight sm:text-3xl">{headline}</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <section aria-labelledby="progress" className="panel rise flex flex-col p-6 xl:col-span-4" style={{ ["--i" as string]: 1 }}>
          <h3 id="progress" className="mb-5 font-display text-lg font-semibold text-snow">Progress</h3>
          <div className="my-auto flex flex-wrap items-center gap-6">
            <Donut percent={o.percentDone} />
            <ul className="min-w-0 flex-1 space-y-3 text-sm">
              {legend.map((l) => (
                <li key={l.label} className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${l.dot}`} />
                  <span className="min-w-0 flex-1 truncate text-mist">{l.label}</span>
                  <span className="font-semibold text-snow">{l.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-label="What needs you" className="min-w-0 xl:col-span-8">
          {needs.length > 0 ? (
            <NeedsCarousel items={needs} />
          ) : (
            <div className="panel flex items-center gap-6 p-6">
              <Mascot role="pantheon" size={84} />
              <div>
                <h3 className="font-display text-lg font-semibold text-snow">All quiet</h3>
                <p className="mt-1 text-sm text-mist">
                  {o.ready.length > 0 ? (
                    <>
                      {plural(o.ready.length, "task")} can start now.{" "}
                      <Link className="text-violet-hi underline-offset-4 hover:underline" href={`/p/${project}/health`}>See what is ready</Link>
                    </>
                  ) : (
                    "Every open task is waiting on something else."
                  )}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <section aria-label="Workload" className="panel rise min-w-0 p-6 xl:col-span-8" style={{ ["--i" as string]: 3 }}>
          <WorkloadChart items={o.workload} />
        </section>

        <div className="space-y-4 xl:col-span-4">
          <div className="grid grid-cols-2 gap-4">
            <StatTile tone="blue" value={o.total - o.byStatus.done} label="Open tasks" hint={`${o.ready.length} ready to start`} index={0} />
            {o.spend ? (
              <StatTile tone="teal" value={o.spend.usd} decimals={2} prefix="$" label="Spend" hint={`From the ${o.spend.basis}`} index={1} />
            ) : (
              <StatTile tone="teal" value={o.byStatus.done} label="Tasks done" hint={`${o.percentDone}% of ${o.total}`} index={1} />
            )}
          </div>

          <section aria-labelledby="ready" className="panel rise p-5" style={{ ["--i" as string]: 5 }}>
            <div className="mb-3 flex items-baseline justify-between">
              <h3 id="ready" className="font-display text-base font-semibold text-snow">Ready to start</h3>
              <Link href={`/p/${project}/health`} className="text-xs text-violet-hi hover:underline">All</Link>
            </div>
            {o.ready.length === 0 ? (
              <p className="text-sm text-dusk">Every open task is waiting on something else.</p>
            ) : (
              <ul className="space-y-1">
                {o.ready.slice(0, 4).map((t) => (
                  <li key={t.id}>
                    <Link href={`/p/${project}/tasks/${t.id}`} className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-night-4">
                      <Mascot role={t.owner} size={30} animate={false} />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-snow">{t.id}</span>
                        <span className="block truncate text-xs text-dusk">{t.title}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
