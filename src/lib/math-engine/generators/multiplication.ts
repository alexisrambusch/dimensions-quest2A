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

/** True/false claim about the commutative property — catches "swapping the numbers always works" applied carelessly to the wrong pair. */
export const multCommutativeClaim: Generator = {
  id: "mult.commutativeclaim",
  generate(seed, difficulty, params): GeneratedInstance {
    const factor = params.factor as number;
    const rng = seededRng(seed);
    const [lo, hi] = difficultyRange(difficulty);
    const a = randInt(rng, lo, hi);
    const isTrue = rng() < 0.5;
    let wrongPartner = factor + (rng() < 0.5 ? 1 : 2);
    if (wrongPartner === factor) wrongPartner += 1;
    const rightFactor = isTrue ? factor : wrongPartner;
    const text = `${a} × ${factor} = ${rightFactor} × ${a}. Is this correct?`;
    return {
      prompt: {
        view: "findMistake",
        kind: "FIND_THE_MISTAKE",
        stage: "ABSTRACT",
        text,
        data: {},
      },
      answer: {
        value: isTrue,
        explanation: `${a} × ${factor} and ${factor} × ${a} always give the same product — that's the commutative property. Swapping in a different number changes the answer.`,
      },
      meta: { a, factor, wrongPartner, isTrue },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

/** "Would you multiply or divide?" — tests recognizing the structure of a problem before any computing happens. */
export const multDivChooseOperation: Generator = {
  id: "multdiv.chooseoperation",
  generate(seed, difficulty, params): GeneratedInstance {
    const factor = params.factor as number;
    const rng = seededRng(seed);
    const [lo, hi] = difficultyRange(difficulty);
    const a = randInt(rng, lo, hi);
    const ctx = pickContext(rng);
    const isMultiply = rng() < 0.5;
    const text = isMultiply
      ? `There are ${a} ${ctx.containerPlural}. Each ${ctx.container} has ${factor} ${ctx.itemPlural}. Would you multiply or divide to find the total number of ${ctx.itemPlural}?`
      : `There are ${a * factor} ${ctx.itemPlural} shared equally among ${factor} ${ctx.containerPlural}. Would you multiply or divide to find how many ${ctx.itemPlural} are in each ${ctx.container}?`;
    const answerValue = isMultiply ? "multiply" : "divide";
    return {
      prompt: {
        view: "chooseUnit",
        kind: "MULTIPLE_CHOICE",
        stage: "ABSTRACT",
        text,
        data: { choices: ["multiply", "divide"] },
      },
      answer: {
        value: answerValue,
        explanation: isMultiply
          ? `You know the number of groups and the size of each group, so multiply to find the total.`
          : `You know the total and the number of groups, so divide to find the size of each group.`,
      },
      meta: { isMultiply, a, factor },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

/** "N × factor is ___ more than (N-1) × factor" or the inverse — relates neighboring rows of a times table instead of recalling each in isolation. */
export const multRelateProduct: Generator = {
  id: "mult.relateproduct",
  generate(seed, difficulty, params): GeneratedInstance {
    const factor = params.factor as number;
    const rng = seededRng(seed);
    const [lo, hi] = difficultyRange(difficulty);
    const a = randInt(rng, Math.max(lo, 2), Math.max(hi, 3));
    const askDelta = rng() < 0.5;
    if (askDelta) {
      return {
        prompt: {
          view: "numericAnswer",
          kind: "FILL_IN_BLANK",
          stage: "ABSTRACT",
          text: `${a} × ${factor} is ___ more than ${a - 1} × ${factor}.`,
          data: {},
        },
        answer: { value: factor, explanation: `Each extra group of ${factor} adds ${factor}, so ${a} × ${factor} is ${factor} more than ${a - 1} × ${factor}.` },
        meta: { a, factor },
      };
    }
    return {
      prompt: {
        view: "numericAnswer",
        kind: "FILL_IN_BLANK",
        stage: "ABSTRACT",
        text: `${a} × ${factor} is ${factor} more than ___ × ${factor}.`,
        data: {},
      },
      answer: { value: a - 1, explanation: `${a} × ${factor} is one more group of ${factor} than ${a - 1} × ${factor}.` },
      meta: { a, factor },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

export const multiplicationGenerators = [
  multTable,
  multArray,
  multFact,
  multWordProblem,
  multFindMistake,
  multCommutativeClaim,
  multDivChooseOperation,
  multRelateProduct,
];
