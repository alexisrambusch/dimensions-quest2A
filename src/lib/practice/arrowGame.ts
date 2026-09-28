import { randInt, pick } from "./rand";

export const ARROW_DELTAS: Record<string, number> = {
  "→": 1,
  "←": -1,
  "↑": -10,
  "↓": 10,
  "↘": 11,
  "↙": 9,
  "↖": -11,
  "↗": -9,
};

const ARROWS = Object.keys(ARROW_DELTAS);

export interface ArrowProblem {
  start: number;
  arrows: string[];
  end: number;
  mode: "findEnd" | "findStart";
}

/** Generates a random arrow-chain problem that stays on the 1-100 hundred chart at every step. */
export function generateArrowProblem(): ArrowProblem {
  for (let attempt = 0; attempt < 100; attempt++) {
    const start = randInt(1, 100);
    const count = randInt(3, 6);
    const arrows: string[] = [];
    let pos = start;
    let valid = true;
    for (let i = 0; i < count; i++) {
      const arrow = pick(ARROWS);
      pos += ARROW_DELTAS[arrow];
      if (pos < 1 || pos > 100) {
        valid = false;
        break;
      }
      arrows.push(arrow);
    }
    if (valid) {
      const mode = Math.random() < 0.5 ? "findEnd" : "findStart";
      return { start, arrows, end: pos, mode };
    }
  }
  // Fallback — a single safe step, should never realistically be reached.
  return { start: 50, arrows: ["→"], end: 51, mode: "findEnd" };
}
