// Fact-key normalization and fact-family relationships for ×2/×5/×10 and
// their division inverses (Chapter 7). Keeping a×b and b×a as distinct keys
// matches the spec's instruction to track both while presenting them as
// linked "related facts."

export function multFactKey(a: number, b: number): string {
  return `x:${a}:${b}`;
}

export function divFactKey(dividend: number, divisor: number): string {
  return `d:${dividend}:${divisor}`;
}

export interface FactFamily {
  factKeys: string[];
  equations: string[];
}

/** Given a×b=product, return the full fact family: both mult orders and both divisions. */
export function factFamily(a: number, b: number): FactFamily {
  const product = a * b;
  return {
    factKeys: [multFactKey(a, b), multFactKey(b, a), divFactKey(product, a), divFactKey(product, b)],
    equations: [
      `${a} × ${b} = ${product}`,
      `${b} × ${a} = ${product}`,
      `${product} ÷ ${a} = ${b}`,
      `${product} ÷ ${b} = ${a}`,
    ],
  };
}

/** A fact "one step away" that can be derived from a known fact by adding/removing one group. */
export function neighborFact(a: number, b: number, direction: 1 | -1): { a: number; b: number; delta: number } {
  return { a: a + direction, b, delta: direction * b };
}
