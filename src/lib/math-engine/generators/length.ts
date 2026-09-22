import type { Generator, GeneratedInstance, ValidationResult } from "../types";
import { seededRng, randInt, pick } from "../random";
import { toNumber } from "../numeric";

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

export const lengthGenerators = [lengthChooseUnit, lengthEstimateThenMeasure, lengthCompare];
