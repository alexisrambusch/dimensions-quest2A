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

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ONES_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
];
const TENS_WORDS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function numberToWords(n: number): string {
  if (n < 20) return ONES_WORDS[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return TENS_WORDS[t] + (o ? `-${ONES_WORDS[o]}` : "");
  }
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return `${ONES_WORDS[h]} hundred${rest ? ` ${numberToWords(rest)}` : ""}`;
}

type Representation = "numeral" | "expanded" | "blocks" | "words";
const REPRESENTATIONS: Representation[] = ["numeral", "expanded", "blocks", "words"];

/** Render a number in one of several equivalent forms, so comparisons can't be won by digit-shape pattern-matching alone. */
function represent(n: number, rep: Representation): string {
  const d = decompose(n);
  switch (rep) {
    case "numeral":
      return String(n);
    case "expanded": {
      const parts: string[] = [];
      if (d.hundreds) parts.push(`${d.hundreds * 100}`);
      if (d.tens) parts.push(`${d.tens * 10}`);
      if (d.ones || parts.length === 0) parts.push(`${d.ones}`);
      return parts.join(" + ");
    }
    case "blocks": {
      const parts: string[] = [];
      if (d.hundreds) parts.push(`${d.hundreds} hundred${d.hundreds !== 1 ? "s" : ""}`);
      if (d.tens) parts.push(`${d.tens} ten${d.tens !== 1 ? "s" : ""}`);
      if (d.ones || parts.length === 0) parts.push(`${d.ones} one${d.ones !== 1 ? "s" : ""}`);
      return parts.join(" ");
    }
    case "words":
      return numberToWords(n);
  }
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

/** Compare two numbers shown in different, equivalent forms — forces real place-value reasoning instead of shape-matching digits. */
export const compareRepresentations: Generator = {
  id: "compare.representations",
  generate(seed, difficulty): GeneratedInstance {
    const rng = seededRng(seed);
    const [lo, hi] = rangeForDifficulty(Math.max(3, difficulty));
    let a = randInt(rng, lo, hi);
    let b = randInt(rng, lo, hi);
    if (rng() < 0.15) b = a;
    const repA = REPRESENTATIONS[Math.floor(rng() * REPRESENTATIONS.length)];
    let repB = REPRESENTATIONS[Math.floor(rng() * REPRESENTATIONS.length)];
    if (repA === "numeral" && repB === "numeral") repB = REPRESENTATIONS[1 + Math.floor(rng() * 3)];
    const symbol = a > b ? ">" : a < b ? "<" : "=";
    return {
      prompt: {
        view: "compareNumbers",
        kind: "MULTIPLE_CHOICE",
        stage: "ABSTRACT",
        text: `Compare the two numbers below.`,
        data: { a: represent(a, repA), b: represent(b, repB), choices: ["<", ">", "="] },
      },
      answer: { value: symbol, explanation: `${a} ${symbol} ${b}.` },
      meta: { a, b },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

/** Which of four differently-represented numbers is the greatest/least? */
export const pickExtreme: Generator = {
  id: "compare.pickextreme",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const [lo, hi] = rangeForDifficulty(Math.max(3, difficulty));
    const mode = (params.mode as "greatest" | "least" | undefined) ?? (rng() < 0.5 ? "greatest" : "least");
    const values = new Set<number>();
    while (values.size < 4) values.add(randInt(rng, lo, hi));
    const reps = shuffle(REPRESENTATIONS, rng);
    const labeled = Array.from(values).map((v, i) => ({ v, label: represent(v, reps[i % reps.length]) }));
    const target = mode === "greatest" ? Math.max(...labeled.map((x) => x.v)) : Math.min(...labeled.map((x) => x.v));
    const correctLabel = labeled.find((x) => x.v === target)!.label;
    return {
      prompt: {
        view: "chooseUnit",
        kind: "MULTIPLE_CHOICE",
        stage: "ABSTRACT",
        text: `Which shows the ${mode} number?`,
        data: { choices: labeled.map((x) => x.label) },
      },
      answer: { value: correctLabel, explanation: `${target} is the ${mode} of the four numbers shown.` },
      meta: { values: labeled.map((x) => x.v), mode },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

/** "Is this decomposition correct?" — tests whether a student can catch a plausible place-value slip, not just produce one. */
export const placeValueClaim: Generator = {
  id: "placevalue.findmistake",
  generate(seed, difficulty): GeneratedInstance {
    const rng = seededRng(seed);
    const [lo, hi] = rangeForDifficulty(Math.max(2, difficulty));
    const target = randInt(rng, lo, hi);
    const d = decompose(target);
    const isTrue = rng() < 0.5;
    let claimed = { ...d };
    if (!isTrue) {
      const kind = Math.floor(rng() * 3);
      if (kind === 0 && d.hundreds !== d.tens) claimed = { hundreds: d.tens, tens: d.hundreds, ones: d.ones };
      else if (kind === 1 && d.tens !== d.ones) claimed = { hundreds: d.hundreds, tens: d.ones, ones: d.tens };
      else claimed = { ...d, ones: (d.ones + 1 + Math.floor(rng() * 8)) % 10 };
      if (claimed.hundreds === d.hundreds && claimed.tens === d.tens && claimed.ones === d.ones) {
        claimed = { ...d, ones: (d.ones + 3) % 10 };
      }
    }
    const claimText = `${target} = ${claimed.hundreds} hundred${claimed.hundreds !== 1 ? "s" : ""} + ${claimed.tens} ten${claimed.tens !== 1 ? "s" : ""} + ${claimed.ones} one${claimed.ones !== 1 ? "s" : ""}`;
    return {
      prompt: {
        view: "findMistake",
        kind: "FIND_THE_MISTAKE",
        stage: "ABSTRACT",
        text: `${claimText}. Is this correct?`,
        data: {},
      },
      answer: { value: isTrue, explanation: `${target} = ${d.hundreds} hundreds + ${d.tens} tens + ${d.ones} ones.` },
      meta: { target },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

/** A character makes a comparison claim that's sometimes wrong — catches the classic "compare the wrong digit" misconception. */
export const compareClaim: Generator = {
  id: "compare.findmistake",
  generate(seed, difficulty): GeneratedInstance {
    const rng = seededRng(seed);
    const [lo, hi] = rangeForDifficulty(Math.max(2, difficulty));
    const a = randInt(rng, lo, hi);
    let b = randInt(rng, lo, hi);
    while (a === b) b = randInt(rng, lo, hi);
    const actualSymbol = a > b ? ">" : "<";
    const isTrue = rng() < 0.5;
    const claimedSymbol = isTrue ? actualSymbol : actualSymbol === ">" ? "<" : ">";
    const names = ["Maya", "Leo", "Priya", "Sam", "Nina", "Omar"];
    const name = names[Math.floor(rng() * names.length)];
    return {
      prompt: {
        view: "findMistake",
        kind: "FIND_THE_MISTAKE",
        stage: "ABSTRACT",
        text: `${name} says ${a} ${claimedSymbol} ${b}. Is ${name} correct?`,
        data: {},
      },
      answer: { value: isTrue, explanation: `${a} ${actualSymbol} ${b}.` },
      meta: { a, b },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

/** A skip-counting sequence that's sometimes seeded with one wrong step to spot. */
export const patternMistake: Generator = {
  id: "pattern.findmistake",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const step = (params.step as number | undefined) ?? (rng() < 0.5 ? 10 : 100);
    const maxStart = step === 10 ? 600 : 400;
    const start = randInt(rng, 0, Math.floor(maxStart / step)) * step;
    const sequence = Array.from({ length: 5 }, (_, i) => start + i * step);
    const isTrue = rng() < 0.5;
    const shown = [...sequence];
    if (!isTrue) {
      const idx = randInt(rng, 1, 3);
      const wrongDelta = (rng() < 0.5 ? -1 : 1) * randInt(rng, 1, Math.max(1, step - 1));
      shown[idx] = sequence[idx] + wrongDelta;
    }
    return {
      prompt: {
        view: "findMistake",
        kind: "FIND_THE_MISTAKE",
        stage: "PICTORIAL",
        text: `${shown.join(", ")} — is this counting by ${step}s correctly?`,
        data: {},
      },
      answer: { value: isTrue, explanation: `Counting by ${step}s: ${sequence.join(", ")}.` },
      meta: { sequence, step },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

/** "I'm thinking of a number..." — a place-value riddle that requires composing digits from clues rather than reading them off blocks. */
export const placeValueRiddle: Generator = {
  id: "placevalue.riddle",
  generate(seed): GeneratedInstance {
    const rng = seededRng(seed);
    const h = randInt(rng, 1, 9);
    let sign = rng() < 0.5 ? 1 : -1;
    if (h + 1 > 9) sign = -1;
    const maxOffset = sign > 0 ? 9 - h : h;
    const offset = randInt(rng, 1, Math.max(1, maxOffset));
    const t = h + sign * offset;
    const ones = h;
    const target = h * 100 + t * 10 + ones;
    const offsetPhrase = sign > 0 ? `${offset} more than` : `${offset} less than`;
    const text = `I have a 3-digit number. The hundreds digit is ${h}. The tens digit is ${offsetPhrase} the hundreds digit. The ones digit is the same as the hundreds digit. What is my number?`;
    return {
      prompt: {
        view: "numericAnswer",
        kind: "WORD_PROBLEM",
        stage: "ABSTRACT",
        text,
        data: {},
      },
      answer: { value: target, explanation: `Hundreds = ${h}, tens = ${t}, ones = ${h}, so the number is ${target}.` },
      meta: { target },
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
  compareRepresentations,
  pickExtreme,
  placeValueClaim,
  compareClaim,
  patternMistake,
  placeValueRiddle,
];
