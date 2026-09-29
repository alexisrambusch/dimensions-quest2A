import type { Generator, GeneratedInstance, ValidationResult } from "../types";
import { seededRng, randInt, pick } from "../random";
import { validateNumeric } from "../numeric";

// Grade 1 (Dimensions Math 1A) foundational number sense: counting to 10,
// the number 0, ordering/sequencing, and comparing small quantities. All
// ranges here are deliberately tiny (0-10) — this is a child's first
// exposure to numbers, not a place-value chapter.

const COUNT_ITEMS: { icon: string; singular: string; plural: string }[] = [
  { icon: "apple", singular: "apple", plural: "apples" },
  { icon: "star", singular: "star", plural: "stars" },
  { icon: "flower", singular: "flower", plural: "flowers" },
  { icon: "egg", singular: "egg", plural: "eggs" },
  { icon: "book", singular: "book", plural: "books" },
  { icon: "cookie", singular: "cookie", plural: "cookies" },
  { icon: "crayon", singular: "crayon", plural: "crayons" },
  { icon: "car", singular: "car", plural: "cars" },
  { icon: "shoe", singular: "shoe", plural: "shoes" },
  { icon: "dog", singular: "dog", plural: "dogs" },
  { icon: "cat", singular: "cat", plural: "cats" },
  { icon: "bike", singular: "bike", plural: "bikes" },
  { icon: "grape", singular: "grape", plural: "grapes" },
  { icon: "strawberry", singular: "strawberry", plural: "strawberries" },
];

function countRangeForDifficulty(difficulty: number): [number, number] {
  if (difficulty <= 1) return [1, 5];
  if (difficulty <= 2) return [3, 6];
  if (difficulty <= 3) return [5, 8];
  if (difficulty <= 4) return [6, 9];
  return [8, 10];
}

/** "How many X are there?" — count a group of pictured objects, 0-10. */
export const countObjects: Generator = {
  id: "g1.count.objects",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const allowZero = !!params.allowZero;
    let [lo, hi] = countRangeForDifficulty(difficulty);
    if (typeof params.minCount === "number") lo = params.minCount as number;
    if (typeof params.maxCount === "number") hi = params.maxCount as number;
    const item = pick(rng, COUNT_ITEMS);

    if (allowZero && rng() < 0.25) {
      return {
        prompt: {
          view: "equalGroups",
          kind: "FILL_IN_BLANK",
          stage: "CONCRETE",
          text: `How many ${item.plural} are there?`,
          data: { groups: 1, perGroup: 0, itemIcon: item.icon },
        },
        answer: { value: 0, explanation: `There are 0 ${item.plural} — the plate is empty.` },
        meta: { count: 0 },
      };
    }

    const count = randInt(rng, lo, hi);
    const label = count === 1 ? item.singular : item.plural;
    return {
      prompt: {
        view: "equalGroups",
        kind: "FILL_IN_BLANK",
        stage: "CONCRETE",
        text: `How many ${label} are there?`,
        data: { groups: 1, perGroup: count, itemIcon: item.icon },
      },
      answer: { value: count, explanation: `Count each ${item.singular} one time: there are ${count}.` },
      meta: { count },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Count on or count back by 1 through a window of 0-10, one number hidden. */
export const numberSequenceToTen: Generator = {
  id: "g1.count.sequence",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const direction = (params.direction as "forward" | "backward" | undefined) ?? (rng() < 0.5 ? "forward" : "backward");
    const length = 5;
    const step = direction === "forward" ? 1 : -1;
    const start = direction === "forward" ? randInt(rng, 0, 10 - (length - 1)) : randInt(rng, length - 1, 10);
    const sequence = Array.from({ length }, (_, i) => start + i * step);
    const hiddenIndex = randInt(rng, 1, length - 2);
    const hiddenValue = sequence[hiddenIndex];
    const shown = sequence.map((v, i) => (i === hiddenIndex ? null : v));
    return {
      prompt: {
        view: "numberSequence",
        kind: "FILL_IN_BLANK",
        stage: "PICTORIAL",
        text: direction === "forward" ? "Count on. What number is missing?" : "Count back. What number is missing?",
        data: { shown, step },
      },
      answer: {
        value: hiddenValue,
        explanation: `Counting ${direction === "forward" ? "on" : "back"} by 1: ${sequence.join(", ")}.`,
      },
      meta: { sequence, direction },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Compare two pictured groups of objects (0-10) with <, >, =. */
export const compareGroups: Generator = {
  id: "g1.compare.groups",
  generate(seed): GeneratedInstance {
    const rng = seededRng(seed);
    const a = randInt(rng, 0, 10);
    let b = randInt(rng, 0, 10);
    if (rng() < 0.2) b = a;
    const item = pick(rng, COUNT_ITEMS);
    const symbol = a > b ? ">" : a < b ? "<" : "=";
    return {
      prompt: {
        view: "compareGroups",
        kind: "MULTIPLE_CHOICE",
        stage: "PICTORIAL",
        text: `Compare the two groups of ${item.plural}.`,
        data: { countA: a, countB: b, itemIcon: item.icon, choices: ["<", ">", "="] },
      },
      answer: { value: symbol, explanation: `${a} ${symbol} ${b}.` },
      meta: { a, b },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

export const grade1NumberGenerators = [countObjects, numberSequenceToTen, compareGroups];
