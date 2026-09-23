import type { Generator, GeneratedInstance, ValidationResult } from "../types";
import { seededRng, randInt } from "../random";
import { toNumber } from "../numeric";

function rangeForDifficulty(difficulty: number): { min: number; max: number; step: number } {
  if (difficulty <= 1) return { min: 0, max: 100, step: 10 };
  if (difficulty <= 3) return { min: 0, max: 1000, step: 100 };
  return { min: 0, max: 1000, step: 50 };
}

/** Place a number on a number line — builds a spatial sense of magnitude. */
export const numberLinePlace: Generator = {
  id: "numberline.place",
  generate(seed, difficulty): GeneratedInstance {
    const rng = seededRng(seed);
    const { min, max, step } = rangeForDifficulty(difficulty);
    // Keep the target off the very ends so the marker has room to miss in both directions.
    const target = randInt(rng, min + step, max - step);
    return {
      prompt: {
        view: "numberLine",
        kind: "NUMBER_LINE",
        stage: "PICTORIAL",
        text: `Tap the number line where ${target} belongs.`,
        data: { target, min, max, step },
      },
      answer: {
        value: target,
        explanation: `${target} sits between ${Math.floor(target / step) * step} and ${Math.ceil(target / step) * step} on the line.`,
      },
      meta: { target, min, max },
    };
  },
  validate(response, answer, meta): ValidationResult {
    const n = toNumber(response);
    if (n === null) return { correct: false, errorTag: "NO_RESPONSE" };
    const range = ((meta?.max as number) ?? 1000) - ((meta?.min as number) ?? 0);
    // Tolerance scales with the line's range so a pixel-precision miss on a
    // 0-1000 line isn't graded as harshly as one on a 0-100 line.
    const tolerance = Math.max(2, range * 0.03);
    const correct = Math.abs(n - (answer.value as number)) <= tolerance;
    return { correct };
  },
};

export const numberLineGenerators = [numberLinePlace];
