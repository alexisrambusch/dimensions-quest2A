import type { Generator, GeneratedInstance, ValidationResult, CanonicalAnswer } from "./types";
import { placeValueGenerators } from "./generators/placeValue";
import { additionSubtractionGenerators } from "./generators/additionSubtraction";
import { lengthGenerators } from "./generators/length";
import { weightGenerators } from "./generators/weight";
import { multiplicationGenerators } from "./generators/multiplication";
import { divisionGenerators } from "./generators/division";
import { mixedFactGenerators } from "./generators/mixedFacts";

const ALL_GENERATORS: Generator[] = [
  ...placeValueGenerators,
  ...additionSubtractionGenerators,
  ...lengthGenerators,
  ...weightGenerators,
  ...multiplicationGenerators,
  ...divisionGenerators,
  ...mixedFactGenerators,
];

const REGISTRY = new Map<string, Generator>(ALL_GENERATORS.map((g) => [g.id, g]));

export function getGenerator(id: string): Generator {
  const g = REGISTRY.get(id);
  if (!g) throw new Error(`Unknown math-engine generator: ${id}`);
  return g;
}

export function generateInstance(
  generatorId: string,
  seed: string,
  difficulty: number,
  params: Record<string, unknown>,
): GeneratedInstance {
  return getGenerator(generatorId).generate(seed, difficulty, params);
}

export function validateResponse(
  generatorId: string,
  response: unknown,
  answer: CanonicalAnswer,
  meta?: Record<string, unknown>,
): ValidationResult {
  return getGenerator(generatorId).validate(response, answer, meta);
}

export function listGeneratorIds(): string[] {
  return Array.from(REGISTRY.keys());
}
