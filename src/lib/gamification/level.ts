// Pure functions, no Prisma dependency, so both server actions and page
// components can compute a level/progress display from a raw XP number.

export const XP_PER_LEVEL = 100;
export const COINS_PER_LEVEL = 20;

export function levelForXp(xp: number): number {
  return Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1;
}

/** XP earned within the current level, for a progress bar. */
export function xpIntoLevel(xp: number): number {
  return Math.max(0, xp) % XP_PER_LEVEL;
}
