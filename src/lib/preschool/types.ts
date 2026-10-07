// Shape of the `contentJson` string stored per PreschoolActivity, one variant
// per PreschoolActivityType. Keeping these as plain data (not components)
// lets the daily curriculum be authored the same way the math curriculum is
// — as versioned TypeScript source, upserted into the DB by seedDatabase.

export interface QuestionContent {
  generatorId: string;
  params: Record<string, unknown>;
  difficulty: number;
}

export interface SelScenarioContent {
  scenario: string;
  choices: { text: string; feedback: string; isBest: boolean }[];
}

export interface TraceContent {
  /** "name" traces the student's own name; any other string is traced literally (a letter, a shape word like "circle"/"line"/"zigzag"). */
  target: string;
}

export interface ExperimentContent {
  ask: string;
  predictChoices: string[];
  testInstructions: string;
  testTimerSeconds?: number;
  observeChoices: string[];
  recordSummary: string;
}

export interface ReadAloudContent {
  bookTitle: string;
  bookAuthor: string;
  beforeQuestion: string;
  duringQuestions: string[];
  afterQuestion: string;
}

export interface JournalContent {
  prompt: string;
  /** If set, a faint guide word/letters shown under the canvas (e.g. the student's name) rather than a blank page. */
  guideText?: string;
}

export interface ParentActivityContent {
  description: string;
}

export interface MovementBreakContent {
  description: string;
  timerSeconds: number;
}

export interface MorningRoutineContent {
  prompt: string;
}
