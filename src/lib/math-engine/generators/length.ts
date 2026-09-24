import type { Generator, GeneratedInstance, ValidationResult } from "../types";
import { seededRng, randInt, pick } from "../random";
import { toNumber, validateNumeric } from "../numeric";

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface LengthObject {
  name: string;
  length: number; // ground-truth length, in the generator's chosen unit
  icon: string;
}

const CM_OBJECTS: LengthObject[] = [
  { name: "pencil", length: 18, icon: "pencil" },
  { name: "crayon", length: 9, icon: "crayon" },
  { name: "toy car", length: 12, icon: "car" },
  { name: "book", length: 24, icon: "book" },
  { name: "shoe", length: 21, icon: "shoe" },
  { name: "spoon", length: 15, icon: "spoon" },
  { name: "hairbrush", length: 20, icon: "brush" },
  { name: "marker", length: 14, icon: "marker" },
];

// Whole-inch lengths chosen independently of the cm list (not converted) so
// every measurement reads as a clean whole number on the ruler.
const INCH_OBJECTS: LengthObject[] = [
  { name: "pencil", length: 7, icon: "pencil" },
  { name: "crayon", length: 3, icon: "crayon" },
  { name: "toy car", length: 5, icon: "car" },
  { name: "book", length: 9, icon: "book" },
  { name: "shoe", length: 8, icon: "shoe" },
  { name: "spoon", length: 6, icon: "spoon" },
  { name: "marker", length: 5, icon: "marker" },
];

type UnitSystem = "metric" | "customary";

