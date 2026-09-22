// Deterministic, no-AI-required Socratic hint ladder. Every question type gets
// at least a generic four-level ladder; higher-value skills get hints
// tailored to the specific misconception risk for that operation.

export interface HintContext {
  generatorId: string;
  meta?: Record<string, unknown>;
  promptText: string;
}

function multiplicationHints(a: number, b: number): string[] {
  const product = a * b;
  return [
    `Think about what ${a} × ${b} means. How many groups are there, and how many in each group?`,
    `You have ${a} groups, and each group has ${b}. Try building ${a} groups of ${b} with counters or blocks.`,
    `Try adding ${b} to itself ${a} times: ${Array.from({ length: a }, () => b).join(" + ")}.`,
    `${Array.from({ length: a }, (_, i) => b * (i + 1)).join(", ")} — counting by ${b}s ${a} times gets you to ${product}.`,
  ];
}

function divisionHints(dividend: number, divisor: number): string[] {
  const quotient = dividend / divisor;
  return [
    `${dividend} ÷ ${divisor} asks: how many groups of ${divisor} fit into ${dividend}?`,
    `Think about the multiplication fact: ${divisor} × ? = ${dividend}. What matching multiplication fact do you know?`,
    `Try counting up by ${divisor}s until you reach ${dividend}, and count how many jumps it takes.`,
    `${divisor} × ${quotient} = ${dividend}, so ${dividend} ÷ ${divisor} = ${quotient}.`,
  ];
}

function additionHints(a: number, b: number): string[] {
  const sum = a + b;
  return [
    `Line up ${a} and ${b} by place value: hundreds under hundreds, tens under tens, ones under ones.`,
    `Start with the ones place. If the ones add up to 10 or more, you'll need to regroup 10 ones into 1 ten.`,
    `Add the ones, then the tens (regrouping if needed), then the hundreds.`,
    `${a} + ${b} = ${sum}. Check each place value column one more time to see how the regrouping worked.`,
  ];
}

function subtractionHints(a: number, b: number): string[] {
  const diff = a - b;
  return [
    `Line up ${a} and ${b} by place value. Start subtracting from the ones place.`,
    `If there aren't enough ones to subtract, regroup: trade 1 ten for 10 ones (or 1 hundred for 10 tens if needed).`,
    `Work through each column: ones, then tens, then hundreds, regrouping wherever you get stuck.`,
    `${a} − ${b} = ${diff}. Check the ones, tens, and hundreds columns one more time.`,
  ];
}

function placeValueHints(target: number): string[] {
  const h = Math.floor(target / 100);
  const t = Math.floor((target % 100) / 10);
  const o = target % 10;
  return [
    `Break ${target} into hundreds, tens, and ones. How many hundreds are in ${target}?`,
    `${target} has ${h} hundred block${h === 1 ? "" : "s"}. Now figure out the tens and ones.`,
    `${target} = ${h} hundreds + ${t} tens + ${o} ones. Try building each part with blocks.`,
    `${h} hundreds + ${t} tens + ${o} ones = ${target}. Count the blocks together to check.`,
  ];
}

function compareHints(a: number, b: number): string[] {
  return [
    `Compare the hundreds digits of ${a} and ${b} first. Are they the same or different?`,
    `If the hundreds are the same, compare the tens. If those are the same too, compare the ones.`,
    `Line the numbers up by place value and compare digit by digit, starting from the left.`,
    `${a} ${a > b ? ">" : a < b ? "<" : "="} ${b}, because ${a > b ? "the first number has a bigger digit in an earlier place." : a < b ? "the second number has a bigger digit in an earlier place." : "every place-value digit matches."}`,
  ];
}

const GENERIC_HINTS = [
  "What is this question asking you to find? Try saying it in your own words.",
  "Try drawing a picture or using blocks or counters to show what's happening.",
  "Break the problem into smaller steps. What can you figure out first?",
  "Let's work through it together, one step at a time.",
];

export function getHintLadder(ctx: HintContext): string[] {
  const meta = ctx.meta ?? {};
  const op = meta.op as string | undefined;
  const a = meta.a as number | undefined;
  const b = meta.b as number | undefined;

  if (ctx.generatorId.startsWith("mult") || ctx.generatorId === "mixed.factdrill") {
    if (op === "x" && a !== undefined && b !== undefined) return multiplicationHints(a, b);
  }
  if (ctx.generatorId.startsWith("div") || (ctx.generatorId === "mixed.factdrill" && op === "d")) {
    if (a !== undefined && b !== undefined) return divisionHints(a, b);
  }
  if (ctx.generatorId === "addition.within1000" && a !== undefined && b !== undefined) return additionHints(a, b);
  if (ctx.generatorId === "subtraction.within1000" && a !== undefined && b !== undefined) return subtractionHints(a, b);
  if (ctx.generatorId === "placevalue.build" || ctx.generatorId === "placevalue.decompose") {
    const target = meta.target as number | undefined;
    if (target !== undefined) return placeValueHints(target);
  }
  if (ctx.generatorId === "compare.numbers" && a !== undefined && b !== undefined) return compareHints(a, b);

  return GENERIC_HINTS;
}

/** Returns the hint text for a specific 1-4 level; level 0 means "no hint yet." */
export function getHint(ctx: HintContext, level: number): string | null {
  if (level < 1 || level > 4) return null;
  return getHintLadder(ctx)[level - 1] ?? null;
}
