import type {
  ExperimentContent,
  JournalContent,
  MorningRoutineContent,
  MovementBreakContent,
  ParentActivityContent,
  QuestionContent,
  ReadAloudContent,
  SelScenarioContent,
  TraceContent,
} from "./types";

export type CurriculumDomain =
  | "MORNING"
  | "LITERACY"
  | "MATH"
  | "SCIENCE"
  | "SOCIAL_STUDIES"
  | "WRITING"
  | "GAME"
  | "READ_ALOUD"
  | "CREATIVE"
  | "MOVEMENT"
  | "EXTENSION";

export type PreschoolActivityType =
  | "QUESTION"
  | "SEL_SCENARIO"
  | "TRACE"
  | "EXPERIMENT"
  | "READ_ALOUD"
  | "JOURNAL"
  | "PARENT_ACTIVITY"
  | "MOVEMENT_BREAK"
  | "MORNING_ROUTINE";

interface ActivityBase {
  domain: CurriculumDomain;
  title: string;
  instructions: string;
  optional?: boolean;
}

export type ActivityDef = ActivityBase &
  (
    | { type: "QUESTION"; content: QuestionContent }
    | { type: "SEL_SCENARIO"; content: SelScenarioContent }
    | { type: "TRACE"; content: TraceContent }
    | { type: "EXPERIMENT"; content: ExperimentContent }
    | { type: "READ_ALOUD"; content: ReadAloudContent }
    | { type: "JOURNAL"; content: JournalContent }
    | { type: "PARENT_ACTIVITY"; content: ParentActivityContent }
    | { type: "MOVEMENT_BREAK"; content: MovementBreakContent }
    | { type: "MORNING_ROUTINE"; content: MorningRoutineContent }
  );

export interface DayDef {
  dayNumber: number;
  title: string;
  activities: ActivityDef[];
}

export interface WeekDef {
  number: number;
  theme: string;
  days: DayDef[];
}
