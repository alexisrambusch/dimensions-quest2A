import type { Generator, GeneratedInstance } from "../types";
import { seededRng, randInt, pick } from "../random";
import { divFactKey, multFactKey } from "../facts";
import { validateNumeric } from "../numeric";

/** Mixed ×2/×5/×10 and ÷2/÷5/÷10 drill — Practice C and the spaced-review pool. */
export const mixedFactDrill: Generator = {
  id: "mixed.factdrill",
  generate(seed, difficulty, params): GeneratedInstance {
    const factors = (params.factors as number[] | undefined) ?? [2, 5, 10];
    const ops = (params.ops as Array<"x" | "d"> | undefined) ?? ["x", "d"];
    const rng = seededRng(seed);
    const hi = difficulty <= 1 ? 5 : difficulty <= 3 ? 9 : 12;
    const factor = pick(rng, factors);
    const op = pick(rng, ops);
    const a = randInt(rng, 1, hi);

    if (op === "x") {
      const product = a * factor;
      return {
        prompt: {
          view: "equation",
          kind: "FILL_IN_BLANK",
          stage: "ABSTRACT",
          text: `${factor} × ${a} = ?`,
          data: { left: factor, right: a, op: "x" },
        },
        answer: {
          value: product,
          explanation: `${factor} × ${a} = ${product}.`,
          facts: [multFactKey(factor, a)],
        },
        meta: { a: factor, b: a, op: "x" },
      };
    }
    const dividend = a * factor;
    return {
      prompt: {
        view: "equation",
        kind: "FILL_IN_BLANK",
        stage: "ABSTRACT",
        text: `${dividend} ÷ ${factor} = ?`,
        data: { left: dividend, right: factor, op: "d" },
      },
      answer: {
        value: a,
        explanation: `${dividend} ÷ ${factor} = ${a}.`,
        facts: [divFactKey(dividend, factor)],
      },
      meta: { a: dividend, b: factor, op: "d" },
    };
  },
  validate: (response, answer) => validateNumeric(response, answer),
};

export const mixedFactGenerators = [mixedFactDrill];
