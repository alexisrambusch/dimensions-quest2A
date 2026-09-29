import type { Generator, GeneratedInstance, ValidationResult } from "../types";
import { seededRng, randInt, pick } from "../random";
import { pickContext } from "../contexts";
import { validateNumeric } from "../numeric";

const NO_REGROUP_ATTEMPTS = 300;

/** True if adding a+b never carries a 1 into the next place-value column. */
function addsWithoutRegroup(a: number, b: number): boolean {
  let x = a;
  let y = b;
  while (x > 0 || y > 0) {
    if ((x % 10) + (y % 10) >= 10) return false;
    x = Math.floor(x / 10);
    y = Math.floor(y / 10);
  }
  return true;
}

/** True if subtracting a-b never borrows from the next place-value column. */
function subtractsWithoutRegroup(a: number, b: number): boolean {
  let x = a;
  let y = b;
  while (x > 0 || y > 0) {
    if (x % 10 < y % 10) return false;
    x = Math.floor(x / 10);
    y = Math.floor(y / 10);
  }
  return true;
}

/** Number bond: whole and one part known, find the missing part. Splits are always
 * place-value safe (no regrouping) — every consumer of this generator is a
 * pre-regrouping lesson. */
export const numberBondMissingPart: Generator = {
  id: "numberbond.missingpart",
  generate(seed, difficulty): GeneratedInstance {
    const rng = seededRng(seed);
    const max = difficulty <= 1 ? 20 : difficulty <= 3 ? 100 : 1000;
    let whole = 0;
    let part1 = 0;
    let part2 = 0;
    for (let attempt = 0; attempt < NO_REGROUP_ATTEMPTS; attempt++) {
      whole = randInt(rng, 10, max);
      part1 = randInt(rng, 1, whole - 1);
      part2 = whole - part1;
      if (addsWithoutRegroup(part1, part2)) break;
    }
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

/** Addition within 1000. `forceRegroup: true` guarantees a carry; `noRegroup: true`
 * guarantees no column ever carries — used by pre-regrouping lessons. */
export const additionWithin1000: Generator = {
  id: "addition.within1000",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const forceRegroup = (params.forceRegroup as boolean | undefined) ?? false;
    const noRegroup = (params.noRegroup as boolean | undefined) ?? false;
    const max = difficulty <= 1 ? 99 : difficulty <= 3 ? 499 : 899;
    let a = randInt(rng, 10, max);
    let b = randInt(rng, 10, max - 10);
    if (noRegroup) {
      for (let attempt = 0; attempt < NO_REGROUP_ATTEMPTS && !addsWithoutRegroup(a, b); attempt++) {
        a = randInt(rng, 10, max);
        b = randInt(rng, 10, max - 10);
      }
    } else {
      const onesRegroup = (a % 10) + (b % 10) >= 10;
      if (forceRegroup && !onesRegroup) {
        // nudge b's ones digit up so ones column regroups
        const bTens = Math.floor(b / 10) * 10;
        const neededOnes = Math.max(0, 10 - (a % 10));
        b = bTens + Math.min(9, neededOnes);
      }
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

/** Subtraction within 1000. `acrossZero` constructs a borrow-through-zero minuend;
 * `noRegroup: true` guarantees no column ever borrows — used by pre-regrouping lessons. */
export const subtractionWithin1000: Generator = {
  id: "subtraction.within1000",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const acrossZero = (params.acrossZero as boolean | undefined) ?? false;
    const noRegroup = (params.noRegroup as boolean | undefined) ?? false;
    const max = difficulty <= 1 ? 99 : difficulty <= 3 ? 499 : 899;
    let a = randInt(rng, 20, max);
    if (acrossZero) {
      // construct a minuend with a zero in the tens place, e.g. 304, 506
      const hundreds = randInt(rng, 2, 9);
      const ones = randInt(rng, 1, 9);
      a = hundreds * 100 + ones;
    }
    let b = randInt(rng, 10, a - 1);
    if (noRegroup) {
      // Re-draw `a` too, not just `b` — some minuends (e.g. round hundreds like
      // 200) have only one or two valid no-borrow subtrahends in range, so
      // retrying `b` alone against a fixed hard `a` can exhaust the attempt cap.
      for (let attempt = 0; attempt < NO_REGROUP_ATTEMPTS && !subtractsWithoutRegroup(a, b); attempt++) {
        a = randInt(rng, 20, max);
        if (acrossZero) {
          const hundreds = randInt(rng, 2, 9);
          const ones = randInt(rng, 1, 9);
          a = hundreds * 100 + ones;
        }
        b = randInt(rng, 10, a - 1);
      }
    }
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

/** Addition/subtraction/comparison word problem with a bar model. `noRegroup: true`
 * guarantees the underlying arithmetic never carries or borrows. */
export const addSubWordProblem: Generator = {
  id: "addsub.wordproblem",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const opParam = (params.op as "add" | "sub" | "compare" | undefined) ?? "add";
    const noRegroup = (params.noRegroup as boolean | undefined) ?? false;
    const max = difficulty <= 1 ? 50 : difficulty <= 3 ? 200 : 900;
    const ctx = pickContext(rng);

    if (opParam === "compare") {
      let smaller = randInt(rng, 5, max);
      let more = randInt(rng, 1, max);
      if (noRegroup) {
        for (let attempt = 0; attempt < NO_REGROUP_ATTEMPTS && !addsWithoutRegroup(smaller, more); attempt++) {
          smaller = randInt(rng, 5, max);
          more = randInt(rng, 1, max);
        }
      }
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

    let part1 = randInt(rng, 5, max);
    let part2 = randInt(rng, 5, max);
    if (noRegroup) {
      for (let attempt = 0; attempt < NO_REGROUP_ATTEMPTS && !addsWithoutRegroup(part1, part2); attempt++) {
        part1 = randInt(rng, 5, max);
        part2 = randInt(rng, 5, max);
      }
    }
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

/** Find a missing addend/subtrahend/minuend instead of the result — the inverse-operation reasoning workbooks call "find the missing number." `noRegroup: true` guarantees no column ever carries/borrows. */
export const addSubMissingOperand: Generator = {
  id: "addsub.missingoperand",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const opParam = (params.op as "add" | "sub" | undefined) ?? (rng() < 0.5 ? "add" : "sub");
    const noRegroup = (params.noRegroup as boolean | undefined) ?? false;
    const max = difficulty <= 2 ? 99 : difficulty <= 4 ? 499 : 899;
    const missing = (params.missing as "a" | "b" | undefined) ?? (rng() < 0.5 ? "a" : "b");
    let a: number, b: number, result: number;
    if (opParam === "add") {
      a = randInt(rng, 10, max);
      b = randInt(rng, 10, max - 10);
      if (noRegroup) {
        for (let attempt = 0; attempt < NO_REGROUP_ATTEMPTS && !addsWithoutRegroup(a, b); attempt++) {
          a = randInt(rng, 10, max);
          b = randInt(rng, 10, max - 10);
        }
      }
      result = a + b;
    } else {
      a = randInt(rng, 20, max);
      b = randInt(rng, 10, a - 1);
      if (noRegroup) {
        // Re-draw `a` too, not just `b` — see subtractionWithin1000 for why.
        for (let attempt = 0; attempt < NO_REGROUP_ATTEMPTS && !subtractsWithoutRegroup(a, b); attempt++) {
          a = randInt(rng, 20, max);
          b = randInt(rng, 10, a - 1);
        }
      }
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

/** "Is this addition/subtraction correct?" — seeded with the classic forgot-to-regroup slip so a right answer has to be checked, not just produced. `noRegroup: true` keeps the underlying a/b column-safe (the shown wrong answer then falls back to a simple off-by-10 slip instead of a regroup-specific one). */
export const addSubFindMistake: Generator = {
  id: "addsub.findmistake",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const opParam = (params.op as "add" | "sub" | undefined) ?? (rng() < 0.5 ? "add" : "sub");
    const noRegroup = (params.noRegroup as boolean | undefined) ?? false;
    const max = difficulty <= 2 ? 99 : difficulty <= 4 ? 499 : 899;
    let a = randInt(rng, 20, max);
    let b = opParam === "add" ? randInt(rng, 10, max) : randInt(rng, 10, a - 1);
    if (noRegroup) {
      for (let attempt = 0; attempt < NO_REGROUP_ATTEMPTS; attempt++) {
        const ok = opParam === "add" ? addsWithoutRegroup(a, b) : subtractsWithoutRegroup(a, b);
        if (ok) break;
        a = randInt(rng, 20, max);
        b = opParam === "add" ? randInt(rng, 10, max) : randInt(rng, 10, a - 1);
      }
    }
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

/** Two operations in one story — read, do the first step, then use that result for the second. `noRegroup: true` guarantees both steps are column-safe. */
export const addSubTwoStep: Generator = {
  id: "addsub.twostep",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const noRegroup = (params.noRegroup as boolean | undefined) ?? false;
    const max = difficulty <= 2 ? 150 : difficulty <= 4 ? 400 : 700;
    const ctx = pickContext(rng);
    let a = randInt(rng, 10, max);
    let b = randInt(rng, 10, max);
    let total = a + b;
    let c = randInt(rng, 5, Math.min(total - 1, max));
    if (noRegroup) {
      for (let attempt = 0; attempt < NO_REGROUP_ATTEMPTS; attempt++) {
        if (addsWithoutRegroup(a, b) && subtractsWithoutRegroup(total, c)) break;
        a = randInt(rng, 10, max);
        b = randInt(rng, 10, max);
        total = a + b;
        c = randInt(rng, 5, Math.min(total - 1, max));
      }
    }
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

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** "Which two of these four numbers give the greatest/least answer when subtracted?" — the pair has to be found before the subtraction even starts. */
export const addSubExtremePair: Generator = {
  id: "addsub.extremepair",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const max = difficulty <= 3 ? 400 : difficulty <= 4 ? 700 : 999;
    const mode = (params.mode as "greatest" | "least" | undefined) ?? (rng() < 0.5 ? "greatest" : "least");
    const values = new Set<number>();
    while (values.size < 4) values.add(randInt(rng, 10, max));
    const sorted = Array.from(values).sort((x, y) => x - y);
    const result =
      mode === "greatest"
        ? sorted[3] - sorted[0]
        : Math.min(sorted[1] - sorted[0], sorted[2] - sorted[1], sorted[3] - sorted[2]);
    const shown = shuffle(sorted, rng);
    const text = `Which two of these numbers will give the ${mode} answer when one is subtracted from the other? ${shown.join(", ")}. Find the answer.`;
    return {
      prompt: {
        view: "numericAnswer",
        kind: "WORD_PROBLEM",
        stage: "ABSTRACT",
        text,
        data: {},
      },
      answer: {
        value: result,
        explanation:
          mode === "greatest"
            ? `The greatest gap is between the biggest and smallest number: ${sorted[3]} − ${sorted[0]} = ${result}.`
            : `The smallest gap is between two numbers that are close together once sorted: ${result}.`,
      },
      meta: { values: sorted, mode },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Replace one digit of an addend or the sum with a blank inside a fully-worked column addition — targets place-value understanding of the algorithm itself, not just the final total. `noRegroup: true` guarantees no column ever carries. */
export const additionMissingDigit: Generator = {
  id: "addition.missingdigit",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const noRegroup = (params.noRegroup as boolean | undefined) ?? false;
    const max = difficulty <= 1 ? 99 : difficulty <= 3 ? 499 : 899;
    let a = randInt(rng, 10, max);
    let b = randInt(rng, 10, max);
    if (noRegroup) {
      for (let attempt = 0; attempt < NO_REGROUP_ATTEMPTS && !addsWithoutRegroup(a, b); attempt++) {
        a = randInt(rng, 10, max);
        b = randInt(rng, 10, max);
      }
    }
    const sum = a + b;
    const aStr = String(a);
    const bStr = String(b);
    const sumStr = String(sum);
    const target = pick(rng, ["a", "b", "sum"] as const);
    const targetStr = target === "a" ? aStr : target === "b" ? bStr : sumStr;
    const position = randInt(rng, 0, targetStr.length - 1);
    const digit = Number(targetStr[position]);
    const masked = targetStr.slice(0, position) + "_" + targetStr.slice(position + 1);
    const displayA = target === "a" ? masked : aStr;
    const displayB = target === "b" ? masked : bStr;
    const displaySum = target === "sum" ? masked : sumStr;
    return {
      prompt: {
        view: "numericAnswer",
        kind: "FILL_IN_BLANK",
        stage: "ABSTRACT",
        text: `In this addition, one digit is hidden: ${displayA} + ${displayB} = ${displaySum}. What digit is hidden?`,
        data: {},
      },
      answer: {
        value: digit,
        explanation: `${aStr} + ${bStr} = ${sumStr}, so the hidden digit is ${digit}.`,
      },
      meta: { a, b, sum, target, position },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Fact triangle: whole = part + part, with any one of the three corners (including the whole) hidden — unlike the number-bond generator, which only ever hides a part, this sometimes turns the problem into addition instead of subtraction. Splits are always place-value safe (no regrouping) — its sole consumer is a pre-regrouping lesson. */
export const addSubFactTriangle: Generator = {
  id: "addsub.facttriangle",
  generate(seed, difficulty): GeneratedInstance {
    const rng = seededRng(seed);
    const max = difficulty <= 1 ? 20 : difficulty <= 3 ? 100 : 1000;
    let part1 = 0;
    let part2 = 0;
    for (let attempt = 0; attempt < NO_REGROUP_ATTEMPTS; attempt++) {
      part1 = randInt(rng, 1, max - 1);
      part2 = randInt(rng, 1, max - part1);
      if (addsWithoutRegroup(part1, part2)) break;
    }
    const whole = part1 + part2;
    const hiddenCorner = pick(rng, ["whole", "part1", "part2"] as const);

    if (hiddenCorner === "whole") {
      return {
        prompt: {
          view: "numericAnswer",
          kind: "FILL_IN_BLANK",
          stage: "ABSTRACT",
          text: `In this fact triangle, two corners are ${part1} and ${part2} — they join to make the third corner. What is the missing corner?`,
          data: {},
        },
        answer: {
          value: whole,
          explanation: `${part1} + ${part2} = ${whole}, so the missing corner is ${whole}. That also means ${whole} − ${part1} = ${part2} and ${whole} − ${part2} = ${part1}.`,
        },
        meta: { whole, part1, part2, hiddenCorner },
      };
    }

    const knownPart = hiddenCorner === "part1" ? part2 : part1;
    const missingPart = hiddenCorner === "part1" ? part1 : part2;
    return {
      prompt: {
        view: "numericAnswer",
        kind: "FILL_IN_BLANK",
        stage: "ABSTRACT",
        text: `In this fact triangle, the whole is ${whole} and one corner is ${knownPart}. What is the missing corner?`,
        data: {},
      },
      answer: {
        value: missingPart,
        explanation: `${whole} − ${knownPart} = ${missingPart}. Check: ${knownPart} + ${missingPart} = ${whole}.`,
      },
      meta: { whole, part1, part2, hiddenCorner },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

interface PartWholeReasoningScenario {
  wholeNoun: string;
  verb: string;
  part1Label: string;
  part2Label: string;
  format: (n: number) => string;
}

const partWholeReasoningScenarios: PartWholeReasoningScenario[] = [
  { wholeNoun: "total amount of money", verb: "earned", part1Label: "raking leaves", part2Label: "washing cars", format: (n) => `$${n}` },
  { wholeNoun: "total distance", verb: "walked", part1Label: "on the trail before lunch", part2Label: "on the trail after lunch", format: (n) => `${n} km` },
  { wholeNoun: "total number of stickers", verb: "collected", part1Label: "at the school fair", part2Label: "from a cousin", format: (n) => `${n} stickers` },
  { wholeNoun: "total number of pages", verb: "read", part1Label: "on Monday evening", part2Label: "on Tuesday evening", format: (n) => `${n} pages` },
];

const PART_WHOLE_REASONING_NAMES = ["Ravi", "Sofia", "Malik", "Elena", "Theo", "Amara", "Priya", "Kofi"];

/** Part-whole word problem that makes the whole-vs-part decision explicit before computing — the final answer is still just a number, but the explanation names which quantity is the whole and which is a part. Splits are always place-value safe (no regrouping) — its sole consumer is a pre-regrouping lesson. */
export const addSubPartWholeReasoning: Generator = {
  id: "addsub.partwholereasoning",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const opParam = (params.op as "add" | "sub" | undefined) ?? (rng() < 0.5 ? "add" : "sub");
    const max = difficulty <= 1 ? 40 : difficulty <= 3 ? 200 : 800;
    const scenario = pick(rng, partWholeReasoningScenarios);
    const name = pick(rng, PART_WHOLE_REASONING_NAMES);
    let part1 = randInt(rng, 5, max);
    let part2 = randInt(rng, 5, max);
    for (let attempt = 0; attempt < NO_REGROUP_ATTEMPTS && !addsWithoutRegroup(part1, part2); attempt++) {
      part1 = randInt(rng, 5, max);
      part2 = randInt(rng, 5, max);
    }
    const whole = part1 + part2;

    if (opParam === "add") {
      const text = `${name} ${scenario.verb} ${scenario.format(part1)} ${scenario.part1Label} and ${scenario.format(part2)} ${scenario.part2Label}. Before you compute, decide: is ${name}'s ${scenario.wholeNoun} the whole, or just one part of it? Then find ${name}'s ${scenario.wholeNoun}.`;
      return {
        prompt: {
          view: "barModelPartWhole",
          kind: "WORD_PROBLEM",
          stage: "PICTORIAL",
          text,
          data: { part1, part2, unit: scenario.wholeNoun },
        },
        answer: {
          value: whole,
          explanation: `${name}'s ${scenario.wholeNoun} is the whole. Both parts are known, so add them: ${scenario.format(part1)} + ${scenario.format(part2)} = ${scenario.format(whole)}.`,
        },
        meta: { a: part1, b: part2, op: "+", type: "partwhole-reasoning" },
      };
    }

    const text = `${name} ${scenario.verb} ${scenario.format(whole)} in all: ${scenario.format(part1)} ${scenario.part1Label}, and the rest ${scenario.part2Label}. Before you compute, decide: is the amount ${scenario.part2Label} the whole, or just one part of the total? Then find how much that is.`;
    return {
      prompt: {
        view: "barModelPartWhole",
        kind: "WORD_PROBLEM",
        stage: "PICTORIAL",
        text,
        data: { whole, known: part1, unit: scenario.wholeNoun },
      },
      answer: {
        value: part2,
        explanation: `The amount ${scenario.part2Label} is a part, not the whole — the whole (${scenario.format(whole)}) is already given. Subtract the known part: ${scenario.format(whole)} − ${scenario.format(part1)} = ${scenario.format(part2)}.`,
      },
      meta: { a: whole, b: part1, op: "-", type: "partwhole-reasoning" },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

function maskTensDigit(n: number): string {
  const s = String(n);
  const idx = s.length - 2;
  return s.slice(0, idx) + "_" + s.slice(idx + 1);
}

/**
 * Missing digit inside a fully-worked column addition/subtraction that is constructed to
 * force a carry/borrow across the hidden digit's column — so recovering it means reasoning
 * about the regroup (via the whole-number relationship a+b=result), not just column-matching
 * the visible digits, which would silently give the wrong digit here on purpose.
 */
export const addSubHiddenDigitRegroup: Generator = {
  id: "addsub.hiddendigitregroup",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const opParam = (params.op as "add" | "sub" | undefined) ?? (rng() < 0.5 ? "add" : "sub");
    const acrossZero = (params.acrossZero as boolean | undefined) ?? false;
    const threeDigit = difficulty >= 3 || acrossZero;

    let a: number;
    let b: number;

    if (opParam === "add") {
      const aOnes = randInt(rng, 1, 9);
      const aTens = randInt(rng, 1, 9);
      const aHundreds = threeDigit ? randInt(rng, 1, 8) : 0;
      a = aHundreds * 100 + aTens * 10 + aOnes;
      const bOnes = randInt(rng, 10 - aOnes, 9); // guarantees aOnes + bOnes >= 10: a carry out of the ones column
      const bTens = randInt(rng, 1, 9);
      const bHundreds = threeDigit ? randInt(rng, 0, 8) : 0;
      b = bHundreds * 100 + bTens * 10 + bOnes;
    } else if (acrossZero) {
      const aHundreds = randInt(rng, 2, 9);
      const aOnes = randInt(rng, 0, 8);
      a = aHundreds * 100 + aOnes; // tens digit is 0 — the hardest borrow case
      const bOnes = randInt(rng, aOnes + 1, 9); // guarantees a borrow out of the ones column
      const bTens = randInt(rng, 1, 9);
      const bHundreds = randInt(rng, 0, aHundreds - 1);
      b = bHundreds * 100 + bTens * 10 + bOnes;
    } else {
      const aTens = randInt(rng, 2, 9);
      const bOnes = randInt(rng, 1, 9);
      const aOnes = randInt(rng, 0, bOnes - 1); // guarantees a borrow out of the ones column
      const bTens = randInt(rng, 1, aTens - 1); // stays strictly below aTens so a > b regardless of hundreds
      const aHundreds = threeDigit ? randInt(rng, 1, 8) : 0;
      const bHundreds = threeDigit ? randInt(rng, 0, aHundreds) : 0;
      a = aHundreds * 100 + aTens * 10 + aOnes;
      b = bHundreds * 100 + bTens * 10 + bOnes;
    }

    const result = opParam === "add" ? a + b : a - b;
    const hiddenOperand: "a" | "b" = rng() < 0.5 ? "a" : "b";
    const hiddenNumber = hiddenOperand === "a" ? a : b;
    const hiddenDigit = Math.floor(hiddenNumber / 10) % 10;
    const shownA = hiddenOperand === "a" ? maskTensDigit(a) : String(a);
    const shownB = hiddenOperand === "b" ? maskTensDigit(b) : String(b);
    const symbol = opParam === "add" ? "+" : "−";
    const verb = opParam === "add" ? "addition" : "subtraction";
    const regroupPhrase =
      opParam === "add"
        ? "the ones column carries a 1 into the tens column"
        : "the ones column has to borrow a ten, which changes the tens column";

    return {
      prompt: {
        view: "numericAnswer",
        kind: "FILL_IN_BLANK",
        stage: "ABSTRACT",
        text: `In this ${verb}, one digit is hidden: ${shownA} ${symbol} ${shownB} = ${result}. What digit is hidden?`,
        data: {},
      },
      answer: {
        value: hiddenDigit,
        explanation: `${a} ${symbol} ${b} = ${result}, and ${regroupPhrase}, so you can't just match the visible digits column by column — the hidden tens digit of ${hiddenNumber} must be ${hiddenDigit}.`,
      },
      meta: { a, b, op: opParam, hiddenOperand, hiddenDigit },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/**
 * Conceptual true/false about *why* regrouping happens — the carry/borrow mechanism itself —
 * rather than whether a computed sum or difference is correct. Several original templates are
 * mixed so both the wording and the true/false split vary across seeds.
 */
export const addSubRegroupConcept: Generator = {
  id: "addsub.regroupconcept",
  generate(seed): GeneratedInstance {
    const rng = seededRng(seed);
    type Claim = { text: string; isTrue: boolean; explanation: string };
    const templates: Array<() => Claim> = [
      () => {
        const wantTrue = rng() < 0.5;
        const onesA = wantTrue ? randInt(rng, 0, 8) : randInt(rng, 1, 9);
        const onesB = wantTrue ? randInt(rng, onesA + 1, 9) : randInt(rng, 0, onesA);
        const needsRegroup = onesA < onesB;
        return {
          text: `To subtract ${onesB} ones from ${onesA} ones, you first need to regroup 1 ten as 10 ones. Is that true?`,
          isTrue: needsRegroup,
          explanation: needsRegroup
            ? `${onesA} is less than ${onesB}, so there aren't enough ones — you must regroup a ten first.`
            : `${onesA} is already at least ${onesB}, so you can subtract the ones directly with no regrouping.`,
        };
      },
      () => {
        const wantTrue = rng() < 0.5;
        const onesA = wantTrue ? randInt(rng, 5, 9) : randInt(rng, 0, 4);
        const onesB = wantTrue ? randInt(rng, 10 - onesA, 9) : randInt(rng, 0, Math.max(0, 8 - onesA));
        const sum = onesA + onesB;
        const carries = sum >= 10;
        return {
          text: `${onesA} ones plus ${onesB} ones makes ${sum}. That means a 1 gets carried into the tens column. Is that true?`,
          isTrue: carries,
          explanation: carries
            ? `${sum} is 10 or more, so 1 ten gets carried into the tens column and ${sum - 10} ones stay behind.`
            : `${sum} is less than 10, so no carrying is needed — the ones column is done as is.`,
        };
      },
      () =>
        rng() < 0.5
          ? {
              text: `When the tens digit is 0 and a subtraction needs to regroup, you must first regroup a hundred into 10 tens before you can regroup one of those tens into 10 ones. Is that true?`,
              isTrue: true,
              explanation: `With no tens to regroup from, you first break a hundred into 10 tens, then you can break one of those tens into 10 ones.`,
            }
          : {
              text: `When the tens digit is 0 and a subtraction needs to regroup, you can regroup straight from the hundreds digit into the ones column, skipping the tens column entirely. Is that true?`,
              isTrue: false,
              explanation: `Regrouping only ever moves between neighboring places. A hundred becomes 10 tens first, and only then can one of those tens become 10 ones.`,
            },
      () =>
        rng() < 0.5
          ? {
              text: `A ten that gets regrouped into the ones column is worth 10 ones. Is that true?`,
              isTrue: true,
              explanation: `1 ten always equals 10 ones, no matter which column it moves from.`,
            }
          : {
              text: `A ten that gets regrouped into the ones column is worth 100 ones. Is that true?`,
              isTrue: false,
              explanation: `1 ten is worth 10 ones, not 100 — 100 is the value of a hundred, not a ten.`,
            },
    ];
    const { text, isTrue, explanation } = pick(rng, templates)();
    return {
      prompt: {
        view: "findMistake",
        kind: "FIND_THE_MISTAKE",
        stage: "ABSTRACT",
        text,
        data: {},
      },
      answer: { value: isTrue, explanation },
      meta: { isTrue },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

export const additionSubtractionGenerators = [
  numberBondMissingPart,
  additionWithin1000,
  subtractionWithin1000,
  addSubWordProblem,
  addSubMissingOperand,
  addSubFindMistake,
  addSubTwoStep,
  addSubExtremePair,
  additionMissingDigit,
  addSubFactTriangle,
  addSubPartWholeReasoning,
  addSubHiddenDigitRegroup,
  addSubRegroupConcept,
];
