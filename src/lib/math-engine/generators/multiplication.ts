import type { Generator, GeneratedInstance, ValidationResult } from "../types";
import { seededRng, randInt, pick, shuffle } from "../random";
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

/** Evaluate x <op> y for the four basic operator symbols used across the app ("+","-","x","/"). */
function applyOperatorSymbol(x: number, y: number, op: string): number {
  switch (op) {
    case "+":
      return x + y;
    case "-":
      return x - y;
    case "x":
      return x * y;
    case "/":
      return y === 0 ? NaN : x / y;
    default:
      return NaN;
  }
}

const OPERATOR_SYMBOLS = ["+", "-", "x", "/"] as const;

/** "Choose the missing operator" — reasons about which of +, -, x, / makes an equation true, without being told the operation. */
export const multChooseOperator: Generator = {
  id: "mult.chooseoperator",
  generate(seed, difficulty, params): GeneratedInstance {
    const factor = params.factor as number;
    const rng = seededRng(seed);
    const [lo, hi] = difficultyRange(difficulty);

    let x = 0;
    let y = factor;
    let z = 0;
    let correctOp: "x" | "/" = "x";
    for (let attempt = 0; attempt < 30; attempt++) {
      const a = randInt(rng, Math.max(lo, 2), hi);
      const useDivision = rng() < 0.5;
      if (useDivision) {
        x = a * factor;
        y = factor;
        z = a;
        correctOp = "/";
      } else {
        x = a;
        y = factor;
        z = a * factor;
        correctOp = "x";
      }
      const matches = OPERATOR_SYMBOLS.filter((op) => applyOperatorSymbol(x, y, op) === z);
      if (matches.length === 1 && matches[0] === correctOp) break;
    }

    const choices = shuffle(rng, [...OPERATOR_SYMBOLS]);
    return {
      prompt: {
        view: "chooseUnit",
        kind: "MULTIPLE_CHOICE",
        stage: "ABSTRACT",
        text: `${x} ? ${y} = ${z} — does the ? need to be +, -, x, or /?`,
        data: { choices },
      },
      answer: {
        value: correctOp,
        explanation:
          correctOp === "x"
            ? `${x} × ${y} = ${z}, so the missing operator is ×. The other operators don't give ${z}.`
            : `${x} ÷ ${y} = ${z}, so the missing operator is ÷. The other operators don't give ${z}.`,
      },
      meta: { x, y, z, correctOp },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

/** Two-step "function machine" chain — applies two operations in sequence, one of them the chapter's ×N fact. */
export const multFunctionMachine: Generator = {
  id: "mult.functionmachine",
  generate(seed, difficulty, params): GeneratedInstance {
    const factor = params.factor as number;
    const rng = seededRng(seed);
    const [, hi] = difficultyRange(difficulty);
    const start = randInt(rng, 1, Math.min(hi, 9));
    const multiplyFirst = rng() < 0.5;
    const kMax = difficulty <= 2 ? 5 : difficulty <= 4 ? 10 : 15;
    const isAdd = rng() < 0.5;
    let k = randInt(rng, 1, kMax);

    let result: number;
    let step1: string;
    let step2: string;
    let factForFact: number;

    if (multiplyFirst) {
      const afterStep1 = start * factor;
      if (!isAdd && k > afterStep1) k = randInt(rng, 1, afterStep1);
      result = isAdd ? afterStep1 + k : afterStep1 - k;
      step1 = `Multiply by ${factor}`;
      step2 = isAdd ? `add ${k}` : `subtract ${k}`;
      factForFact = start;
    } else {
      if (!isAdd && k > start) k = randInt(rng, 1, start);
      const afterStep1 = isAdd ? start + k : start - k;
      result = afterStep1 * factor;
      step1 = isAdd ? `Add ${k}` : `Subtract ${k}`;
      step2 = `multiply by ${factor}`;
      factForFact = afterStep1;
    }

    return {
      prompt: {
        view: "numericAnswer",
        kind: "FILL_IN_BLANK",
        stage: "ABSTRACT",
        text: `Start with ${start}. ${step1}. Then ${step2}. What is the result?`,
        data: {},
      },
      answer: {
        value: result,
        explanation: `Start with ${start}, then ${step1.toLowerCase()} and ${step2}, giving ${result}.`,
        facts: [multFactKey(factForFact, factor)],
      },
      meta: { start, factor, multiplyFirst, isAdd, k, result },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** "Solve for the symbol" — a stand-in shape hides a repeated addend; find its value, then use it in a ×N fact. */
export const multSolveForSymbol: Generator = {
  id: "mult.solveforsymbol",
  generate(seed, difficulty, params): GeneratedInstance {
    const factor = params.factor as number;
    const rng = seededRng(seed);
    const [lo, hi] = difficultyRange(difficulty);
    const symbolValue = randInt(rng, Math.max(lo, 1), Math.min(hi, 9));
    const copies = randInt(rng, 2, difficulty <= 2 ? 3 : 4);
    const total = symbolValue * copies;
    const symbol = pick(rng, ["▲", "★", "●", "■"]);
    const addends = Array(copies).fill(symbol).join(" + ");
    const answerValue = symbolValue * factor;
    return {
      prompt: {
        view: "numericAnswer",
        kind: "FILL_IN_BLANK",
        stage: "ABSTRACT",
        text: `If ${addends} = ${total}, what does ${symbol} × ${factor} equal?`,
        data: { symbol },
      },
      answer: {
        value: answerValue,
        explanation: `${addends} = ${total} means ${copies} × ${symbol} = ${total}, so ${symbol} = ${symbolValue}. Then ${symbol} × ${factor} = ${symbolValue} × ${factor} = ${answerValue}.`,
        facts: [multFactKey(symbolValue, factor)],
      },
      meta: { symbolValue, copies, total, factor, symbol },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** True/false comparison of two products, reasoned by scaling rather than computing both in full. */
export const multCompareTrueFalse: Generator = {
  id: "mult.comparetruefalse",
  generate(seed, difficulty, params): GeneratedInstance {
    const factor = params.factor as number;
    const rng = seededRng(seed);
    const [lo, hi] = difficultyRange(difficulty);
    const a = randInt(rng, Math.max(lo, 1), hi);
    const b = randInt(rng, Math.max(lo, 1), hi);
    const otherFactors = [2, 5, 10].filter((f) => f !== factor);
    const factor2 = rng() < 0.6 ? factor : pick(rng, otherFactors);
    const p1 = a * factor;
    const p2 = b * factor2;
    const actual: "greater" | "less" | "equal" = p1 > p2 ? "greater" : p1 < p2 ? "less" : "equal";
    const claimTrue = rng() < 0.5;
    const claimed = claimTrue
      ? actual
      : pick(rng, (["greater", "less", "equal"] as const).filter((r) => r !== actual));
    const relText = claimed === "greater" ? "greater than" : claimed === "less" ? "less than" : "equal to";
    const actualText = actual === "greater" ? "greater than" : actual === "less" ? "less than" : "equal to";
    const isTrue = claimed === actual;
    return {
      prompt: {
        view: "findMistake",
        kind: "FIND_THE_MISTAKE",
        stage: "ABSTRACT",
        text: `${a} × ${factor} is ${relText} ${b} × ${factor2}. True or false?`,
        data: {},
      },
      answer: {
        value: isTrue,
        explanation: `${a} × ${factor} = ${p1} and ${b} × ${factor2} = ${p2}, so ${a} × ${factor} is ${actualText} ${b} × ${factor2}.`,
      },
      meta: { a, factor, b, factor2, p1, p2, actual, claimed },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
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
  multChooseOperator,
  multFunctionMachine,
  multSolveForSymbol,
  multCompareTrueFalse,
];
