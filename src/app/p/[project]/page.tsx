import Link from "next/link";
import { notFound } from "next/navigation";
import { RoleSeal } from "@/components/RoleSeal";
import { StatusBar } from "@/components/StatusBar";
import { getLoaded } from "@/lib/cached";
import { riskLevel } from "@/lib/roles";
import { overview } from "@/lib/stats";

export const metadata = { title: "Overview" };

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n).trimEnd()}…` : s);

const RISK_TEXT = { critical: "text-oxblood", high: "text-oxblood", medium: "text-bronze-hi", low: "text-verdigris" } as const;

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
  const quiet = waiting === 0 && o.inReview.length === 0 && o.blocked.length === 0;

  return (
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0 space-y-10">
        <header>
          <p className="text-sm text-ash">{loaded.project.name}</p>
          <h1 className="mt-1 text-3xl leading-tight sm:text-4xl">{headline}</h1>
          {!quiet && (
            <p className="mt-3 max-w-xl text-stone">
              Decisions come first, then work ready for your review, then anything stuck.
            </p>
          )}
        </header>

        {quiet && (
          <div className="panel p-6">
            <p className="text-marble">All quiet.</p>
            <p className="mt-1 text-sm text-stone">
              {o.ready.length > 0 ? (
                <>
                  {plural(o.ready.length, "task")} can start now.{" "}
                  <Link className="text-bronze-hi underline-offset-4 hover:underline" href={`/p/${project}/health`}>See what is ready</Link>
                </>
              ) : (
                "Every open task is waiting on something else."
              )}
            </p>
          </div>
        )}

        {waiting > 0 && (
          <section aria-labelledby="decisions">
            <h2 id="decisions" className="mb-3 text-xl">Decisions</h2>
            <ul className="ledger panel">
              {o.pendingApprovals.map((a) => {
                const level = riskLevel(a.risk);
                return (
                  <li key={a.id}>
                    <Link href={`/p/${project}/approvals`} className="block px-4 py-4 hover:bg-ink-3">
                      <div className="flex items-baseline gap-3">
                        <span className="text-sm font-semibold text-bronze">{a.id}</span>
                        {level && <span className={`text-xs font-medium ${RISK_TEXT[level]}`}>{level[0].toUpperCase() + level.slice(1)} risk</span>}
                      </div>
                      <p className="mt-1 text-marble">{clip(a.action, 180)}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {o.inReview.length > 0 && (
          <section aria-labelledby="review">
            <h2 id="review" className="mb-3 text-xl">Ready to review</h2>
            <ul className="ledger panel">
              {o.inReview.map((t) => (
                <li key={t.id}>
                  <Link href={`/p/${project}/tasks/${t.id}`} className="flex items-start gap-3 px-4 py-4 hover:bg-ink-3">
                    <RoleSeal role={t.owner} />
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-3">
                        <span className="text-sm font-semibold text-bronze">{t.id}</span>
                        {t.pr && <span className="text-xs text-bronze-hi">PR {t.pr.number}</span>}
                      </div>
                      <p className="mt-0.5 text-marble">{clip(t.title, 160)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {o.blocked.length > 0 && (
          <section aria-labelledby="blocked">
            <h2 id="blocked" className="mb-3 text-xl">Blocked</h2>
            <ul className="ledger panel">
              {o.blocked.map((t) => (
                <li key={t.id}>
                  <Link href={`/p/${project}/tasks/${t.id}`} className="flex items-start gap-3 px-4 py-4 hover:bg-ink-3">
                    <RoleSeal role={t.owner} />
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-bronze">{t.id}</span>
                      <p className="mt-0.5 text-marble">{clip(t.title, 140)}</p>
                      {t.notes && <p className="mt-1 text-sm text-ash">{clip(t.notes, 140)}</p>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <aside className="min-w-0 space-y-8 xl:border-l xl:border-line xl:pl-8" aria-label="Project summary">
        <section aria-labelledby="progress">
          <h2 id="progress" className="mb-3 text-lg">Progress</h2>
          <p className="mb-3 text-sm text-stone">
            <span className="text-2xl font-semibold text-marble">{o.percentDone}%</span> of {plural(o.total, "task")} done
          </p>
          <StatusBar counts={o.byStatus} total={o.total} />
        </section>

        <section aria-labelledby="who">
          <h2 id="who" className="mb-3 text-lg">Who is working</h2>
          <ul className="space-y-3">
            {o.workload.map((w) => (
              <li key={w.owner} className="flex items-center gap-3">
                <RoleSeal role={w.owner} size={30} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-marble">{w.owner}</p>
                  <p className="text-xs text-ash">
                    {w.open} open{w.inProgress > 0 ? `, ${w.inProgress} in progress` : ""}, {w.done} done
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {o.spend && (
          <section aria-labelledby="spend">
            <h2 id="spend" className="mb-3 text-lg">Spend</h2>
            <p className="text-2xl font-semibold text-marble">${o.spend.usd.toFixed(2)}</p>
            <p className="mt-1 text-xs text-ash">From the {o.spend.basis} in the usage file.</p>
            <Link href={`/p/${project}/costs`} className="mt-2 inline-block text-sm text-bronze-hi underline-offset-4 hover:underline">
              See the breakdown
            </Link>
          </section>
        )}
      </aside>
    </div>
  );
}
