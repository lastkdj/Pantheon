import { initials, roleHue } from "@/lib/roles";

/** Initials on a gradient. Same role, same colour, everywhere. */
export function Avatar({ role, size = 32 }: { role: string; size?: number }) {
  const h = roleHue(role);
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 select-none items-center justify-center rounded-full font-bold text-white"
      style={{
        width: size,
        height: size,
        fontSize: Math.max(10, size * 0.36),
        background: `linear-gradient(135deg, hsl(${h} 85% 58%), hsl(${(h + 45) % 360} 80% 42%))`,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
      }}
    >
      {initials(role)}
    </span>
  );
}
