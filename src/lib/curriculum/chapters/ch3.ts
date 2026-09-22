import type { ChapterDef } from "../types";

export const ch3: ChapterDef = {
  code: "ch3",
  title: "Addition & Subtraction — Part 2",
  description: "Add and subtract within 1,000 with regrouping, including subtraction across zeros.",
  worldName: "Subtraction Mountain",
  worldTheme: "mountain",
  lessons: [
    {
      code: "ch3-l1",
      title: "Addition with Regrouping",
      type: "STANDARD",
      objective: "Add within 1,000, regrouping ones into tens and tens into hundreds.",
      missionBriefing: "Climb the Mountain and combine supply crates — sometimes 10 small crates become 1 big one!",
      concepts: [
        {
          title: "Regrouping in Addition",
          bigIdea: "When a column sums to 10 or more, trade 10 of one place for 1 of the next.",
          skills: [
            {
              code: "ch3.add.regroup",
              title: "Add within 1,000 with regrouping",
              description: "Add two numbers where at least one column requires regrouping.",
              stage: "PICTORIAL",
              prerequisites: ["ch2.add.mental", "ch1.placevalue.decompose"],
              questions: [
                { code: "ch3.add.regroup.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "addition.within1000", params: { forceRegroup: true }, difficulty: 3 },
                { code: "ch3.add.regroup.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "addition.within1000", params: { forceRegroup: true }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch3-l2",
      title: "Subtraction with Regrouping",
      type: "STANDARD",
      objective: "Subtract within 1,000, regrouping tens into ones and hundreds into tens.",
      missionBriefing: "Some supply crates need to be broken open to share out the goods on the Mountain trail.",
      concepts: [
        {
          title: "Regrouping in Subtraction",
          bigIdea: "When there aren't enough ones to subtract, trade 1 ten for 10 ones.",
          skills: [
            {
              code: "ch3.sub.regroup",
              title: "Subtract within 1,000 with regrouping",
              description: "Subtract two numbers where at least one column requires borrowing.",
              stage: "PICTORIAL",
              prerequisites: ["ch2.sub.mental", "ch1.placevalue.decompose"],
              questions: [
                { code: "ch3.sub.regroup.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "subtraction.within1000", params: {}, difficulty: 3 },
                { code: "ch3.sub.regroup.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "subtraction.within1000", params: {}, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch3-l3",
      title: "Subtracting Across Zeros",
      type: "STANDARD",
      objective: "Subtract when the tens digit of the minuend is zero, requiring a regroup from the hundreds.",
      missionBriefing: "The Mountain's supply depot ran out of ten-crates entirely — you'll have to open a hundred-crate!",
      concepts: [
        {
          title: "Regrouping Across a Zero",
          bigIdea: "When the tens place is zero, regroup from the hundreds first, using a place-value model rather than jumping to the standard algorithm.",
          skills: [
            {
              code: "ch3.sub.acrosszero",
              title: "Subtract across zeros",
              description: "Subtract from a number with a zero in the tens place.",
              stage: "PICTORIAL",
              prerequisites: ["ch3.sub.regroup"],
              questions: [
                { code: "ch3.sub.acrosszero.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "subtraction.within1000", params: { acrossZero: true }, difficulty: 4 },
                { code: "ch3.sub.acrosszero.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "subtraction.within1000", params: { acrossZero: true }, difficulty: 5 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch3-l4",
      title: "Mixed Problem Solving",
      type: "PRACTICE",
      objective: "Solve mixed addition and subtraction word problems within 1,000.",
      missionBriefing: "The Mountain rangers need help with all kinds of number stories before the summit celebration.",
      concepts: [
        {
          title: "Mixed Word Problems",
          bigIdea: "Reading carefully to decide whether a problem calls for addition or subtraction.",
          skills: [
            {
              code: "ch3.mixed.wordproblems",
              title: "Solve mixed addition/subtraction word problems",
              description: "Apply addition or subtraction with regrouping to real-world problems.",
              stage: "PICTORIAL",
              prerequisites: ["ch3.add.regroup", "ch3.sub.regroup"],
              questions: [
                { code: "ch3.mixed.wordproblems.q1", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "addsub.wordproblem", params: { op: "add" }, difficulty: 3 },
                { code: "ch3.mixed.wordproblems.q2", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "addsub.wordproblem", params: { op: "sub" }, difficulty: 3 },
                { code: "ch3.mixed.wordproblems.q3", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "addsub.wordproblem", params: { op: "compare" }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch3-review",
      title: "Chapter Review: Subtraction Mountain",
      type: "REVIEW",
      objective: "Review addition, subtraction, regrouping, and subtraction across zeros.",
      missionBriefing: "One final trek across the Mountain to prove what you've mastered!",
      concepts: [
        {
          title: "Mixed Review",
          bigIdea: "Bringing together regrouping in addition and subtraction.",
          skills: [
            {
              code: "ch3.review",
              title: "Chapter 3 mixed review",
              description: "Mixed practice across all Chapter 3 skills.",
              stage: "ABSTRACT",
              prerequisites: ["ch3.sub.acrosszero", "ch3.mixed.wordproblems"],
              questions: [
                { code: "ch3.review.q1", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "addition.within1000", params: { forceRegroup: true }, difficulty: 3 },
                { code: "ch3.review.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "subtraction.within1000", params: { acrossZero: true }, difficulty: 4 },
                { code: "ch3.review.q3", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "addsub.wordproblem", params: { op: "add" }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
