export interface AchievementDef {
  code: string;
  title: string;
  description: string;
  icon: string;
  /** Skill code this achievement is tied to, if any (used for fact-mastery badges). */
  skillCode?: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { code: "first_steps", title: "First Steps", description: "Complete your first lesson.", icon: "star" },
  { code: "ch1_complete", title: "Number Kingdom Hero", description: "Complete Chapter 1: Numbers to 1,000.", icon: "crown" },
  { code: "ch2_complete", title: "Valley Champion", description: "Complete Chapter 2: Addition & Subtraction Part 1.", icon: "shield" },
  { code: "ch3_complete", title: "Mountain Climber", description: "Complete Chapter 3: Addition & Subtraction Part 2.", icon: "mountain" },
  { code: "ch4_complete", title: "Island Explorer", description: "Complete Chapter 4: Length.", icon: "compass" },
  { code: "ch5_complete", title: "Master of Scales", description: "Complete Chapter 5: Weight.", icon: "scale" },
  { code: "ch6_complete", title: "Forest Ranger", description: "Complete Chapter 6: Multiplication & Division.", icon: "tree" },
  { code: "ch7_complete", title: "Realm Champion", description: "Complete Chapter 7: ×2/×5/×10 Facts.", icon: "trophy" },
  { code: "fact_master_2", title: "×2 Fact Master", description: "Master all ×2 and ÷2 facts.", icon: "medal", skillCode: "ch7.mult2.facts" },
  { code: "fact_master_5", title: "×5 Fact Master", description: "Master all ×5 and ÷5 facts.", icon: "medal", skillCode: "ch7.mult5.facts" },
  { code: "fact_master_10", title: "×10 Fact Master", description: "Master all ×10 and ÷10 facts.", icon: "medal", skillCode: "ch7.mult10.facts" },
  { code: "streak_3", title: "3-Day Streak", description: "Practice 3 days in a row.", icon: "flame" },
  { code: "streak_7", title: "7-Day Streak", description: "Practice 7 days in a row.", icon: "flame" },
  { code: "careful_thinker", title: "Careful Thinker", description: "Solve 5 problems independently, without needing a hint.", icon: "brain" },
];
