import type {
  DragSortContent,
  HuntContent,
  MatchPairsContent,
  StickerCountContent,
  TapAnswerContent,
  TraceContent,
} from "./types";

export type PreschoolDomain = "LITERACY" | "PHONICS" | "PHONOLOGICAL_AWARENESS" | "READING" | "WRITING" | "MATH" | "SCIENCE" | "SOCIAL_STUDIES" | "SEL";

interface ActivityBase {
  code: string;
  title: string;
  instructions: string;
  /** 1 = first exposure, 3 = hardest variant of this skill. */
  difficulty?: number;
  /** A graded confirmation check — only ever scheduled once the skill has some practice already. Defaults to false (an ungraded teaching game). */
  isCheck?: boolean;
  masteryWeight?: number;
}

export type ActivityDef = ActivityBase &
  (
    | { engine: "hunt"; content: HuntContent }
    | { engine: "stickerCount"; content: StickerCountContent }
    | { engine: "dragSort"; content: DragSortContent }
    | { engine: "matchPairs"; content: MatchPairsContent }
    | { engine: "trace"; content: TraceContent }
    | { engine: "tapAnswer"; content: TapAnswerContent }
  );

export interface SkillDef {
  code: string;
  domain: PreschoolDomain;
  title: string;
  description: string;
  /** Skill codes that should already be at PRACTICING level or better before this one is offered. */
  prerequisites: string[];
  activities: ActivityDef[];
}
