import { CountUp } from "./CountUp";

type Tone = "magenta" | "cyan" | "mint" | "azure" | "coral";

const TONE: Record<Tone, { tile: string; bar: string; chip: string }> = {
  magenta: { tile: "from-[#C03CFF] to-[#7F23FD]", bar: "from-[#C03CFF] to-[#7F23FD]", chip: "bg-magenta/15 text-magenta-hi" },
  cyan: { tile: "from-[#02C3FF] to-[#2D5BFF]", bar: "from-[#02C3FF] to-[#2D5BFF]", chip: "bg-cyan/15 text-cyan" },
  mint: { tile: "from-[#2DD4A0] to-[#0A9495]", bar: "from-[#2DD4A0] to-[#0A9495]", chip: "bg-mint/15 text-mint" },
  azure: { tile: "from-[#7F9DFF] to-[#2D5BFF]", bar: "from-[#7F9DFF] to-[#2D5BFF]", chip: "bg-azure/20 text-azure-hi" },
  coral: { tile: "from-[#FF8A9E] to-[#E0334F]", bar: "from-[#FF8A9E] to-[#E0334F]", chip: "bg-coral/15 text-coral" },
};

export function KpiCard({
  icon,
  label,
  value,
  decimals = 0,
  prefix = "",
  chip,
  chipTone,
  fill,
  tone,
  index = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  chip: string;
  chipTone?: Tone;
  /** 0 to 1: how much of the thin bar under the value to fill. Omit for no bar. */
  fill?: number;
  tone: Tone;
  index?: number;
}) {
  const t = TONE[tone];
  const c = TONE[chipTone ?? tone];
  return (
    <div className="panel panel-hover rise relative min-w-0 overflow-hidden p-4 sm:p-5" style={{ ["--i" as string]: index }}>
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${t.tile} text-white`}>{icon}</span>
        <span className="min-w-0 text-sm font-semibold leading-tight text-mist">{label}</span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="text-[26px] font-extrabold leading-none tracking-tight text-snow sm:text-[32px]">
          <CountUp value={value} decimals={decimals} prefix={prefix} />
        </span>
        <span className={`rounded-md px-2 py-1 text-[11px] font-bold ${c.chip}`}>{chip}</span>
      </div>
      {fill !== undefined && (
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-night-2" aria-hidden="true">
          <div
            className={`h-full origin-left animate-grow rounded-full bg-gradient-to-r ${t.bar}`}
            style={{ width: `${Math.min(Math.max(fill, 0), 1) * 100}%`, animationDelay: `${300 + index * 90}ms` }}
          />
        </div>
      )}
    </div>
  );
}
