import { generateInstance, validateResponse, listGeneratorIds } from "../src/lib/math-engine/registry";

console.log("Registered generators:", listGeneratorIds());

const cases: Array<{ id: string; params: Record<string, unknown> }> = [
  { id: "mult.table", params: { factor: 5 } },
  { id: "mult.array", params: { factor: 3 } },
  { id: "mult.fact", params: { factor: 2 } },
  { id: "mult.wordproblem", params: { factor: 10 } },
  { id: "div.frommult", params: { factor: 5 } },
  { id: "div.fact", params: { factor: 2 } },
  { id: "div.wordproblem.partitive", params: { factor: 5 } },
  { id: "div.wordproblem.measurement", params: { factor: 10 } },
  { id: "mixed.factdrill", params: {} },
  { id: "placevalue.build", params: {} },
  { id: "placevalue.decompose", params: {} },
  { id: "compare.numbers", params: {} },
  { id: "order.numbers", params: {} },
  { id: "numberbond.missingpart", params: {} },
  { id: "addition.within1000", params: {} },
  { id: "subtraction.within1000", params: { acrossZero: true } },
  { id: "addsub.wordproblem", params: { op: "compare" } },
  { id: "length.chooseunit", params: { system: "metric" } },
  { id: "length.chooseunit", params: { system: "customary" } },
  { id: "length.estimatemeasure", params: { unit: "cm" } },
  { id: "length.estimatemeasure", params: { unit: "in" } },
  { id: "length.compare", params: { unit: "cm" } },
  { id: "length.compare", params: { unit: "in" } },
  { id: "weight.chooseunit", params: { system: "metric" } },
  { id: "weight.chooseunit", params: { system: "customary" } },
  { id: "weight.estimate", params: { system: "metric" } },
  { id: "weight.estimate", params: { system: "customary" } },
];

for (const c of cases) {
  const instance = generateInstance(c.id, `seed-${c.id}`, 2, c.params);
  let response: unknown = instance.answer.value;
  if (c.id === "length.estimatemeasure") response = { estimate: 10, measured: instance.answer.value };
  const result = validateResponse(c.id, response, instance.answer, instance.meta);
  console.log(
    `${c.id.padEnd(28)} | "${instance.prompt.text}" | answer=${JSON.stringify(instance.answer.value)} | correctCheck=${result.correct}`,
  );
  if (!result.correct) {
    console.error(`  FAIL: validate() rejected the generator's own correct answer for ${c.id}`);
    process.exitCode = 1;
  }
}
