import type { Generator, GeneratedInstance, ValidationResult } from "../types";
import { seededRng, randInt, shuffle } from "../random";

// PreK (age ~4) foundational number sense: matching a small counted quantity
// to its written numeral, and telling which of two quantities is more or
// fewer. Both reuse the same emoji-free ten-frame used elsewhere in the app
// — reliable rendering matters even more for a first-time reader who can't
// sound out a broken picture — and both answer by tapping a big button
// rather than typing, since free-text entry is too fine-motor-heavy for a
// 4-year-old who may not yet recognize a number pad.

/** Show a counted quantity (as a ten-frame) and ask the student to tap the matching numeral. `params.min`/`max` bound the target (default 1-10). */
export const numeralMatch: Generator = {
  id: "prek.numeral.match",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const min = typeof params.min === "number" ? (params.min as number) : 1;
    const max = typeof params.max === "number" ? (params.max as number) : 10;
    const target = randInt(rng, min, max);

    const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i).filter((n) => n !== target);
    const distractors = shuffle(rng, pool).slice(0, 2);
    const choices = shuffle(rng, [target, ...distractors]).map(String);

    return {
      prompt: {
        view: "quantityNumeralChoice",
        kind: "MULTIPLE_CHOICE",
        stage: "CONCRETE",
        text: "Count the dots. Tap the number that matches.",
        data: { count: target, choices },
      },
      answer: { value: String(target), explanation: `There are ${target} dots, so the answer is ${target}.` },
      meta: { target },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

/** Two ten-frame quantities side by side — tap the one with more (or fewer). `params.min`/`max` bound both quantities (default 1-10); `params.askFor` forces "more" or "fewer" (default random). */
export const compareQuantities: Generator = {
  id: "prek.compare.quantities",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const min = typeof params.min === "number" ? (params.min as number) : 1;
    const max = typeof params.max === "number" ? (params.max as number) : 10;
    const askFor = (params.askFor as "more" | "fewer" | undefined) ?? (rng() < 0.5 ? "more" : "fewer");

    const a = randInt(rng, min, max);
    let b = randInt(rng, min, max);
    while (b === a) b = randInt(rng, min, max);

    const correctSide = askFor === "more" ? (a > b ? "A" : "B") : a < b ? "A" : "B";
    const correctCount = correctSide === "A" ? a : b;

    return {
      prompt: {
        view: "quantityCompare",
        kind: "MULTIPLE_CHOICE",
        stage: "CONCRETE",
        text: askFor === "more" ? "Tap the group with more." : "Tap the group with fewer.",
        data: { countA: a, countB: b },
      },
      answer: {
        value: correctSide,
        explanation: `The first group has ${a} and the second has ${b}, so the group with ${askFor} is the one with ${correctCount}.`,
      },
      meta: { a, b, askFor },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

export const prekNumberGenerators = [numeralMatch, compareQuantities];
