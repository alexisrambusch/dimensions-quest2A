import type { Generator, GeneratedInstance, ValidationResult } from "../types";
import { seededRng, randInt, pick } from "../random";
import { pickContext } from "../contexts";
import { divFactKey, multFactKey } from "../facts";
import { validateNumeric } from "../numeric";

function difficultyRange(difficulty: number): [number, number] {
  if (difficulty <= 1) return [1, 5];
  if (difficulty <= 3) return [1, 9];
  return [1, 12];
}

/** "Relate division facts for N to multiplication facts for N" — shown side by side. */
export const divFromMult: Generator = {
  id: "div.frommult",
  generate(seed, difficulty, params): GeneratedInstance {
    const factor = params.factor as number;
    const rng = seededRng(seed);
    const [lo, hi] = difficultyRange(difficulty);
    const a = randInt(rng, lo, hi);
    const product = a * factor;
    return {
      prompt: {
        view: "factFamilyDivide",
        kind: "FILL_IN_BLANK",
        stage: "PICTORIAL",
        text: `You know ${factor} × ${a} = ${product}. So ${product} ÷ ${factor} = ?`,
        data: { knownA: factor, knownB: a, product, divisor: factor },
      },
      answer: {
        value: a,
        explanation: `Since ${factor} × ${a} = ${product}, then ${product} ÷ ${factor} = ${a}.`,
        facts: [divFactKey(product, factor), multFactKey(factor, a)],
      },
      meta: { a: product, b: factor, op: "d" },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Abstract division fact drill for ÷2, ÷5, ÷10. */
export const divFact: Generator = {
  id: "div.fact",
  generate(seed, difficulty, params): GeneratedInstance {
    const factor = params.factor as number;
    const rng = seededRng(seed);
    const [lo, hi] = difficultyRange(difficulty);
    const a = randInt(rng, lo, hi);
    const dividend = a * factor;
    return {
      prompt: {
        view: "equation",
        kind: "FILL_IN_BLANK",
        stage: "ABSTRACT",
        text: `${dividend} ÷ ${factor} = ?`,
        data: { left: dividend, right: factor, op: "d" },
      },
      answer: {
        value: a,
        explanation: `${dividend} ÷ ${factor} = ${a}, because ${factor} × ${a} = ${dividend}.`,
        facts: [divFactKey(dividend, factor)],
      },
      meta: { a: dividend, b: factor, op: "d" },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Partitive division word problem: total & number of groups known, find size of each group. */
export const divWordProblemPartitive: Generator = {
  id: "div.wordproblem.partitive",
  generate(seed, difficulty, params): GeneratedInstance {
    const factor = params.factor as number;
    const rng = seededRng(seed);
    const [lo, hi] = difficultyRange(difficulty);
    const a = randInt(rng, lo, hi);
    const total = a * factor;
    const ctx = pickContext(rng);
    return {
      prompt: {
        view: "barModelDivision",
        kind: "WORD_PROBLEM",
        stage: "PICTORIAL",
        text: `${total} ${ctx.itemPlural} are shared equally among ${factor} children. How many ${ctx.itemPlural} does each child get?`,
        data: { total, groups: factor, mode: "partitive", unit: ctx.itemPlural },
      },
      answer: {
        value: a,
        explanation: `${total} ÷ ${factor} = ${a} ${ctx.itemPlural} each.`,
        facts: [divFactKey(total, factor)],
      },
      meta: { a: total, b: factor, op: "d", divisionType: "partitive" },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Measurement division word problem: total & group size known, find number of groups. */
export const divWordProblemMeasurement: Generator = {
  id: "div.wordproblem.measurement",
  generate(seed, difficulty, params): GeneratedInstance {
    const factor = params.factor as number;
    const rng = seededRng(seed);
    const [lo, hi] = difficultyRange(difficulty);
    const a = randInt(rng, lo, hi);
    const total = a * factor;
    const ctx = pickContext(rng);
    return {
      prompt: {
        view: "barModelDivision",
        kind: "WORD_PROBLEM",
        stage: "PICTORIAL",
        text: `There are ${total} ${ctx.itemPlural}. Each ${ctx.container} holds ${factor} ${ctx.itemPlural}. How many ${ctx.containerPlural} can we make?`,
        data: { total, perGroup: factor, mode: "measurement", unit: ctx.itemPlural, container: ctx.containerPlural },
      },
      answer: {
        value: a,
        explanation: `${total} ÷ ${factor} = ${a} ${ctx.containerPlural}.`,
        facts: [divFactKey(total, factor)],
      },
      meta: { a: total, b: factor, op: "d", divisionType: "measurement" },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** "Find the mistake" — surfaces the divide-as-subtract misconception (total minus divisor, instead of splitting into equal groups). */
export const divFindMistake: Generator = {
  id: "div.findmistake",
  generate(seed, difficulty, params): GeneratedInstance {
    const factor = params.factor as number;
    const rng = seededRng(seed);
    const [lo, hi] = difficultyRange(difficulty);
    const a = Math.max(2, randInt(rng, lo, hi));
    const total = a * factor;
    const correct = a;
    const wrongAsSubtraction = Math.max(0, total - factor);
    const shownAnswer = pick(rng, [correct, wrongAsSubtraction]);
    const isWrong = shownAnswer !== correct;
    return {
      prompt: {
        view: "findMistake",
        kind: "FIND_THE_MISTAKE",
        stage: "ABSTRACT",
        text: `A friend says ${total} ÷ ${factor} = ${shownAnswer}. Are they right?`,
        data: {},
      },
      answer: {
        value: !isWrong,
        explanation: isWrong
          ? `${total} ÷ ${factor} means splitting ${total} into groups of ${factor}, which gives ${correct}, not ${shownAnswer}.`
          : `That's correct: ${total} ÷ ${factor} = ${correct}.`,
      },
      meta: { a: total, b: factor, op: "d", shownAnswer, correct },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

export const divisionGenerators = [
  divFromMult,
  divFact,
  divWordProblemPartitive,
  divWordProblemMeasurement,
  divFindMistake,
];
