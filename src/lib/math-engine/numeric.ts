import type { CanonicalAnswer, ValidationResult } from "./types";

export function toNumber(response: unknown): number | null {
  if (typeof response === "number" && Number.isFinite(response)) return response;
  if (typeof response === "string" && response.trim() !== "" && !Number.isNaN(Number(response))) {
    return Number(response);
  }
  return null;
}

/** Standard numeric grading: exact match against value or any accepted equivalent. */
export function validateNumeric(response: unknown, answer: CanonicalAnswer): ValidationResult {
  const n = toNumber(response);
  if (n === null) return { correct: false, errorTag: "NO_RESPONSE" };
  const accepted = [answer.value, ...(answer.accept ?? [])];
  const correct = accepted.some((a) => typeof a === "number" && a === n);
  return { correct };
}
