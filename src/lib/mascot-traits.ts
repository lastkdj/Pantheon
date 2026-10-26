/** Deterministic look of a role's creature. Pure, so it can be tested. */

export const PALETTE_COUNT = 8;
export const BODY_COUNT = 4;
export const EYE_COUNT = 3;
export const EXTRA_COUNT = 3;
export const MOUTH_COUNT = 3;

/** FNV-1a with a final avalanche, so nearby role names get unrelated looks. Always unsigned. */
export function hashRole(role: string): number {
  let h = 2166136261;
  for (let i = 0; i < role.length; i++) {
    h ^= role.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 15;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;
  return h >>> 0;
}

export interface MascotTraits {
  palette: number;
  body: number;
  eyes: number;
  extra: number;
  mouth: number;
  /** Animation offset in seconds, so a row of creatures does not move in lockstep. */
  delay: number;
}

export function mascotTraits(role: string): MascotTraits {
  const h = hashRole(role);
  return {
    palette: h % PALETTE_COUNT,
    body: (h >>> 4) % BODY_COUNT,
    eyes: (h >>> 7) % EYE_COUNT,
    extra: (h >>> 10) % EXTRA_COUNT,
    mouth: (h >>> 13) % MOUTH_COUNT,
    delay: -((h >>> 16) % 30) / 10,
  };
}
