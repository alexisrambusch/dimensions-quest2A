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
 * A single worked example shown before any practice questions: a concrete
 * problem, the think-aloud reasoning steps a student should walk through,
 * and the resolved answer. This is the "I do" before "you do."
 */
export interface WorkedExample {
  problem: string;
  steps: string[];
  answer: string;
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
