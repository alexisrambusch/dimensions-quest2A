import type { Generator, GeneratedInstance, ValidationResult } from "../types";
import { seededRng, randInt } from "../random";
import { pickContext } from "../contexts";
import { validateNumeric } from "../numeric";

/** Number bond: whole and one part known, find the missing part. */
export const numberBondMissingPart: Generator = {
  id: "numberbond.missingpart",
  generate(seed, difficulty): GeneratedInstance {
    const rng = seededRng(seed);
    const max = difficulty <= 1 ? 20 : difficulty <= 3 ? 100 : 1000;
    const whole = randInt(rng, 10, max);
    const part1 = randInt(rng, 1, whole - 1);
    const part2 = whole - part1;
    const hideFirst = rng() < 0.5;
    return {
      prompt: {
        view: "numberBond",
        kind: "FILL_IN_BLANK",
        stage: "PICTORIAL",
        text: `Fill in the missing part of the number bond.`,
        data: { whole, known: hideFirst ? part2 : part1, hidden: hideFirst ? "part1" : "part2" },
      },
      answer: {
        value: hideFirst ? part1 : part2,
        explanation: `${whole} is made of ${part1} and ${part2}.`,
      },
      meta: { whole, part1, part2 },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Addition within 1000, with regrouping surfaced for the visual place-value model. */
export const additionWithin1000: Generator = {
  id: "addition.within1000",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const forceRegroup = (params.forceRegroup as boolean | undefined) ?? false;
    const max = difficulty <= 1 ? 99 : difficulty <= 3 ? 499 : 899;
    let a = randInt(rng, 10, max);
    let b = randInt(rng, 10, max - 10);
    const onesRegroup = (a % 10) + (b % 10) >= 10;
    if (forceRegroup && !onesRegroup) {
      // nudge b's ones digit up so ones column regroups
      const bTens = Math.floor(b / 10) * 10;
      const neededOnes = Math.max(0, 10 - (a % 10));
      b = bTens + Math.min(9, neededOnes);
    }
    const sum = a + b;
    return {
      prompt: {
        view: "regroupingColumns",
        kind: "BUILD_EQUATION",
        stage: "PICTORIAL",
        text: `${a} + ${b} = ?`,
        data: { a, b, op: "+" },
      },
      answer: { value: sum, explanation: `${a} + ${b} = ${sum}.` },
      meta: { a, b, op: "+", regroups: (a % 10) + (b % 10) >= 10 },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Subtraction within 1000, including across-zero borrow cases. */
export const subtractionWithin1000: Generator = {
  id: "subtraction.within1000",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const acrossZero = (params.acrossZero as boolean | undefined) ?? false;
    const max = difficulty <= 1 ? 99 : difficulty <= 3 ? 499 : 899;
    let a = randInt(rng, 20, max);
    if (acrossZero) {
      // construct a minuend with a zero in the tens place, e.g. 304, 506
      const hundreds = randInt(rng, 2, 9);
      const ones = randInt(rng, 1, 9);
      a = hundreds * 100 + ones;
    }
    const b = randInt(rng, 10, a - 1);
    const diff = a - b;
    return {
      prompt: {
        view: "regroupingColumns",
        kind: "BUILD_EQUATION",
        stage: "PICTORIAL",
        text: `${a} − ${b} = ?`,
        data: { a, b, op: "-" },
      },
      answer: { value: diff, explanation: `${a} − ${b} = ${diff}.` },
      meta: { a, b, op: "-", acrossZero: Math.floor((a % 100) / 10) === 0 },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Addition/subtraction/comparison word problem with a bar model. */
export const addSubWordProblem: Generator = {
  id: "addsub.wordproblem",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const opParam = (params.op as "add" | "sub" | "compare" | undefined) ?? "add";
    const max = difficulty <= 1 ? 50 : difficulty <= 3 ? 200 : 900;
    const ctx = pickContext(rng);

    if (opParam === "compare") {
      const smaller = randInt(rng, 5, max);
      const more = randInt(rng, 1, max);
      const larger = smaller + more;
      return {
        prompt: {
          view: "barModelCompare",
          kind: "WORD_PROBLEM",
          stage: "PICTORIAL",
          text: `A ${ctx.container} has ${larger} ${ctx.itemPlural}. Another ${ctx.container} has ${smaller} ${ctx.itemPlural}. How many more ${ctx.itemPlural} does the first ${ctx.container} have?`,
          data: { larger, smaller, unit: ctx.itemPlural },
        },
        answer: { value: more, explanation: `${larger} − ${smaller} = ${more} more ${ctx.itemPlural}.` },
        meta: { a: larger, b: smaller, op: "-", type: "compare" },
      };
    }

    const part1 = randInt(rng, 5, max);
    const part2 = randInt(rng, 5, max);
    const whole = part1 + part2;
    if (opParam === "add") {
      return {
        prompt: {
          view: "barModelPartWhole",
          kind: "WORD_PROBLEM",
          stage: "PICTORIAL",
          text: `There are ${part1} ${ctx.itemPlural} in one ${ctx.container} and ${part2} ${ctx.itemPlural} in another. How many ${ctx.itemPlural} are there in all?`,
          data: { part1, part2, unit: ctx.itemPlural },
        },
        answer: { value: whole, explanation: `${part1} + ${part2} = ${whole}.` },
        meta: { a: part1, b: part2, op: "+", type: "partwhole" },
      };
    }
    // sub: whole and one part known, find the other part
    return {
      prompt: {
        view: "barModelPartWhole",
        kind: "WORD_PROBLEM",
        stage: "PICTORIAL",
        text: `There are ${whole} ${ctx.itemPlural} altogether. ${part1} are in the ${ctx.container}. The rest are outside. How many are outside?`,
        data: { whole, known: part1, unit: ctx.itemPlural },
      },
      answer: { value: part2, explanation: `${whole} − ${part1} = ${part2}.` },
      meta: { a: whole, b: part1, op: "-", type: "partwhole" },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Find a missing addend/subtrahend/minuend instead of the result — the inverse-operation reasoning workbooks call "find the missing number." */
export const addSubMissingOperand: Generator = {
  id: "addsub.missingoperand",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const opParam = (params.op as "add" | "sub" | undefined) ?? (rng() < 0.5 ? "add" : "sub");
    const max = difficulty <= 2 ? 99 : difficulty <= 4 ? 499 : 899;
    const missing = (params.missing as "a" | "b" | undefined) ?? (rng() < 0.5 ? "a" : "b");
    let a: number, b: number, result: number;
    if (opParam === "add") {
      a = randInt(rng, 10, max);
      b = randInt(rng, 10, max - 10);
      result = a + b;
    } else {
      a = randInt(rng, 20, max);
      b = randInt(rng, 10, a - 1);
      result = a - b;
    }
    const symbol = opParam === "add" ? "+" : "−";
    const answerValue = missing === "a" ? a : b;
    return {
      prompt: {
        view: "regroupingColumns",
        kind: "BUILD_EQUATION",
        stage: "ABSTRACT",
        text: `Find the missing number.`,
        data: { a, b, op: symbol, result, missing },
      },
      answer: { value: answerValue, explanation: `${a} ${symbol} ${b} = ${result}.` },
      meta: { a, b, op: opParam },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** "Is this addition/subtraction correct?" — seeded with the classic forgot-to-regroup slip so a right answer has to be checked, not just produced. */
export const addSubFindMistake: Generator = {
  id: "addsub.findmistake",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const opParam = (params.op as "add" | "sub" | undefined) ?? (rng() < 0.5 ? "add" : "sub");
    const max = difficulty <= 2 ? 99 : difficulty <= 4 ? 499 : 899;
    const a = randInt(rng, 20, max);
    const b = opParam === "add" ? randInt(rng, 10, max) : randInt(rng, 10, a - 1);
    const correct = opParam === "add" ? a + b : a - b;
    const isTrue = rng() < 0.5;
    let shown = correct;
    if (!isTrue) {
      const da = String(a).padStart(3, "0").split("").map(Number);
      const db = String(b).padStart(3, "0").split("").map(Number);
      const digitwise = opParam === "add" ? da.map((d, i) => d + db[i]) : da.map((d, i) => Math.abs(d - db[i]));
      shown = Number(digitwise.join(""));
      if (shown === correct) shown = correct + (rng() < 0.5 ? 10 : -10);
    }
    const symbol = opParam === "add" ? "+" : "−";
    return {
      prompt: {
        view: "findMistake",
        kind: "FIND_THE_MISTAKE",
        stage: "ABSTRACT",
        text: `${a} ${symbol} ${b} = ${shown}. Is this correct?`,
        data: {},
      },
      answer: { value: isTrue, explanation: `${a} ${symbol} ${b} = ${correct}.` },
      meta: { a, b, op: opParam },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

/** Two operations in one story — read, do the first step, then use that result for the second. */
export const addSubTwoStep: Generator = {
  id: "addsub.twostep",
  generate(seed, difficulty): GeneratedInstance {
    const rng = seededRng(seed);
    const max = difficulty <= 2 ? 150 : difficulty <= 4 ? 400 : 700;
    const ctx = pickContext(rng);
    const a = randInt(rng, 10, max);
    const b = randInt(rng, 10, max);
    const total = a + b;
    const c = randInt(rng, 5, Math.min(total - 1, max));
    const result = total - c;
    const names = ["Ravi", "Sofia", "Malik", "Elena", "Theo", "Amara"];
    const name = names[Math.floor(rng() * names.length)];
    const text = `${name} collected ${a} ${ctx.itemPlural} in the morning and ${b} more ${ctx.itemPlural} in the afternoon. Then ${name} gave away ${c} ${ctx.itemPlural}. How many ${ctx.itemPlural} does ${name} have left?`;
    return {
      prompt: {
        view: "numericAnswer",
        kind: "WORD_PROBLEM",
        stage: "ABSTRACT",
        text,
        data: {},
      },
      answer: { value: result, explanation: `${a} + ${b} = ${total}, then ${total} − ${c} = ${result}.` },
      meta: { a, b, c },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

export const additionSubtractionGenerators = [
  numberBondMissingPart,
  additionWithin1000,
  subtractionWithin1000,
  addSubWordProblem,
  addSubMissingOperand,
  addSubFindMistake,
  addSubTwoStep,
];
