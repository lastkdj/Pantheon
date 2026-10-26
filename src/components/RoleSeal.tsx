import { initials, roleHue } from "@/lib/roles";

/** Round monogram for an agent role. Same role, same colour, everywhere. */
export function RoleSeal({ role, size = 28 }: { role: string; size?: number }) {
  const h = roleHue(role);
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full font-cinzel font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `hsl(${h} 32% 17%)`,
        color: `hsl(${h} 60% 74%)`,
        boxShadow: `inset 0 0 0 1px hsl(${h} 30% 32%)`,
      }}
    >
      {initials(role)}
    </span>
  );
}
