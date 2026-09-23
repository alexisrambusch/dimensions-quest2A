// Assessments reference existing, already-seeded Question codes (defined
// alongside each chapter's lessons) rather than duplicating generator specs —
// a Test is a curated selection/ordering of real practice questions, not a
// separate question bank.

export interface AssessmentDef {
  code: string;
  chapterCode: string;
  style: "TEST_A" | "TEST_B";
  title: string;
  description: string;
  questionCodes: string[];
}

export const ASSESSMENTS: AssessmentDef[] = [
  {
    code: "ch1-testA",
    chapterCode: "ch1",
    style: "TEST_A",
    title: "Test A: Numbers to 1,000",
    description: "Key concepts and fundamental skills: building, comparing, and ordering numbers.",
    questionCodes: [
      "ch1.placevalue.build.q1",
      "ch1.placevalue.decompose.q1",
      "ch1.compare.q1",
      "ch1.order.q1",
      "ch1.numberline.q1",
      "ch1.patterns.q1",
    ],
  },
  {
    code: "ch1-testB",
    chapterCode: "ch1",
    style: "TEST_B",
    title: "Test B: Numbers to 1,000 — Think It Through",
    description: "Analytical thinking: harder numbers, less scaffolding, more reasoning.",
    questionCodes: [
      "ch1.placevalue.build.q2",
      "ch1.placevalue.decompose.q2",
      "ch1.compare.q2",
      "ch1.order.q2",
      "ch1.numberline.q2",
      "ch1.patterns.q2",
    ],
  },
  {
    code: "ch7-testA",
    chapterCode: "ch7",
    style: "TEST_A",
    title: "Test A: ×2, ×5, ×10 Facts",
    description: "Key concepts and fundamental fact recall for the 2, 5, and 10 tables and their division inverses.",
    questionCodes: [
      "ch7.mult5.facts.q1",
      "ch7.mult2.facts.q1",
      "ch7.mult10.facts.q1",
      "ch7.div2.q2",
      "ch7.div5.q2",
      "ch7.div10.q2",
      "ch7.mixed.practice.q1",
    ],
  },
  {
    code: "ch7-testB",
    chapterCode: "ch7",
    style: "TEST_B",
    title: "Test B: ×2, ×5, ×10 — Think It Through",
    description: "Analytical thinking and word problems applying multiplication and division facts to new situations.",
    questionCodes: [
      "ch7.mult5.facts.q2",
      "ch7.mult2.facts.q2",
      "ch7.mult10.facts.q2",
      "ch7.wordproblems.q1",
      "ch7.wordproblems.q2",
      "ch7.wordproblems.q3",
      "ch7.mult5.facts.q3",
      "ch7.mixed.practice.q2",
    ],
  },
];
