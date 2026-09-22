import type { Generator, GeneratedInstance, ValidationResult } from "../types";
import { seededRng, randInt, pick } from "../random";
import { pickContext } from "../contexts";
import { multFactKey } from "../facts";
import { validateNumeric } from "../numeric";

function difficultyRange(difficulty: number): [number, number] {
  if (difficulty <= 1) return [1, 5];
  if (difficulty <= 3) return [1, 9];
  return [1, 12]; // stretch beyond the core 1-9 table for advanced learners
}

/** Lesson: "The Multiplication Table of N" — build equal groups, watch the product grow. */
export const multTable: Generator = {
  id: "mult.table",
  generate(seed, difficulty, params): GeneratedInstance {
    const factor = params.factor as number;
    const rng = seededRng(seed);
    const [lo, hi] = difficultyRange(difficulty);
    const groups = randInt(rng, lo, hi);
    const product = groups * factor;
    return {
      prompt: {
        view: "equalGroups",
        kind: "ARRAY_VISUAL",
        stage: "PICTORIAL",
        text: `Build ${groups} group${groups === 1 ? "" : "s"} of ${factor}. How many in all?`,
        data: { groups, perGroup: factor },
      },
      answer: {
        value: product,
        explanation: `${groups} groups of ${factor} is ${groups} × ${factor} = ${product}.`,
        facts: [multFactKey(groups, factor)],
      },
      meta: { a: groups, b: factor, op: "x" },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Lesson: "Multiplication Facts of N" — abstract a×N / N×a, commutative property. */
export const multFact: Generator = {
  id: "mult.fact",
  generate(seed, difficulty, params): GeneratedInstance {
    const factor = params.factor as number;
    const rng = seededRng(seed);
    const [lo, hi] = difficultyRange(difficulty);
    const a = randInt(rng, lo, hi);
    const factorFirst = rng() < 0.5;
    const left = factorFirst ? factor : a;
    const right = factorFirst ? a : factor;
    const product = a * factor;
    return {
      prompt: {
        view: "equation",
        kind: "FILL_IN_BLANK",
        stage: "ABSTRACT",
        text: `${left} × ${right} = ?`,
        data: { left, right, op: "x" },
      },
      answer: {
        value: product,
        explanation: `${left} × ${right} = ${product}.`,
        facts: [multFactKey(left, right)],
      },
      meta: { a: left, b: right, op: "x" },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Lesson: "Arrays" — the same product read as rows × columns rather than separate groups. */
export const multArray: Generator = {
  id: "mult.array",
  generate(seed, difficulty, params): GeneratedInstance {
    const factor = params.factor as number;
    const rng = seededRng(seed);
    const [lo, hi] = difficultyRange(difficulty);
    const rows = randInt(rng, lo, hi);
    const product = rows * factor;
    return {
      prompt: {
        view: "arrayGrid",
        kind: "ARRAY_VISUAL",
        stage: "PICTORIAL",
        text: `This array has ${rows} rows of ${factor}. How many in all?`,
        data: { rows, cols: factor },
      },
      answer: {
        value: product,
        explanation: `${rows} rows × ${factor} columns = ${rows} × ${factor} = ${product}.`,
        facts: [multFactKey(rows, factor)],
      },
      meta: { a: rows, b: factor, op: "x" },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Multiplication word problem: equal groups, "N bags of K apples." */
export const multWordProblem: Generator = {
  id: "mult.wordproblem",
  generate(seed, difficulty, params): GeneratedInstance {
    const factor = params.factor as number;
    const rng = seededRng(seed);
    const [lo, hi] = difficultyRange(difficulty);
    const groups = randInt(rng, lo, hi);
    const ctx = pickContext(rng);
    const product = groups * factor;
    return {
      prompt: {
        view: "barModelMultiplication",
        kind: "WORD_PROBLEM",
        stage: "PICTORIAL",
        text: `There are ${groups} ${ctx.containerPlural}. Each ${ctx.container} has ${factor} ${ctx.itemPlural}. How many ${ctx.itemPlural} are there altogether?`,
        data: { groups, perGroup: factor, unit: ctx.itemPlural, container: ctx.containerPlural },
      },
      answer: {
        value: product,
        explanation: `${groups} × ${factor} = ${product} ${ctx.itemPlural}.`,
        facts: [multFactKey(groups, factor)],
      },
      meta: { a: groups, b: factor, op: "x" },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** "Find the mistake" — surface the addition-instead-of-multiplication misconception directly. */
export const multFindMistake: Generator = {
  id: "mult.findmistake",
  generate(seed, difficulty, params): GeneratedInstance {
    const factor = params.factor as number;
    const rng = seededRng(seed);
    const [lo, hi] = difficultyRange(difficulty);
    const a = Math.max(2, randInt(rng, lo, hi));
    const correct = a * factor;
    const wrongAsAddition = a + factor;
    const shownAnswer = pick(rng, [correct, wrongAsAddition]);
    const isWrong = shownAnswer !== correct;
    return {
      prompt: {
        view: "findMistake",
        kind: "FIND_THE_MISTAKE",
        stage: "ABSTRACT",
        text: `A friend says ${a} × ${factor} = ${shownAnswer}. Are they right?`,
        data: { a, b: factor, shownAnswer },
      },
      answer: {
        value: !isWrong,
        explanation: isWrong
          ? `${a} × ${factor} means ${a} groups of ${factor}, which is ${correct}, not ${shownAnswer}.`
          : `That's correct: ${a} × ${factor} = ${correct}.`,
        facts: [multFactKey(a, factor)],
      },
      meta: { a, b: factor, op: "x", shownAnswer, correct },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

export const multiplicationGenerators = [multTable, multArray, multFact, multWordProblem, multFindMistake];
