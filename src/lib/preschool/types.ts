// Content payload shapes stored as `contentJson` on PreschoolActivity, one
// variant per reusable game `engine`. Every one of these is a genuine game
// mechanic (tap, drag-by-tap, connect) — "tapAnswer" is the only
// quiz-shaped one, and it's reserved for a skill that already has some
// mastery, never for a first encounter with a skill.

/** Tap every item that matches — teaches recognition through repeated, low-pressure search rather than a single graded guess. */
export interface HuntContent {
  /** What we're hunting for, read aloud at the start — e.g. "Find every letter A!" */
  promptText: string;
  items: { label: string; isMatch: boolean }[];
}

/** Tap to place stickers one at a time until the target count is reached — teaches counting by doing, not by naming a numeral. */
export interface StickerCountContent {
  targetCount: number;
  sceneLabel: string;
  /** How many stickers are offered in the tray (>= targetCount, so placing "just enough" is a real choice). */
  trayCount: number;
}

/** A queue of items sorted one at a time into one of two buckets by tapping — teaches a category distinction through repetition. */
export interface DragSortContent {
  bucketALabel: string;
  bucketBLabel: string;
  items: { label: string; belongsToA: boolean }[];
}

/** Tap one item on the left, then its partner on the right, to connect a pair — teaches an association (letter-picture, number-quantity, shape-name). */
export interface MatchPairsContent {
  pairs: { left: string; right: string }[];
}

/** Finger-trace a letter, number, or name — ungraded motor practice. */
export interface TraceContent {
  /** "name" traces the student's own name; any other string is traced literally. */
  target: string;
}

/** A lightweight confirmation check — only ever served once a skill already has some practice behind it. */
export interface TapAnswerContent {
  promptText: string;
  choices: string[];
  correctIndex: number;
  hint?: string;
}
