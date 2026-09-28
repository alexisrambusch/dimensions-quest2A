import type { Generator, GeneratedInstance, ValidationResult } from "../types";
import { seededRng, randInt, pick } from "../random";
import { validateNumeric } from "../numeric";

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function article(word: string): string {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

function capitalizedArticle(word: string): string {
  const a = article(word);
  return a[0].toUpperCase() + a.slice(1);
}

interface WeightObject {
  name: string;
  band: "grams" | "kilograms" | "ounces" | "pounds";
  icon: string;
}

const METRIC_OBJECTS: WeightObject[] = [
  { name: "apple", band: "grams", icon: "apple" },
  { name: "feather", band: "grams", icon: "feather" },
  { name: "strawberry", band: "grams", icon: "strawberry" },
  { name: "paperclip", band: "grams", icon: "paperclip" },
  { name: "dog", band: "kilograms", icon: "dog" },
  { name: "bag of rice", band: "kilograms", icon: "rice" },
  { name: "bicycle", band: "kilograms", icon: "bike" },
  { name: "watermelon", band: "kilograms", icon: "watermelon" },
];

// Ounces/pounds is the customary weight pair (parallel to inches/feet for
// length) — small, light objects in ounces and heavier ones in pounds.
const CUSTOMARY_OBJECTS: WeightObject[] = [
  { name: "slice of bread", band: "ounces", icon: "bread" },
  { name: "cookie", band: "ounces", icon: "cookie" },
  { name: "pencil", band: "ounces", icon: "pencil" },
  { name: "strawberry", band: "ounces", icon: "strawberry" },
  { name: "cat", band: "pounds", icon: "cat" },
  { name: "bag of flour", band: "pounds", icon: "rice" },
  { name: "textbook", band: "pounds", icon: "book" },
  { name: "watermelon", band: "pounds", icon: "watermelon" },
];

type UnitSystem = "metric" | "customary";

export const weightChooseUnit: Generator = {
  id: "weight.chooseunit",
  generate(seed, _difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const system = (params.system as UnitSystem | undefined) ?? "metric";
    const bank = system === "metric" ? METRIC_OBJECTS : CUSTOMARY_OBJECTS;
    const choices = system === "metric" ? ["grams", "kilograms"] : ["ounces", "pounds"];
    const obj = pick(rng, bank);
    return {
      prompt: {
        view: "chooseUnit",
        kind: "MULTIPLE_CHOICE",
        stage: "ABSTRACT",
        text: `Which unit would you use to weigh ${article(obj.name)} ${obj.name}?`,
        data: { object: obj.name, icon: obj.icon, choices },
      },
      answer: { value: obj.band, explanation: `${capitalizedArticle(obj.name)} ${obj.name} is best weighed in ${obj.band}.` },
      meta: { object: obj.name },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

/** "About how much does this weigh?" — reasoned estimation against a familiar benchmark. */
export const weightEstimate: Generator = {
  id: "weight.estimate",
  generate(seed, _difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const system = (params.system as UnitSystem | undefined) ?? "metric";
    const benchmark = system === "metric" ? "1 kilogram" : "1 pound";
    const lightBand = system === "metric" ? "grams" : "ounces";
    const bank = system === "metric" ? METRIC_OBJECTS : CUSTOMARY_OBJECTS;
    const obj = pick(rng, bank);
    const correctLabel = obj.band === lightBand ? `less than ${benchmark}` : `more than ${benchmark}`;
    const choices = [`less than ${benchmark}`, `more than ${benchmark}`];
    return {
      prompt: {
        view: "weightEstimate",
        kind: "ESTIMATION",
        stage: "PICTORIAL",
        text: `About how much does ${article(obj.name)} ${obj.name} weigh?`,
        data: { object: obj.name, icon: obj.icon, choices },
      },
      answer: { value: correctLabel, explanation: `${capitalizedArticle(obj.name)} ${obj.name} is ${correctLabel}.` },
      meta: { object: obj.name },
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

const REASONABLE_WEIGHT_ITEMS: Record<"g" | "kg" | "oz" | "lb", EstimateItem[]> = {
  g: [
    { object: "a strawberry", correct: 12, decoys: [2, 120] },
    { object: "a pencil", correct: 5, decoys: [1, 50] },
    { object: "a slice of bread", correct: 25, decoys: [5, 250] },
  ],
  kg: [
    { object: "a bag of rice", correct: 2, decoys: [10, 50] },
    { object: "a bicycle", correct: 11, decoys: [2, 60] },
    { object: "a watermelon", correct: 4, decoys: [1, 20] },
  ],
  oz: [
    { object: "a slice of bread", correct: 1, decoys: [8, 20] },
    { object: "a cookie", correct: 1, decoys: [6, 15] },
  ],
  lb: [
    { object: "a cat", correct: 9, decoys: [2, 40] },
    { object: "a textbook", correct: 3, decoys: [1, 20] },
    { object: "a watermelon", correct: 10, decoys: [2, 50] },
  ],
};

/** "Which is a reasonable estimate?" for weight, the same real-world-scale reasoning as the length version. */
export const weightReasonableEstimate: Generator = {
  id: "weight.reasonableestimate",
  generate(seed, _difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const unit = (params.unit as "g" | "kg" | "oz" | "lb" | undefined) ?? "g";
    const item = pick(rng, REASONABLE_WEIGHT_ITEMS[unit]);
    const choices = shuffle([item.correct, ...item.decoys], rng).map((n) => `${n} ${unit}`);
    return {
      prompt: {
        view: "chooseUnit",
        kind: "MULTIPLE_CHOICE",
        stage: "ABSTRACT",
        text: `Which is a reasonable estimate for the weight of ${item.object}?`,
        data: { choices },
      },
      answer: { value: `${item.correct} ${unit}`, explanation: `${item.object[0].toUpperCase()}${item.object.slice(1)} weighs about ${item.correct} ${unit}.` },
      meta: { object: item.object, correct: item.correct, unit },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

const GRAM_BLOCK_VALUES = [1, 2, 5, 10, 20, 50, 100, 200, 500];
const POUND_BLOCK_VALUES = [1, 2, 3, 4, 5, 10];

/** Add up a set of balance-scale weights — the "20g + 20g + 5g + 5g = ?" style of problem. */
export const weightSumBlocks: Generator = {
  id: "weight.sumblocks",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const system = (params.system as UnitSystem | undefined) ?? "metric";
    const unitLabel = system === "metric" ? "g" : "lb";
    const values = system === "metric" ? GRAM_BLOCK_VALUES : POUND_BLOCK_VALUES;
    const count = difficulty <= 2 ? 2 : difficulty <= 4 ? 3 : 4;
    const blocks: number[] = [];
    for (let i = 0; i < count; i++) blocks.push(pick(rng, values));
    const total = blocks.reduce((a, b) => a + b, 0);
    const objects = ["toy box", "book", "melon", "backpack", "stapler"];
    const obj = pick(rng, objects);
    const text = `A ${obj} balances exactly against these weights: ${blocks.map((b) => `${b} ${unitLabel}`).join(", ")}. How much does the ${obj} weigh?`;
    return {
      prompt: {
        view: "numericAnswer",
        kind: "WORD_PROBLEM",
        stage: "ABSTRACT",
        text,
        data: {},
      },
      answer: { value: total, explanation: `${blocks.join(" + ")} = ${total} ${unitLabel}.` },
      meta: { blocks, total },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

/** Find the missing weight needed to balance a scale — the inverse of simply summing blocks. */
export const weightMissingBalance: Generator = {
  id: "weight.missingbalance",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const system = (params.system as UnitSystem | undefined) ?? "metric";
    const unitLabel = system === "metric" ? "g" : "lb";
    const values = system === "metric" ? GRAM_BLOCK_VALUES : POUND_BLOCK_VALUES;
    const count = difficulty <= 3 ? 2 : 3;
    const known: number[] = [];
    for (let i = 0; i < count; i++) known.push(pick(rng, values));
    const missing = pick(rng, values);
    const total = known.reduce((a, b) => a + b, 0) + missing;
    const text = `One side of the scale holds ${known.map((k) => `${k} ${unitLabel}`).join(" + ")} plus one more weight. Together they balance ${total} ${unitLabel}. What is the missing weight?`;
    return {
      prompt: {
        view: "numericAnswer",
        kind: "WORD_PROBLEM",
        stage: "ABSTRACT",
        text,
        data: {},
      },
      answer: { value: missing, explanation: `${total} − (${known.join(" + ")}) = ${missing} ${unitLabel}.` },
      meta: { known, missing, total },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

const METRIC_COMPARE_OBJECTS = ["melon", "pumpkin", "backpack", "toy robot"];
const CUSTOMARY_COMPARE_OBJECTS = ["puppy", "toolbox", "pumpkin", "bag of apples"];

/** "How much lighter is A than B?" — a weight word problem with a numeric, not multiple-choice, answer. */
export const weightCompareObjects: Generator = {
  id: "weight.compareobjects",
  generate(seed, _difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const system = (params.system as UnitSystem | undefined) ?? "metric";
    const unitLabel = system === "metric" ? "g" : "lb";
    const max = system === "metric" ? 950 : 20;
    const bank = system === "metric" ? METRIC_COMPARE_OBJECTS : CUSTOMARY_COMPARE_OBJECTS;
    const objA = pick(rng, bank);
    let objB = pick(rng, bank);
    while (objB === objA) objB = pick(rng, bank);
    const a = randInt(rng, 10, max);
    let b = randInt(rng, 10, max);
    while (b === a) b = randInt(rng, 10, max);
    const heavier = a > b ? objA : objB;
    const lighter = a > b ? objB : objA;
    const heavierW = Math.max(a, b);
    const lighterW = Math.min(a, b);
    const diff = heavierW - lighterW;
    const text = `A ${objA} weighs ${a} ${unitLabel}. A ${objB} weighs ${b} ${unitLabel}. How much lighter is the ${lighter} than the ${heavier}?`;
    return {
      prompt: {
        view: "numericAnswer",
        kind: "WORD_PROBLEM",
        stage: "ABSTRACT",
        text,
        data: {},
      },
      answer: { value: diff, explanation: `${heavierW} − ${lighterW} = ${diff} ${unitLabel}.` },
      meta: { a, b },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

function joinWithAnd(items: string[]): string {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

const COUNT_WORDS = ["one", "two", "three", "four"];

const BALANCE_PIECE_OBJECTS = ["toy robot", "gift box", "science kit", "model boat", "puzzle box"];

/**
 * Sum several *named, grouped* weight pieces ("two 20 g weights, three 1 g
 * weights") to find a total mass — the workbook's balance-scale-with-labeled-
 * pieces style, distinct from weightSumBlocks' flat list of single weights.
 */
export const weightBalancePieces: Generator = {
  id: "weight.balancepieces",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const system = (params.system as UnitSystem | undefined) ?? "metric";
    const unitLabel = system === "metric" ? "g" : "lb";
    const values = system === "metric" ? GRAM_BLOCK_VALUES : POUND_BLOCK_VALUES;
    const denomCount = difficulty <= 2 ? 2 : difficulty <= 4 ? 3 : 4;
    const chosenValues = shuffle([...values], rng).slice(0, denomCount);
    const maxCount = difficulty <= 3 ? 3 : 4;
    const pieces = chosenValues.map((value) => ({ value, count: randInt(rng, 1, maxCount) }));
    const total = pieces.reduce((sum, p) => sum + p.value * p.count, 0);
    const obj = pick(rng, BALANCE_PIECE_OBJECTS);
    const massWord = system === "metric" ? "mass" : "weight";
    const phrases = pieces.map((p) => {
      const word = COUNT_WORDS[p.count - 1] ?? String(p.count);
      const noun = p.count === 1 ? "weight" : "weights";
      return `${word} ${p.value} ${unitLabel} ${noun}`;
    });
    const text = `A balance shows ${article(obj)} ${obj} balanced against ${joinWithAnd(phrases)}. What is the ${obj}'s ${massWord}, in ${unitLabel === "g" ? "grams" : "pounds"}?`;
    const explanation = `${pieces.map((p) => `(${p.count} × ${p.value})`).join(" + ")} = ${total} ${unitLabel}.`;
    return {
      prompt: {
        view: "numericAnswer",
        kind: "WORD_PROBLEM",
        stage: "ABSTRACT",
        text,
        data: {},
      },
      answer: { value: total, explanation },
      meta: { pieces, total },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

const BALANCE_COMPLETE_OBJECTS = ["puppy", "sandbag", "gift basket", "watermelon", "toy chest"];

/**
 * "How much more is needed to balance?" — one pan already holds an object of
 * known weight, the other holds a partial pile of weights; find the gap.
 */
export const weightBalanceComplete: Generator = {
  id: "weight.balancecomplete",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const system = (params.system as UnitSystem | undefined) ?? "metric";
    const unitLabel = system === "metric" ? "g" : "lb";
    const unitWord = unitLabel === "g" ? "grams" : "pounds";
    const obj = pick(rng, BALANCE_COMPLETE_OBJECTS);
    let objectWeight: number;
    let currentWeight: number;
    if (system === "metric") {
      const [lo, hi] = difficulty <= 2 ? [40, 200] : difficulty <= 4 ? [100, 800] : [300, 2000];
      objectWeight = randInt(rng, lo, hi);
      currentWeight = randInt(rng, Math.max(5, Math.floor(lo / 4)), objectWeight - 5);
    } else {
      const [lo, hi] = difficulty <= 2 ? [3, 20] : difficulty <= 4 ? [5, 40] : [10, 80];
      objectWeight = randInt(rng, lo, hi);
      currentWeight = randInt(rng, 1, objectWeight - 1);
    }
    const needed = objectWeight - currentWeight;
    const text = `One pan holds ${article(obj)} ${obj} that weighs ${objectWeight} ${unitLabel}. The other pan currently holds ${currentWeight} ${unitLabel} of weights. How many more ${unitWord} need to be added to balance the scale?`;
    return {
      prompt: {
        view: "numericAnswer",
        kind: "WORD_PROBLEM",
        stage: "ABSTRACT",
        text,
        data: {},
      },
      answer: { value: needed, explanation: `${objectWeight} − ${currentWeight} = ${needed} ${unitLabel}.` },
      meta: { objectWeight, currentWeight, needed },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

const TRIO_OBJECTS_METRIC = ["mango", "kiwi", "papaya", "starfruit", "guava", "fig"];
const TRIO_OBJECTS_CUSTOMARY = ["pumpkin", "cabbage", "melon", "squash", "eggplant"];

/**
 * Three-unknown balance logic puzzle (challenge tier): three named objects,
 * every pairwise sum of two of them is given, find the third. Ground truth
 * weights are generated first and the three sums are derived from them, so
 * the elimination formula always reconstructs the original — guaranteeing a
 * unique, positive, whole-number answer.
 */
export const weightThreeUnknown: Generator = {
  id: "weight.threeunknown",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const system = (params.system as UnitSystem | undefined) ?? "metric";
    const unitLabel = system === "metric" ? "g" : "lb";
    const unitWord = unitLabel === "g" ? "grams" : "pounds";
    const bank = system === "metric" ? TRIO_OBJECTS_METRIC : TRIO_OBJECTS_CUSTOMARY;
    const objects = shuffle([...bank], rng).slice(0, 3);
    const [lo, hi] = system === "metric" ? (difficulty <= 4 ? [15, 150] : [20, 400]) : difficulty <= 4 ? [2, 15] : [3, 25];
    const w = [randInt(rng, lo, hi), randInt(rng, lo, hi), randInt(rng, lo, hi)];
    // S[0] = w0+w1 (between objects 0,1); S[1] = w1+w2 (between 1,2); S[2] = w0+w2 (between 0,2)
    const s01 = w[0] + w[1];
    const s12 = w[1] + w[2];
    const s02 = w[0] + w[2];
    const target = randInt(rng, 0, 2);
    let answerValue: number;
    if (target === 0) answerValue = (s01 + s02 - s12) / 2;
    else if (target === 1) answerValue = (s01 + s12 - s02) / 2;
    else answerValue = (s12 + s02 - s01) / 2;
    const text = `On a balance scale: the ${objects[0]} and the ${objects[1]} together weigh the same as ${s01} ${unitLabel}. The ${objects[1]} and the ${objects[2]} together weigh the same as ${s12} ${unitLabel}. The ${objects[0]} and the ${objects[2]} together weigh the same as ${s02} ${unitLabel}. How much does the ${objects[target]} weigh, in ${unitWord}?`;
    const explanation = `${objects[0]}+${objects[1]}=${s01}, ${objects[1]}+${objects[2]}=${s12}, ${objects[0]}+${objects[2]}=${s02}. Solving the system gives ${objects[target]} = ${answerValue} ${unitLabel}.`;
    return {
      prompt: {
        view: "numericAnswer",
        kind: "WORD_PROBLEM",
        stage: "ABSTRACT",
        text,
        data: {},
      },
      answer: { value: answerValue, explanation },
      meta: { objects, weights: w, s01, s12, s02, target },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

const GRAMS_PER_KG = 1000;
const OUNCES_PER_LB = 16;
const MIXED_COMPARE_OBJECTS = ["backpack", "watermelon", "suitcase", "bag of rice", "toolbox", "pumpkin", "sack of potatoes", "gift basket"];

/** "Which is heavier?" comparing two objects given in *different* units, forcing a conversion before comparing. */
export const weightMixedUnitCompare: Generator = {
  id: "weight.mixedunitcompare",
  generate(seed, difficulty, params): GeneratedInstance {
    const rng = seededRng(seed);
    const system = (params.system as UnitSystem | undefined) ?? "metric";
    const objA = pick(rng, MIXED_COMPARE_OBJECTS);
    let objB = pick(rng, MIXED_COMPARE_OBJECTS);
    while (objB === objA) objB = pick(rng, MIXED_COMPARE_OBJECTS);
    const sign = pick(rng, [1, -1]);
    let bigVal: number;
    let smallVal: number;
    let bigUnit: string;
    let smallUnit: string;
    let perUnit: number;
    if (system === "metric") {
      bigUnit = "kg";
      smallUnit = "g";
      perUnit = GRAMS_PER_KG;
      bigVal = randInt(rng, 1, 9);
      const gap = difficulty <= 2 ? randInt(rng, 500, 3000) : difficulty <= 4 ? randInt(rng, 100, 800) : randInt(rng, 10, 200);
      smallVal = Math.max(50, bigVal * perUnit + sign * gap);
    } else {
      bigUnit = "lb";
      smallUnit = "oz";
      perUnit = OUNCES_PER_LB;
      bigVal = randInt(rng, 1, 9);
      const gap = difficulty <= 2 ? randInt(rng, 8, 40) : difficulty <= 4 ? randInt(rng, 2, 15) : randInt(rng, 1, 6);
      smallVal = Math.max(1, bigVal * perUnit + sign * gap);
    }
    const bigEquivalent = bigVal * perUnit;
    const heavier = smallVal > bigEquivalent ? objB : objA;
    const lighter = smallVal > bigEquivalent ? objA : objB;
    const text = `${capitalizedArticle(objA)} ${objA} weighs ${bigVal} ${bigUnit}. ${capitalizedArticle(objB)} ${objB} weighs ${smallVal} ${smallUnit}. Which is heavier?`;
    const explanation = `${bigVal} ${bigUnit} = ${bigEquivalent} ${smallUnit}. Since ${smallVal > bigEquivalent ? `${smallVal} > ${bigEquivalent}` : `${bigEquivalent} > ${smallVal}`}, the ${heavier} is heavier than the ${lighter}.`;
    return {
      prompt: {
        view: "chooseUnit",
        kind: "MULTIPLE_CHOICE",
        stage: "ABSTRACT",
        text,
        data: { choices: [objA, objB] },
      },
      answer: { value: heavier, explanation },
      meta: { objA, objB, bigVal, smallVal, bigUnit, smallUnit },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

export const weightGenerators = [
  weightChooseUnit,
  weightEstimate,
  weightReasonableEstimate,
  weightSumBlocks,
  weightMissingBalance,
  weightCompareObjects,
  weightBalancePieces,
  weightBalanceComplete,
  weightThreeUnknown,
  weightMixedUnitCompare,
];
