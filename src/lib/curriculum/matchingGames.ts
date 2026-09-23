// Lessons that get the "Fact Blast" matching mini-game for their Game phase,
// keyed by lesson code, mapped to which ×N fact family to drill. Lessons not
// listed here fall back to the reskinned Speed Round (still a real practice
// round, just not a distinct game mechanic).
export const MATCHING_GAME_FACTOR: Record<string, number> = {
  "ch7-l2": 5, // Multiplication Facts of 5
  "ch7-l3": 5, // Practice A
  "ch7-l5": 2, // Multiplication Facts of 2
  "ch7-l6": 2, // Practice B
  "ch7-l7": 10, // The Multiplication Table of 10
  "ch7-l8": 2, // Dividing by 2
  "ch7-l9": 5, // Dividing by 5 and 10
};

export function getMatchingGameFactor(lessonCode: string): number | undefined {
  return MATCHING_GAME_FACTOR[lessonCode];
}
