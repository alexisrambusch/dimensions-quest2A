import { randInt, pick } from "./rand";

export type MentalMathCategory = "addSub10" | "addSub20" | "mult" | "div" | "mixed";

export interface MentalMathProblem {
  prompt: string;
  answer: number;
}

const FAMILY = [2, 5, 10] as const;

function addSub10(): MentalMathProblem {
  if (Math.random() < 0.5) {
    const a = randInt(1, 9);
    const b = randInt(1, 10 - a);
    return { prompt: `${a} + ${b}`, answer: a + b };
  }
  const a = randInt(2, 10);
  const b = randInt(1, a - 1);
  return { prompt: `${a} − ${b}`, answer: a - b };
}

function addSub20(): MentalMathProblem {
  if (Math.random() < 0.5) {
    const b = randInt(2, 9);
    const a = randInt(Math.max(2, 11 - b), 9);
    return { prompt: `${a} + ${b}`, answer: a + b };
  }
  const b = randInt(2, 9);
  const a = randInt(11, 9 + b);
  return { prompt: `${a} − ${b}`, answer: a - b };
}

function mult(): MentalMathProblem {
  const factor = pick(FAMILY);
  const other = randInt(1, 10);
  const [x, y] = Math.random() < 0.5 ? [factor, other] : [other, factor];
  return { prompt: `${x} × ${y}`, answer: factor * other };
}

function div(): MentalMathProblem {
  const factor = pick(FAMILY);
  const quotient = randInt(1, 10);
  const dividend = factor * quotient;
  return { prompt: `${dividend} ÷ ${factor}`, answer: quotient };
}

const GENERATORS: Record<Exclude<MentalMathCategory, "mixed">, () => MentalMathProblem> = {
  addSub10,
  addSub20,
  mult,
  div,
};

export function generateMentalMath(category: MentalMathCategory): MentalMathProblem {
  const key = category === "mixed" ? pick(Object.keys(GENERATORS) as Array<keyof typeof GENERATORS>) : category;
  return GENERATORS[key]();
}

export const MENTAL_MATH_CATEGORIES: Array<{ key: MentalMathCategory; label: string }> = [
  { key: "addSub10", label: "+ / − within 10" },
  { key: "addSub20", label: "+ / − within 20" },
  { key: "mult", label: "× 2, 5, 10" },
  { key: "div", label: "÷ 2, 5, 10" },
  { key: "mixed", label: "Mixed" },
];