/** Choose the reasonable unit for measuring an everyday object or distance. */
export const lengthChooseUnit: Generator = {
  id: "length.chooseunit",
  generate(seed, _difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const system = (params.system as UnitSystem | undefined) ?? "metric";

    const options =
      system === "metric"
        ? {
            small: [
              { name: "pencil", unit: "centimeters" },
              { name: "crayon", unit: "centimeters" },
              { name: "eraser", unit: "centimeters" },
              { name: "spoon", unit: "centimeters" },
            ],
            large: [
              { name: "hallway", unit: "meters" },
              { name: "swimming pool", unit: "meters" },
              { name: "school bus", unit: "meters" },
              { name: "playground", unit: "meters" },
            ],
          }
        : {
            small: [
              { name: "pencil", unit: "inches" },
              { name: "crayon", unit: "inches" },
              { name: "paperclip", unit: "inches" },
              { name: "phone", unit: "inches" },
            ],
            large: [
              { name: "hallway", unit: "feet" },
              { name: "football field", unit: "feet" },
              { name: "school bus", unit: "feet" },
              { name: "classroom", unit: "feet" },
            ],
          };

    const useSmall = rng() < 0.5;
    const obj = pick(rng, useSmall ? options.small : options.large);
    const choices = system === "metric" ? ["centimeters", "meters"] : ["inches", "feet"];
    return {
      prompt: {
        view: "chooseUnit",
        kind: "MULTIPLE_CHOICE",
        stage: "ABSTRACT",
        text: `Which unit would you use to measure the length of a ${obj.name}?`,
        data: { object: obj.name, choices },
      },
      answer: { value: obj.unit, explanation: `A ${obj.name} is best measured in ${obj.unit}.` },
      meta: { object: obj.name },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

/** Estimate an object's length, then "measure" it on a virtual ruler and compare. */
export const lengthEstimateThenMeasure: Generator = {
  id: "length.estimatemeasure",
  generate(seed, _difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const unit = (params.unit as "cm" | "in" | undefined) ?? "cm";
    const bank = unit === "in" ? INCH_OBJECTS : CM_OBJECTS;
    const obj = pick(rng, bank);
    const unitLabel = unit === "in" ? "inches" : "centimeters";
    const maxLength = unit === "in" ? 12 : 30;
    return {
      prompt: {
        view: "rulerMeasure",
        kind: "ESTIMATION",
        stage: "CONCRETE",
        text: `About how long is the ${obj.name}? Estimate first, then measure it with the ruler.`,
        data: { object: obj.name, icon: obj.icon, actualLength: obj.length, maxLength, unit, unitLabel },
      },
      answer: {
        value: obj.length,
        explanation: `The ${obj.name} is ${obj.length} ${unitLabel} long.`,
      },
      meta: { object: obj.name, actualLength: obj.length, unit },
    };
  },
  validate(response, answer): ValidationResult {
    if (typeof response !== "object" || response === null) return { correct: false, errorTag: "NO_RESPONSE" };
    const r = response as Record<string, unknown>;
    const measured = toNumber(r.measured);
    if (measured === null) return { correct: false, errorTag: "NO_RESPONSE" };
    // Ruler reading tolerance of +/-1 unit accounts for endpoint rounding.
    const correct = Math.abs(measured - (answer.value as number)) <= 1;
    return { correct };
  },
};

/** Compare two measured objects and pick the longer one. */
export const lengthCompare: Generator = {
  id: "length.compare",
  generate(seed, _difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const unit = (params.unit as "cm" | "in" | undefined) ?? "cm";
    const bank = unit === "in" ? INCH_OBJECTS : CM_OBJECTS;
    const unitLabel = unit === "in" ? "inches" : "centimeters";
    let a = pick(rng, bank);
    let b = pick(rng, bank);
    let guard = 0;
    while (a.length === b.length && guard < 10) {
      b = pick(rng, bank);
      guard++;
    }
    const longer = a.length >= b.length ? a : b;
    return {
      prompt: {
        view: "compareLengths",
        kind: "MULTIPLE_CHOICE",
        stage: "PICTORIAL",
        text: `Which is longer?`,
        data: {
          options: [
            { name: a.name, icon: a.icon, length: a.length },
            { name: b.name, icon: b.icon, length: b.length },
          ],
          unitLabel,
        },
      },
      answer: {
        value: longer.name,
        explanation: `The ${longer.name} is ${longer.length} ${unitLabel} long, which is longer.`,
      },
      meta: { a: a.length, b: b.length },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

interface EstimateItem {
  object: string;
  correct: number;
  decoys: [number, number];
}

const REASONABLE_ESTIMATE_ITEMS: Record<"m" | "cm" | "in" | "ft", EstimateItem[]> = {
  m: [
    { object: "a doorway's height", correct: 2, decoys: [6, 10] },
    { object: "a telephone pole's height", correct: 8, decoys: [3, 20] },
    { object: "a school bus's length", correct: 12, decoys: [4, 40] },
    { object: "a soccer field's length", correct: 100, decoys: [20, 300] },
    { object: "a 3-story building's height", correct: 12, decoys: [4, 60] },
  ],
  cm: [
    { object: "a crayon's length", correct: 8, decoys: [2, 30] },
    { object: "a shoe's length", correct: 22, decoys: [8, 60] },
    { object: "a school desk's height", correct: 60, decoys: [15, 150] },
  ],
  in: [
    { object: "a butterfly's wingspan", correct: 4, decoys: [1, 15] },
    { object: "an envelope's length", correct: 9, decoys: [3, 20] },
    { object: "a hammer's length", correct: 12, decoys: [4, 30] },
  ],
  ft: [
    { object: "a giraffe's height", correct: 16, decoys: [5, 40] },
    { object: "a car's length", correct: 14, decoys: [4, 40] },
    { object: "a basketball hoop's height", correct: 10, decoys: [3, 25] },
  ],
};
const UNIT_LABELS: Record<"m" | "cm" | "in" | "ft", string> = { m: "m", cm: "cm", in: "in", ft: "ft" };

/** "Which is a reasonable estimate?" — tests a feel for real-world scale, not just ruler-reading. */
export const lengthReasonableEstimate: Generator = {
  id: "length.reasonableestimate",
  generate(seed, _difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const unit = (params.unit as "m" | "cm" | "in" | "ft" | undefined) ?? "m";
    const item = pick(rng, REASONABLE_ESTIMATE_ITEMS[unit]);
    const unitLabel = UNIT_LABELS[unit];
    const choices = shuffle([item.correct, ...item.decoys], rng).map((n) => `${n} ${unitLabel}`);
    return {
      prompt: {
        view: "chooseUnit",
        kind: "MULTIPLE_CHOICE",
        stage: "ABSTRACT",
        text: `Which is a reasonable estimate for ${item.object}?`,
        data: { choices },
      },
      answer: { value: `${item.correct} ${unitLabel}`, explanation: `${item.object[0].toUpperCase()}${item.object.slice(1)} is about ${item.correct} ${unitLabel}.` },
      meta: { object: item.object, correct: item.correct, unit },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

/** "Is this measurement correct?" — catches a plausible off-by-a-little ruler-reading slip. */
export const lengthRulerFindMistake: Generator = {
  id: "length.rulerfindmistake",
  generate(seed, _difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const unit = (params.unit as "cm" | "in" | undefined) ?? "cm";
    const bank = unit === "in" ? INCH_OBJECTS : CM_OBJECTS;
    const obj = pick(rng, bank);
    const unitLabel = unit === "in" ? "inches" : "centimeters";
    const isTrue = rng() < 0.5;
    const shown = isTrue ? obj.length : obj.length + (rng() < 0.5 ? 1 : -1) * randInt(rng, 1, 3);
    return {
      prompt: {
        view: "findMistake",
        kind: "FIND_THE_MISTAKE",
        stage: "ABSTRACT",
        text: `A student measured the ${obj.name} and got ${shown} ${unitLabel}. The ${obj.name} is actually ${obj.length} ${unitLabel} long. Is the student's measurement correct?`,
        data: {},
      },
      answer: { value: isTrue, explanation: `The ${obj.name} is ${obj.length} ${unitLabel} long.` },
      meta: { object: obj.name, actual: obj.length, shown },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

/** Compare three objects at once — pick the longest or shortest, not just "which of these two." */
export const lengthCompareThree: Generator = {
  id: "length.comparethree",
  generate(seed, _difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const unit = (params.unit as "cm" | "in" | undefined) ?? "cm";
    const mode = (params.mode as "longest" | "shortest" | undefined) ?? (rng() < 0.5 ? "longest" : "shortest");
    const bank = unit === "in" ? INCH_OBJECTS : CM_OBJECTS;
    const unitLabel = unit === "in" ? "inches" : "centimeters";
    const pool = [...bank];
    const chosen: LengthObject[] = [];
    while (chosen.length < 3 && pool.length) {
      const idx = Math.floor(rng() * pool.length);
      chosen.push(pool.splice(idx, 1)[0]);
    }
    const target =
      mode === "longest"
        ? chosen.reduce((a, b) => (b.length > a.length ? b : a))
        : chosen.reduce((a, b) => (b.length < a.length ? b : a));
    return {
      prompt: {
        view: "compareLengths",
        kind: "MULTIPLE_CHOICE",
        stage: "PICTORIAL",
        text: `Which is the ${mode}?`,
        data: { options: chosen.map((o) => ({ name: o.name, icon: o.icon, length: o.length })), unitLabel },
      },
      answer: { value: target.name, explanation: `The ${target.name} is ${target.length} ${unitLabel} long, the ${mode}.` },
      meta: { chosen: chosen.map((c) => c.length), mode },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

/** "How much longer is A than B?" — a length word problem with a numeric, not multiple-choice, answer. */
export const lengthDifference: Generator = {
  id: "length.difference",
  generate(seed, _difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const unit = (params.unit as "cm" | "in" | undefined) ?? "cm";
    const bank = unit === "in" ? INCH_OBJECTS : CM_OBJECTS;
    const unitLabel = unit === "in" ? "inches" : "centimeters";
    let a = pick(rng, bank);
    let b = pick(rng, bank);
    let guard = 0;
    while (a.length === b.length && guard < 10) {
      b = pick(rng, bank);
      guard++;
    }
    const longer = a.length > b.length ? a : b;
    const shorter = a.length > b.length ? b : a;
    const diff = longer.length - shorter.length;
    return {
      prompt: {
        view: "numericAnswer",
        kind: "WORD_PROBLEM",
        stage: "ABSTRACT",
        text: `The ${longer.name} is ${longer.length} ${unitLabel} long. The ${shorter.name} is ${shorter.length} ${unitLabel} long. How much longer is the ${longer.name} than the ${shorter.name}?`,
        data: {},
      },
      answer: { value: diff, explanation: `${longer.length} − ${shorter.length} = ${diff} ${unitLabel}.` },
      meta: { a: longer.length, b: shorter.length },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

export const lengthGenerators = [
  lengthChooseUnit,
  lengthEstimateThenMeasure,
  lengthCompare,
  lengthReasonableEstimate,
  lengthRulerFindMistake,
  lengthCompareThree,
  lengthDifference,
];
