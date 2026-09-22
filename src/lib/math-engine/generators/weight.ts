import type { Generator, GeneratedInstance, ValidationResult } from "../types";
import { seededRng, pick } from "../random";

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

export const weightGenerators = [weightChooseUnit, weightEstimate];
