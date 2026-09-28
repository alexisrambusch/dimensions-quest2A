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

/** Related facts from one array: rows×cols, cols×rows, or either related division fact — same
 * picture, four possible framings, picked at random so practice cycles through all of them. */
export const divArrayFamily: Generator = {
  id: "div.arrayfamily",
  generate(seed, difficulty, params): GeneratedInstance {
    const factor = params.factor as number;
    const rng = seededRng(seed);
    const [lo, hi] = difficultyRange(difficulty);
    const rows = Math.max(2, randInt(rng, lo, hi));
    const cols = factor;
    const product = rows * cols;
    const mode = pick(rng, ["rowsTimesCols", "colsTimesRows", "divByRows", "divByCols"] as const);

    let text: string;
    let value: number;
    let explanation: string;
    switch (mode) {
      case "rowsTimesCols":
        text = `This array has ${rows} rows of ${cols}. What is ${rows} × ${cols}?`;
        value = product;
        explanation = `${rows} rows × ${cols} columns = ${rows} × ${cols} = ${product}.`;
        break;
      case "colsTimesRows":
        text = `This array has ${rows} rows of ${cols}. What is ${cols} × ${rows}?`;
        value = product;
        explanation = `Multiplication is commutative, so ${cols} × ${rows} = ${rows} × ${cols} = ${product}.`;
        break;
      case "divByRows":
        text = `This array has ${rows} rows and ${cols} columns, ${product} dots in all. What is ${product} ÷ ${rows}?`;
        value = cols;
        explanation = `Splitting ${product} evenly into ${rows} rows gives ${cols} in each row, so ${product} ÷ ${rows} = ${cols}.`;
        break;
      case "divByCols":
        text = `This array has ${rows} rows and ${cols} columns, ${product} dots in all. What is ${product} ÷ ${cols}?`;
        value = rows;
        explanation = `Splitting ${product} evenly into ${cols} columns gives ${rows} in each column, so ${product} ÷ ${cols} = ${rows}.`;
        break;
    }

    return {
      prompt: {
        view: "arrayGrid",
        kind: "ARRAY_VISUAL",
        stage: "PICTORIAL",
        text,
        data: { rows, cols },
      },
      answer: {
        value,
        explanation,
        facts: [multFactKey(rows, cols), multFactKey(cols, rows), divFactKey(product, rows), divFactKey(product, cols)],
      },
      meta: { rows, cols, product, mode },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

function remainderRanges(difficulty: number): { groupsMax: number; baseMax: number } {
  if (difficulty <= 1) return { groupsMax: 4, baseMax: 4 };
  if (difficulty <= 3) return { groupsMax: 6, baseMax: 6 };
  return { groupsMax: 9, baseMax: 9 };
}

/** "Division as sharing" with leftovers — asks specifically for the remainder, computed via real
 * division (never picked arbitrarily), and biased toward a genuine non-zero remainder. */
export const divRemainder: Generator = {
  id: "div.remainder",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const { groupsMax, baseMax } = remainderRanges(difficulty);
    const groups = randInt(rng, 2, groupsMax);
    const base = randInt(rng, 1, baseMax);
    const wantsRemainder = rng() < 0.7; // at least half the time, force a genuine leftover
    const extra = wantsRemainder ? randInt(rng, 1, groups - 1) : 0;
    const total = base * groups + extra;
    const quotient = Math.floor(total / groups);
    const remainder = total % groups;
    const ctx = pickContext(rng);
    return {
      prompt: {
        view: "numericAnswer",
        kind: "WORD_PROBLEM",
        stage: "ABSTRACT",
        text: `${total} ${ctx.itemPlural} are shared as equally as possible among ${groups} ${ctx.containerPlural}, with as few ${ctx.itemPlural} left over as possible. How many ${ctx.itemPlural} are left over?`,
        data: { total, groups, unit: ctx.itemPlural },
      },
      answer: {
        value: remainder,
        explanation: `${total} ÷ ${groups} = ${quotient} remainder ${remainder}, since ${groups} × ${quotient} = ${groups * quotient} and ${total} − ${groups * quotient} = ${remainder}.`,
      },
      meta: { total, groups, quotient, remainder },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

function twoStepRanges(difficulty: number): { perGroupMax: number; fullGroupsMax: number } {
  return difficulty >= 5 ? { perGroupMax: 9, fullGroupsMax: 8 } : { perGroupMax: 6, fullGroupsMax: 5 };
}

/** Two-step challenge: multiply to find a current total, add more, then divide to find the new
 * total number of complete groups — a genuine multi-step reasoning chain, single numeric answer. */
export const divTwoStepChallenge: Generator = {
  id: "div.twostep",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const { perGroupMax, fullGroupsMax } = twoStepRanges(difficulty);
    const perGroup = randInt(rng, 3, perGroupMax);
    const fullGroups = randInt(rng, 2, fullGroupsMax);
    const extra = randInt(rng, perGroup + 1, perGroup * 3); // guarantees at least one new full group
    const startingTotal = fullGroups * perGroup;
    const newTotal = startingTotal + extra;
    const newFullGroups = Math.floor(newTotal / perGroup);
    const leftover = newTotal % perGroup;
    const ctx = pickContext(rng);
    return {
      prompt: {
        view: "numericAnswer",
        kind: "WORD_PROBLEM",
        stage: "ABSTRACT",
        text: `Each ${ctx.container} holds ${perGroup} ${ctx.itemPlural}. ${fullGroups} ${ctx.containerPlural} are already completely full. Then ${extra} more ${ctx.itemPlural} arrive. If every ${ctx.container} must be completely full to count, how many ${ctx.containerPlural} in total can now be filled?`,
        data: { perGroup, fullGroups, extra, unit: ctx.itemPlural, container: ctx.containerPlural },
      },
      answer: {
        value: newFullGroups,
        explanation: `${fullGroups} full ${ctx.containerPlural} hold ${fullGroups} × ${perGroup} = ${startingTotal} ${ctx.itemPlural}. Adding the new ones makes ${startingTotal} + ${extra} = ${newTotal} ${ctx.itemPlural} in all. ${newTotal} ÷ ${perGroup} = ${newFullGroups} remainder ${leftover}, so ${newFullGroups} ${ctx.containerPlural} can be completely filled.`,
      },
      meta: { perGroup, fullGroups, extra, startingTotal, newTotal, newFullGroups },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

export const divisionGenerators = [
  divFromMult,
  divFact,
  divWordProblemPartitive,
  divWordProblemMeasurement,
  divFindMistake,
  divArrayFamily,
  divRemainder,
  divTwoStepChallenge,
];
