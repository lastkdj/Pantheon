import { CountUp } from "./CountUp";

/** Gradient tile with a soft wave, as in the reference. */
export function StatTile({
  tone,
  value,
  decimals = 0,
  prefix = "",
  label,
  hint,
  index = 0,
}: {
  tone: "blue" | "teal";
  value: number;
  decimals?: number;
  prefix?: string;
  label: string;
  hint: string;
  index?: number;
}) {
  const bg = tone === "blue" ? "from-[#2F63FF] to-azure shadow-glow-blue" : "from-[#13B3A6] to-teal shadow-glow-teal";
  return (
    <div
      className={`pop lift relative overflow-hidden rounded-3xl bg-gradient-to-br ${bg} p-5 text-white`}
      style={{ ["--i" as string]: index + 2 }}
    >
      <svg className="absolute inset-x-0 bottom-0 h-16 w-full opacity-25" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40C30 20 50 55 90 38S150 15 200 35V60H0Z" fill="#fff" fillOpacity="0.55" />
        <path d="M0 48C40 32 70 58 110 46S170 30 200 44V60H0Z" fill="#fff" fillOpacity="0.4" />
      </svg>
      <p className="relative font-display text-4xl font-semibold leading-none">
        <CountUp value={value} decimals={decimals} prefix={prefix} />
      </p>
      <p className="relative mt-2 text-sm font-semibold">{label}</p>
      <p className="relative mt-0.5 text-xs text-white/80">{hint}</p>
    </div>
  );
}
