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

const INCH_TO_CM = 2.54;

function inchesChoicesForDifficulty(difficulty: number): number[] {
  if (difficulty <= 1) return [1, 2, 3];
  if (difficulty <= 3) return [2, 4, 6, 8];
  return [6, 8, 10, 12];
}

/**
 * "About how many centimeters is N inches — closer to X or Y?" Grounds the
 * ~2.5 cm-per-inch relationship in estimation/reasoning rather than exact
 * conversion arithmetic.
 */
export const lengthUnitEquivalence: Generator = {
  id: "length.unitequivalence",
  generate(seed, difficulty, _params): GeneratedInstance {
    const rng = seededRng(seed);
    const inches = pick(rng, inchesChoicesForDifficulty(difficulty));
    const actualCm = inches * INCH_TO_CM;
    const step = inches <= 2 ? 1 : inches <= 6 ? 2 : 5;
    const low = Math.floor(actualCm / step) * step;
    const high = low + step;
    const correctIsLow = actualCm - low < high - actualCm;
    const correctValue = correctIsLow ? low : high;
    const plural = inches === 1 ? "" : "es";
    const choices = shuffle([`${low} cm`, `${high} cm`], rng);
    const text = correctIsLow
      ? `${inches} inch${plural} is a little more than how many centimeters — ${low} cm or ${high} cm?`
      : `About how many centimeters is ${inches} inch${plural} — is it closer to ${low} cm or ${high} cm?`;
    return {
      prompt: {
        view: "chooseUnit",
        kind: "MULTIPLE_CHOICE",
        stage: "ABSTRACT",
        text,
        data: { choices },
      },
      answer: {
        value: `${correctValue} cm`,
        explanation: `1 inch is about 2.5 cm, so ${inches} inch${plural} is about ${actualCm.toFixed(1)} cm — closer to ${correctValue} cm.`,
      },
      meta: { inches, actualCm, low, high, correctValue },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

const TRANSITIVE_NAME_POOL = ["Maya", "Theo", "Priya", "Diego", "Nora", "Sam", "Elena", "Lucas", "Amara", "Jun"];
const TRANSITIVE_CATEGORIES = ["ribbon", "rope", "scarf", "string", "garden hose"];

function transitiveEntityCount(difficulty: number, rng: () => number): number {
  if (difficulty <= 2) return 3;
  return pick(rng, [3, 4]);
}

/**
 * Transitive-comparison logic puzzle: a chain of relative-length clues (each
 * true by construction, since it's read directly off a random strict rank
 * order) pins down a single, unambiguous longest/shortest answer.
 */
export const lengthTransitiveCompare: Generator = {
  id: "length.transitivecompare",
  generate(seed, difficulty, _params): GeneratedInstance {
    const rng = seededRng(seed);
    const k = transitiveEntityCount(difficulty, rng);
    const category = pick(rng, TRANSITIVE_CATEGORIES);
    // names[0] is defined as the longest, names[k-1] as the shortest — the
    // shuffle itself *is* the random rank assignment, so ranks are always a
    // strict total order with no ties.
    const names = shuffle(TRANSITIVE_NAME_POOL, rng).slice(0, k);
    const entities = names.map((n) => `${n}'s ${category}`);
    const clues: string[] = [`${entities[1]} is shorter than ${entities[0]} but longer than ${entities[2]}.`];
    for (let i = 3; i < k; i++) {
      clues.push(`${entities[i]} is shorter than ${entities[i - 1]}.`);
    }
    const askLongest = rng() < 0.5;
    const answerName = askLongest ? names[0] : names[k - 1];
    const questionText = askLongest ? `Whose ${category} is the longest?` : `Whose ${category} is the shortest?`;
    const choices = shuffle(names, rng);
    return {
      prompt: {
        view: "chooseUnit",
        kind: "MULTIPLE_CHOICE",
        stage: "ABSTRACT",
        text: `${clues.join(" ")} ${questionText}`,
        data: { choices },
      },
      answer: {
        value: answerName,
        explanation: `Putting the clues in order from longest to shortest: ${names.join(" > ")}. So ${answerName}'s ${category} is the ${askLongest ? "longest" : "shortest"}.`,
      },
      meta: { names, category, askLongest },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

function precisionMarkForDifficulty(difficulty: number, rng: () => number): number {
  const maxMark = difficulty <= 2 ? 8 : difficulty <= 4 ? 12 : 16;
  return randInt(rng, 2, maxMark);
}

/**
 * True/false check on what a ruler reading actually tells you: a line that
 * doesn't land right on a mark can't be reported as an exact whole number
 * with full confidence.
 */
export const lengthMeasurementPrecision: Generator = {
  id: "length.measureprecision",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const unit = (params.unit as "cm" | "in" | undefined) ?? "cm";
    const L = precisionMarkForDifficulty(difficulty, rng);
    const scenario = pick(rng, ["nearLower", "nearUpper", "halfway"] as const);

    let positionText: string;
    let claimed: number;
    let value: boolean;
    let explanation: string;

    if (scenario === "halfway") {
      positionText = `right at the halfway point between the ${L} ${unit} and ${L + 1} ${unit} marks`;
      claimed = pick(rng, [L, L + 1]);
      value = true;
      explanation = `The end sits exactly halfway between ${L} and ${L + 1} ${unit}, so the true length is about ${L}.5 ${unit} — not exactly ${claimed} ${unit}. A reading that lands right between two marks can't be reported as one exact whole mark.`;
    } else {
      const nearLow = scenario === "nearLower";
      const nearestMark = nearLow ? L : L + 1;
      positionText = nearLow
        ? `just a little past the ${L} ${unit} mark`
        : `just a little before the ${L + 1} ${unit} mark`;
      claimed = pick(rng, [L, L + 1]);
      const claimMatches = claimed === nearestMark;
      value = !claimMatches;
      explanation = claimMatches
        ? `The end sits ${positionText}, so rounding to the nearest mark, ${claimed} ${unit} is a reasonable reading.`
        : `The end sits ${positionText}, so the nearest mark is ${nearestMark} ${unit}, not ${claimed} ${unit} — that reading doesn't match where the line actually ends.`;
    }

    return {
      prompt: {
        view: "findMistake",
        kind: "FIND_THE_MISTAKE",
        stage: "ABSTRACT",
        text: `A line's end sits ${positionText}. Someone says it measures exactly ${claimed} ${unit}. Could they be wrong?`,
        data: {},
      },
      answer: { value, explanation },
      meta: { L, unit, scenario, claimed },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

const SPACED_OBJECTS: { singular: string; plural: string }[] = [
  { singular: "lamp post", plural: "lamp posts" },
  { singular: "tree", plural: "trees" },
  { singular: "fence post", plural: "fence posts" },
  { singular: "flag", plural: "flags" },
  { singular: "mailbox", plural: "mailboxes" },
];

function spacingRangeForDifficulty(difficulty: number): [number, number] {
  if (difficulty <= 1) return [1, 4];
  if (difficulty <= 3) return [2, 8];
  return [3, 15];
}

/**
 * Evenly spaced objects along a line — relate the gap between neighbors to
 * the total span across all of them, in either direction.
 */
export const lengthEvenSpacing: Generator = {
  id: "length.evenspacing",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const unit = (params.unit as "m" | "ft" | undefined) ?? "m";
    const [lo, hi] = spacingRangeForDifficulty(difficulty);
    const spacing = randInt(rng, lo, hi);
    const postCount = randInt(rng, 4, 7);
    const gaps = postCount - 1;
    const total = gaps * spacing;
    const obj = pick(rng, SPACED_OBJECTS);
    const askSpacing = rng() < 0.5;

    if (askSpacing) {
      return {
        prompt: {
          view: "numericAnswer",
          kind: "WORD_PROBLEM",
          stage: "ABSTRACT",
          text: `${postCount} ${obj.plural} stand in a row, evenly spaced. The distance from the first ${obj.singular} to the last ${obj.singular} is ${total} ${unit}. How far apart are two neighboring ${obj.plural}?`,
          data: {},
        },
        answer: {
          value: spacing,
          explanation: `${postCount} ${obj.plural} in a row make ${gaps} equal gaps. ${total} ÷ ${gaps} = ${spacing} ${unit}.`,
        },
        meta: { postCount, spacing, total, unit },
      };
    }
    return {
      prompt: {
        view: "numericAnswer",
        kind: "WORD_PROBLEM",
        stage: "ABSTRACT",
        text: `${postCount} ${obj.plural} stand in a row, spaced ${spacing} ${unit} apart from each other. How far is it from the first ${obj.singular} to the last ${obj.singular}?`,
        data: {},
      },
      answer: {
        value: total,
        explanation: `${postCount} ${obj.plural} in a row make ${gaps} equal gaps of ${spacing} ${unit} each. ${gaps} × ${spacing} = ${total} ${unit}.`,
      },
      meta: { postCount, spacing, total, unit },
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
  lengthUnitEquivalence,
  lengthTransitiveCompare,
  lengthMeasurementPrecision,
  lengthEvenSpacing,
];
