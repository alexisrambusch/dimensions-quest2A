import { PreschoolMasteryLevel } from "@/generated/prisma/enums";

// Score accumulates one masteryWeight per successful pass (an ungraded
// teaching game always counts as successful; a graded check only counts
// when answered correctly — see recordPreschoolAttempt). These thresholds
// are deliberately generous early on: a first exposure to a skill should
// feel like real progress, not a long grind.
const THRESHOLDS: { level: PreschoolMasteryLevel; min: number }[] = [
  { level: PreschoolMasteryLevel.MASTERED, min: 20 },
  { level: PreschoolMasteryLevel.PROFICIENT, min: 13 },
  { level: PreschoolMasteryLevel.DEVELOPING, min: 8 },
  { level: PreschoolMasteryLevel.PRACTICING, min: 4 },
  { level: PreschoolMasteryLevel.INTRODUCED, min: 1 },
  { level: PreschoolMasteryLevel.NOT_STARTED, min: 0 },
];

export function levelForScore(score: number): PreschoolMasteryLevel {
  return THRESHOLDS.find((t) => score >= t.min)!.level;
}

/** A skill counts as "ready to build on" once its prerequisite is at least this far along. */
export const PREREQUISITE_READY_LEVELS: PreschoolMasteryLevel[] = [
  PreschoolMasteryLevel.PRACTICING,
  PreschoolMasteryLevel.DEVELOPING,
  PreschoolMasteryLevel.PROFICIENT,
  PreschoolMasteryLevel.MASTERED,
];

/** A graded "check" activity is only appropriate once a skill has had a little practice — never on first exposure. */
export const CHECK_READY_LEVELS: PreschoolMasteryLevel[] = [
  PreschoolMasteryLevel.PRACTICING,
  PreschoolMasteryLevel.DEVELOPING,
  PreschoolMasteryLevel.PROFICIENT,
];
