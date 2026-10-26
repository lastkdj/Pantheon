/** Small presentation helpers for agent roles and risk text. */

export function initials(role: string): string {
  const parts = role.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/** Stable hue per role name, so a role keeps the same seal everywhere. */
export function roleHue(role: string): number {
  let h = 0;
  for (const ch of role) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}

export type RiskLevel = "critical" | "high" | "medium" | "low";

/** Reads a leading "High:", "Medium", "Low." etc. from a free-text risk cell. */
export function riskLevel(text: string): RiskLevel | null {
  const m = text.trim().match(/^(critical|high|medium|low)\b/i);
  return m ? (m[1].toLowerCase() as RiskLevel) : null;
}
