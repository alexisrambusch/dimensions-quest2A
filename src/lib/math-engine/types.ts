// Core contracts for the deterministic math engine. The AI tutor never
// computes or validates arithmetic — it only talks about instances produced
// and checked here.

export type QuestionKind =
  | "MULTIPLE_CHOICE"
  | "FILL_IN_BLANK"
  | "DRAG_DROP"
  | "NUMBER_LINE"
  | "MATCHING"
  | "BUILD_MODEL"
  | "BUILD_EQUATION"
  | "EXPLAIN_THINKING"
  | "FIND_THE_MISTAKE"
  | "WORD_PROBLEM"
  | "SORT_ORDER"
  | "ESTIMATION"
  | "ARRAY_VISUAL"
  | "BAR_MODEL";

export type Stage = "CONCRETE" | "PICTORIAL" | "ABSTRACT";

/** Rendered, ready-to-display prompt. `view` selects which React renderer to use. */
export interface RenderedPrompt {
  view: string;
  kind: QuestionKind;
  stage: Stage;
  text: string;
  data: Record<string, unknown>;
}

/** Canonical answer plus anything needed to accept equivalent responses. */
export interface CanonicalAnswer {
  value: unknown;
  accept?: unknown[];
  explanation: string;
  /** Facts this instance exercises, for fact-fluency tracking, e.g. ["x:5:6"]. */
  facts?: string[];
}

export interface GeneratedInstance {
  prompt: RenderedPrompt;
  answer: CanonicalAnswer;
  /** Machine-checkable metadata used by misconception detectors. */
  meta?: Record<string, unknown>;
}

export interface ValidationResult {
  correct: boolean;
  /** Best-effort classification of *why* a wrong answer is wrong. */
  errorTag?: string;
}

export interface Generator {
  id: string;
  generate(seed: string, difficulty: number, params: Record<string, unknown>): GeneratedInstance;
  validate(response: unknown, answer: CanonicalAnswer, meta?: Record<string, unknown>): ValidationResult;
}
