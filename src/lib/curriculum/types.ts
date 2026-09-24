import type { QuestionKind, Stage } from "../math-engine/types";

export interface QuestionDef {
  code: string;
  kind: QuestionKind;
  stage: Stage;
  generatorId: string;
  params: Record<string, unknown>;
  difficulty: number;
}

export interface SkillDef {
  code: string;
  title: string;
  description: string;
  stage: Stage;
  /** Skill codes that should be developing before this one is introduced. */
  prerequisites: string[];
  questions: QuestionDef[];
}

export interface ConceptDef {
  title: string;
  bigIdea: string;
  skills: SkillDef[];
}

export type LessonType = "STANDARD" | "PRACTICE" | "REVIEW" | "ASSESSMENT";

/**
 * A picture attached to a worked-example step or answer, rendered by
 * LearnVisual (src/components/lesson/LearnVisual.tsx). `view` selects which
 * static diagram to draw — see that file for the full catalog of supported
 * views and the data shape each one expects.
 */
export interface WorkedExampleVisual {
  view: string;
  data: Record<string, unknown>;
}

export interface WorkedExampleStep {
  text: string;
  visual?: WorkedExampleVisual;
}

/**
 * A single worked example shown before any practice questions: a concrete
 * problem, the think-aloud reasoning steps a student should walk through
 * (each optionally paired with a picture, like the textbook's Learn pages),
 * and the resolved answer. This is the "I do" before "you do."
 */
export interface WorkedExample {
  problem: string;
  steps: WorkedExampleStep[];
  answer: string;
  answerVisual?: WorkedExampleVisual;
}

export interface LessonDef {
  code: string;
  title: string;
  type: LessonType;
  objective: string;
  missionBriefing: string;
  workedExample?: WorkedExample;
  concepts: ConceptDef[];
}

export interface ChapterDef {
  code: string;
  title: string;
  description: string;
  worldName: string;
  worldTheme: string;
  lessons: LessonDef[];
}

export interface GradeDef {
  name: string;
  sequence: string;
  chapters: ChapterDef[];
}
