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

/** "How many dots are there?" — count a ten-frame, 0-10. A true 5-wide, 2-row
 * grid drawn with CSS (no emoji glyphs to render), matching the textbook's
 * own ten-frame subitizing pattern rather than an arbitrary themed picture. */
export const countObjects: Generator = {
  id: "g1.count.objects",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const allowZero = !!params.allowZero;
    let [lo, hi] = countRangeForDifficulty(difficulty);
    if (typeof params.minCount === "number") lo = params.minCount as number;
    if (typeof params.maxCount === "number") hi = params.maxCount as number;

    if (allowZero && rng() < 0.25) {
      return {
        prompt: {
          view: "tenFrame",
          kind: "FILL_IN_BLANK",
          stage: "CONCRETE",
          text: "How many dots are there?",
          data: { count: 0 },
        },
        answer: { value: 0, explanation: "There are 0 dots — the ten-frame is empty." },
        meta: { count: 0 },
      };
    }

    const count = randInt(rng, lo, hi);
    return {
      prompt: {
        view: "tenFrame",
        kind: "FILL_IN_BLANK",
        stage: "CONCRETE",
        text: "How many dots are there?",
        data: { count },
      },
      answer: { value: count, explanation: `Count each red dot one time: there are ${count}.` },
      meta: { count },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Count on or count back by 1 through a window of 0-`max` (default 10), one number hidden. */
export const numberSequenceToTen: Generator = {
  id: "g1.count.sequence",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const direction = (params.direction as "forward" | "backward" | undefined) ?? (rng() < 0.5 ? "forward" : "backward");
    const max = typeof params.max === "number" ? (params.max as number) : 10;
    const length = 5;
    const step = direction === "forward" ? 1 : -1;
    const start = direction === "forward" ? randInt(rng, 0, max - (length - 1)) : randInt(rng, length - 1, max);
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

/** Number bonds within a fixed whole (6-10) — one part shown, find the other. `params.wholes` lists the eligible wholes (defaults to 6-10 mixed); `params.framing` picks "bond" ("what is the other part?") or "more" ("how many more make N?"), defaulting to a random mix. */
export const numberBondMissing: Generator = {
  id: "g1.numberbond.missing",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const wholes = Array.isArray(params.wholes) ? (params.wholes as number[]) : [6, 7, 8, 9, 10];
    const whole = pick(rng, wholes);
    const part1 = randInt(rng, 0, whole);
    const part2 = whole - part1;
    const hideFirst = rng() < 0.5;
    const known = hideFirst ? part2 : part1;
    const hiddenValue = hideFirst ? part1 : part2;
    const hidden = hideFirst ? "part1" : "part2";
    const framing = (params.framing as "bond" | "more" | undefined) ?? (rng() < 0.5 ? "bond" : "more");
    const text =
      framing === "more"
        ? `${known} and how many more make ${whole}?`
        : `${whole} is made of two parts. One part is ${known}. What is the other part?`;
    return {
      prompt: {
        view: "numberBond",
        kind: "FILL_IN_BLANK",
        stage: "PICTORIAL",
        text,
        data: { whole, known, hidden },
      },
      answer: { value: hiddenValue, explanation: `${part1} and ${part2} make ${whole}.` },
      meta: { whole, part1, part2 },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Core addition within a small max (default 10). `missing` picks which slot is blank: "a" | "b" | "result" (default "result"). `forceZero` makes one addend 0 (the Addition with 0 lesson). `bMin`/`bMax` bound the second addend (e.g. 1-3 for the counting-on lesson). */
export const additionBasic: Generator = {
  id: "g1.addition.basic",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const max = typeof params.max === "number" ? (params.max as number) : 10;
    const missing = (params.missing as "a" | "b" | "result" | undefined) ?? "result";
    const forceZero = !!params.forceZero;
    const bMin = typeof params.bMin === "number" ? (params.bMin as number) : 0;
    const bMax = typeof params.bMax === "number" ? (params.bMax as number) : max;

    let a: number;
    let b: number;
    if (forceZero) {
      const other = randInt(rng, 0, max);
      a = rng() < 0.5 ? 0 : other;
      b = a === 0 ? other : 0;
    } else {
      a = randInt(rng, 0, max);
      const hiB = Math.min(bMax, max - a);
      const loB = Math.min(bMin, hiB);
      b = randInt(rng, loB, hiB);
    }
    const result = a + b;
    const text = missing === "result" ? `${a} + ${b} = ?` : "Find the missing number.";
    return {
      prompt: {
        view: "regroupingColumns",
        kind: "BUILD_EQUATION",
        stage: missing === "result" ? "PICTORIAL" : "ABSTRACT",
        text,
        data: { a, b, op: "+", result, missing },
      },
      answer: { value: missing === "a" ? a : missing === "b" ? b : result, explanation: `${a} + ${b} = ${result}.` },
      meta: { a, b, result },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** A short addition story within a small max (default 10) — "putting together" two groups, or an initial group with "more" arriving. */
export const additionWordProblem: Generator = {
  id: "g1.addition.wordproblem",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const max = typeof params.max === "number" ? (params.max as number) : 10;
    const style = (params.style as "together" | "more" | undefined) ?? (rng() < 0.5 ? "together" : "more");
    const item = pick(rng, COUNT_ITEMS);
    const a = randInt(rng, 1, max - 1);
    const b = randInt(rng, 1, max - a);
    const result = a + b;
    const text =
      style === "together"
        ? `There are ${a} ${item.plural} in one spot and ${b} ${item.plural} in another. How many ${item.plural} are there altogether?`
        : `There are ${a} ${item.plural}. ${b} more ${item.plural} come. How many ${item.plural} are there now?`;
    return {
      prompt: { view: "numericAnswer", kind: "WORD_PROBLEM", stage: "ABSTRACT", text, data: {} },
      answer: { value: result, explanation: `${a} + ${b} = ${result}.` },
      meta: { a, b, result },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Core subtraction within a small max (default 10), minuend ≥ subtrahend always. `missing` picks which slot is blank: "a" | "b" | "result" (default "result"). `zeroMode`: "subtractZero" (a − 0) or "subtractAll" (a − a). `bMin`/`bMax` bound the subtrahend (e.g. 1-3 for the counting-back lesson). */
export const subtractionBasic: Generator = {
  id: "g1.subtraction.basic",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const max = typeof params.max === "number" ? (params.max as number) : 10;
    const missing = (params.missing as "a" | "b" | "result" | undefined) ?? "result";
    const zeroMode = params.zeroMode as "subtractZero" | "subtractAll" | undefined;
    const bMin = typeof params.bMin === "number" ? (params.bMin as number) : 0;
    const bMax = typeof params.bMax === "number" ? (params.bMax as number) : max;

    let a: number;
    let b: number;
    if (zeroMode) {
      a = randInt(rng, 0, max);
      b = zeroMode === "subtractZero" ? 0 : a;
    } else {
      a = randInt(rng, bMin, max);
      const hiB = Math.min(bMax, a);
      const loB = Math.min(bMin, hiB);
      b = randInt(rng, loB, hiB);
    }
    const result = a - b;
    const text = missing === "result" ? `${a} − ${b} = ?` : "Find the missing number.";
    return {
      prompt: {
        view: "regroupingColumns",
        kind: "BUILD_EQUATION",
        stage: missing === "result" ? "PICTORIAL" : "ABSTRACT",
        text,
        data: { a, b, op: "−", result, missing },
      },
      answer: { value: missing === "a" ? a : missing === "b" ? b : result, explanation: `${a} − ${b} = ${result}.` },
      meta: { a, b, result },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** A short "taking away" subtraction story within a small max (default 10). */
export const subtractionWordProblem: Generator = {
  id: "g1.subtraction.wordproblem",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const max = typeof params.max === "number" ? (params.max as number) : 10;
    const item = pick(rng, COUNT_ITEMS);
    const a = randInt(rng, 1, max);
    const b = randInt(rng, 0, a);
    const result = a - b;
    const text = `There are ${a} ${item.plural}. ${b} ${item.plural} ${b === 1 ? "is" : "are"} taken away. How many ${item.plural} are left?`;
    return {
      prompt: { view: "numericAnswer", kind: "WORD_PROBLEM", stage: "ABSTRACT", text, data: {} },
      answer: { value: result, explanation: `${a} − ${b} = ${result}.` },
      meta: { a, b, result },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

type TeenForm = "addTen" | "addOnes" | "subOnes" | "subTen";

/** A teen number (11-20) as 10 and some ones, in any of four equation forms: 10+ones=teen, ones+10=teen, teen−ones=10, teen−10=ones. `params.forms` restricts which forms appear (default: all four). */
export const teenTensOnes: Generator = {
  id: "g1.teen.tensones",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const forms = (Array.isArray(params.forms) ? (params.forms as TeenForm[]) : ["addTen", "addOnes", "subOnes", "subTen"]) as TeenForm[];
    const form = pick(rng, forms);
    const ones = randInt(rng, 1, 9);
    const teen = 10 + ones;
    let a: number, b: number, op: "+" | "−", result: number;
    if (form === "addTen") {
      a = 10;
      b = ones;
      op = "+";
      result = teen;
    } else if (form === "addOnes") {
      a = ones;
      b = 10;
      op = "+";
      result = teen;
    } else if (form === "subOnes") {
      a = teen;
      b = ones;
      op = "−";
      result = 10;
    } else {
      a = teen;
      b = 10;
      op = "−";
      result = ones;
    }
    return {
      prompt: {
        view: "regroupingColumns",
        kind: "BUILD_EQUATION",
        stage: "PICTORIAL",
        text: `${a} ${op} ${b} = ?`,
        data: { a, b, op, result, missing: "result" },
      },
      answer: { value: result, explanation: `${a} ${op} ${b} = ${result}.` },
      meta: { teen, ones, form },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** A teen number (11-19) plus or minus a single digit that never crosses the ten (the ones digit alone absorbs the whole change). `op`: "add" | "sub" (default "add"). `missing` picks the blank slot, default "result". */
export const teenAddSubNoCross: Generator = {
  id: "g1.teen.addsub.nocross",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const op = (params.op as "add" | "sub" | undefined) ?? "add";
    const missing = (params.missing as "a" | "b" | "result" | undefined) ?? "result";

    if (op === "add") {
      const ones = randInt(rng, 1, 8);
      const teen = 10 + ones;
      const b = randInt(rng, 1, 9 - ones);
      const result = teen + b;
      const text = missing === "result" ? `${teen} + ${b} = ?` : "Find the missing number.";
      return {
        prompt: { view: "regroupingColumns", kind: "BUILD_EQUATION", stage: "PICTORIAL", text, data: { a: teen, b, op: "+", result, missing } },
        answer: { value: missing === "a" ? teen : missing === "b" ? b : result, explanation: `${teen} + ${b} = ${result}.` },
        meta: { teen, b, result },
      };
    }

    const ones = randInt(rng, 1, 9);
    const teen = 10 + ones;
    const b = randInt(rng, 1, ones);
    const result = teen - b;
    const text = missing === "result" ? `${teen} − ${b} = ?` : "Find the missing number.";
    return {
      prompt: { view: "regroupingColumns", kind: "BUILD_EQUATION", stage: "PICTORIAL", text, data: { a: teen, b, op: "−", result, missing } },
      answer: { value: missing === "a" ? teen : missing === "b" ? b : result, explanation: `${teen} − ${b} = ${result}.` },
      meta: { teen, b, result },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Two single-digit addends whose sum crosses into the teens (11-18) — the "make a ten" territory. `aMin`/`aMax`/`bMin`/`bMax` (each default 2-9) steer which addend tends to be the "close to 10" one; `missing` picks the blank slot (default "result"). */
export const additionCrossTen: Generator = {
  id: "g1.addition.crossten",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const aMin = typeof params.aMin === "number" ? (params.aMin as number) : 2;
    const aMax = typeof params.aMax === "number" ? (params.aMax as number) : 9;
    const bMin = typeof params.bMin === "number" ? (params.bMin as number) : 2;
    const bMax = typeof params.bMax === "number" ? (params.bMax as number) : 9;
    const missing = (params.missing as "a" | "b" | "result" | undefined) ?? "result";

    let a = aMin;
    let b = bMin;
    for (let attempt = 0; attempt < 50; attempt++) {
      a = randInt(rng, aMin, aMax);
      b = randInt(rng, bMin, bMax);
      const sum = a + b;
      if (sum >= 11 && sum <= 18) break;
    }
    const result = a + b;
    const text = missing === "result" ? `${a} + ${b} = ?` : "Find the missing number.";
    return {
      prompt: {
        view: "regroupingColumns",
        kind: "BUILD_EQUATION",
        stage: "PICTORIAL",
        text,
        data: { a, b, op: "+", result, missing },
      },
      answer: { value: missing === "a" ? a : missing === "b" ? b : result, explanation: `${a} + ${b} = ${result}.` },
      meta: { a, b, result },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** A teen number (11-19) minus a single digit that crosses below the ten — the subtrahend is always bigger than the ones digit, so "subtract from 10" or "subtract the ones first" both apply. `bMin`/`bMax` (default 2-9) steer which subtrahends appear; `missing` picks the blank slot (default "result"). */
export const subtractionCrossTen: Generator = {
  id: "g1.subtraction.crossten",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const bMin = typeof params.bMin === "number" ? (params.bMin as number) : 2;
    const bMax = typeof params.bMax === "number" ? (params.bMax as number) : 9;
    const missing = (params.missing as "a" | "b" | "result" | undefined) ?? "result";

    let ones = 1;
    let b = bMin;
    for (let attempt = 0; attempt < 50; attempt++) {
      ones = randInt(rng, 1, 8);
      b = randInt(rng, bMin, bMax);
      if (b > ones) break;
    }
    const teen = 10 + ones;
    const result = teen - b;
    const text = missing === "result" ? `${teen} − ${b} = ?` : "Find the missing number.";
    return {
      prompt: {
        view: "regroupingColumns",
        kind: "BUILD_EQUATION",
        stage: "PICTORIAL",
        text,
        data: { a: teen, b, op: "−", result, missing },
      },
      answer: { value: missing === "a" ? teen : missing === "b" ? b : result, explanation: `${teen} − ${b} = ${result}.` },
      meta: { teen, b, result },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

export const grade1NumberGenerators = [
  countObjects,
  numberSequenceToTen,
  compareGroups,
  numberBondMissing,
  additionBasic,
  additionWordProblem,
  subtractionBasic,
  subtractionWordProblem,
  teenTensOnes,
  teenAddSubNoCross,
  additionCrossTen,
  subtractionCrossTen,
];
