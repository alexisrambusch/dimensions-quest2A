import type { Generator, GeneratedInstance, ValidationResult } from "../types";
import { seededRng, randInt } from "../random";
import { validateNumeric, toNumber } from "../numeric";

function rangeForDifficulty(difficulty: number): [number, number] {
  if (difficulty <= 1) return [11, 99]; // 2-digit warm-up
  if (difficulty <= 2) return [100, 399];
  if (difficulty <= 3) return [100, 699];
  return [100, 999];
}

function decompose(n: number) {
  return { hundreds: Math.floor(n / 100), tens: Math.floor((n % 100) / 10), ones: n % 10 };
}

/** "Build the number" with base-ten blocks, then type the numeral. */
export const placeValueBuild: Generator = {
  id: "placevalue.build",
  generate(seed, difficulty): GeneratedInstance {
    const rng = seededRng(seed);
    const [lo, hi] = rangeForDifficulty(difficulty);
    const target = randInt(rng, lo, hi);
    return {
      prompt: {
        view: "placeValueBuilder",
        kind: "BUILD_MODEL",
        stage: "CONCRETE",
        text: `Build ${target} using hundreds, tens, and ones blocks. What number did you build?`,
        data: { target, ...decompose(target) },
      },
      answer: {
        value: target,
        explanation: `${target} is made of ${decompose(target).hundreds} hundreds, ${decompose(target).tens} tens, and ${decompose(target).ones} ones.`,
      },
      meta: { target },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Decompose a shown numeral into hundreds/tens/ones (part-whole understanding). */
export const placeValueDecompose: Generator = {
  id: "placevalue.decompose",
  generate(seed, difficulty): GeneratedInstance {
    const rng = seededRng(seed);
    const [lo, hi] = rangeForDifficulty(difficulty);
    const target = randInt(rng, lo, hi);
    const d = decompose(target);
    return {
      prompt: {
        view: "placeValueChart",
        kind: "FILL_IN_BLANK",
        stage: "PICTORIAL",
        text: `${target} = ___ hundreds + ___ tens + ___ ones`,
        data: { target },
      },
      answer: {
        value: d,
        explanation: `${target} = ${d.hundreds} hundreds + ${d.tens} tens + ${d.ones} ones.`,
      },
      meta: { target },
    };
  },
  validate(response, answer): ValidationResult {
    if (typeof response !== "object" || response === null) return { correct: false, errorTag: "NO_RESPONSE" };
    const r = response as Record<string, unknown>;
    const expected = answer.value as { hundreds: number; tens: number; ones: number };
    const correct =
      toNumber(r.hundreds) === expected.hundreds &&
      toNumber(r.tens) === expected.tens &&
      toNumber(r.ones) === expected.ones;
    return { correct };
  },
};

/** Compare two numbers with <, >, =. */
export const compareNumbers: Generator = {
  id: "compare.numbers",
  generate(seed, difficulty): GeneratedInstance {
    const rng = seededRng(seed);
    const [lo, hi] = rangeForDifficulty(difficulty);
    let a = randInt(rng, lo, hi);
    let b = randInt(rng, lo, hi);
    if (rng() < 0.15) b = a; // sometimes equal, to test the "=" case
    const symbol = a > b ? ">" : a < b ? "<" : "=";
    return {
      prompt: {
        view: "compareNumbers",
        kind: "MULTIPLE_CHOICE",
        stage: "PICTORIAL",
        text: `${a} ___ ${b}`,
        data: { a, b, choices: ["<", ">", "="] },
      },
      answer: {
        value: symbol,
        explanation: `${a} ${symbol} ${b}.`,
      },
      meta: { a, b },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

/** Order 3-4 numbers ascending. */
export const orderNumbers: Generator = {
  id: "order.numbers",
  generate(seed, difficulty): GeneratedInstance {
    const rng = seededRng(seed);
    const [lo, hi] = rangeForDifficulty(difficulty);
    const count = difficulty <= 2 ? 3 : 4;
    const nums = new Set<number>();
    while (nums.size < count) nums.add(randInt(rng, lo, hi));
    const values = Array.from(nums);
    const sorted = [...values].sort((x, y) => x - y);
    return {
      prompt: {
        view: "sortNumbers",
        kind: "SORT_ORDER",
        stage: "ABSTRACT",
        text: `Drag the numbers into order from least to greatest.`,
        data: { values },
      },
      answer: {
        value: sorted,
        explanation: `Ascending order: ${sorted.join(", ")}.`,
      },
      meta: { values },
    };
  },
  validate(response, answer): ValidationResult {
    if (!Array.isArray(response)) return { correct: false, errorTag: "NO_RESPONSE" };
    const expected = answer.value as number[];
    const correct = response.length === expected.length && response.every((v, i) => toNumber(v) === expected[i]);
    return { correct };
  },
};

/** Skip-counting pattern: fill the missing number in a sequence of 5. */
export const skipCountPattern: Generator = {
  id: "pattern.skipcount",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const step = (params.step as number | undefined) ?? (rng() < 0.5 ? 10 : 100);
    const maxStart = step === 10 ? 600 : 400;
    const start = randInt(rng, 0, Math.floor(maxStart / step)) * step;
    const sequence = Array.from({ length: 5 }, (_, i) => start + i * step);
    const hiddenIndex = randInt(rng, 1, 3); // never hide the first or last, so direction is clear
    const hiddenValue = sequence[hiddenIndex];
    const shown = sequence.map((v, i) => (i === hiddenIndex ? null : v));
    return {
      prompt: {
        view: "numberSequence",
        kind: "FILL_IN_BLANK",
        stage: "PICTORIAL",
        text: `What number is missing? Counting by ${step}s.`,
        data: { shown, step },
      },
      answer: {
        value: hiddenValue,
        explanation: `Counting by ${step}s: ${sequence.join(", ")}.`,
      },
      meta: { sequence, step },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

export const placeValueGenerators = [
  placeValueBuild,
  placeValueDecompose,
  compareNumbers,
  orderNumbers,
  skipCountPattern,
];
