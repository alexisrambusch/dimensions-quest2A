import type { ChapterDef } from "../types";

export const ch2: ChapterDef = {
  code: "ch2",
  title: "Addition & Subtraction — Part 1",
  description: "Understand addition and subtraction through number bonds, part-whole relationships, and comparison.",
  worldName: "Addition Valley",
  worldTheme: "valley",
  lessons: [
    {
      code: "ch2-l1",
      title: "Number Bonds",
      type: "STANDARD",
      objective: "Use number bonds to see the part-whole relationship between numbers.",
      missionBriefing: "The Valley farmers split their harvest into baskets. Help them find the missing part!",
      concepts: [
        {
          title: "Part-Whole Thinking",
          bigIdea: "A whole is made of two parts; knowing the whole and one part gives you the other.",
          skills: [
            {
              code: "ch2.numberbond",
              title: "Find the missing part in a number bond",
              description: "Given a whole and one part, find the other part.",
              stage: "PICTORIAL",
              prerequisites: ["ch1.placevalue.build"],
              questions: [
                { code: "ch2.numberbond.q1", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "numberbond.missingpart", params: {}, difficulty: 1 },
                { code: "ch2.numberbond.q2", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "numberbond.missingpart", params: {}, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch2-l2",
      title: "Addition Strategies",
      type: "STANDARD",
      objective: "Add two numbers within 1,000 using mental strategies, without regrouping.",
      missionBriefing: "Combine two piles of Valley apples without spilling a single one — no regrouping needed yet!",
      concepts: [
        {
          title: "Adding Without Regrouping",
          bigIdea: "You can add hundreds to hundreds, tens to tens, and ones to ones.",
          skills: [
            {
              code: "ch2.add.mental",
              title: "Add within 1,000 (no regrouping)",
              description: "Add two numbers where no column sums to 10 or more.",
              stage: "PICTORIAL",
              prerequisites: ["ch2.numberbond"],
              questions: [
                { code: "ch2.add.mental.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "addition.within1000", params: { forceRegroup: false }, difficulty: 1 },
                { code: "ch2.add.mental.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "addition.within1000", params: { forceRegroup: false }, difficulty: 2 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch2-l3",
      title: "Subtraction Strategies",
      type: "STANDARD",
      objective: "Subtract within 1,000 using mental strategies, without regrouping.",
      missionBriefing: "Some apples were sold at the Valley market. Figure out how many are left.",
      concepts: [
        {
          title: "Subtracting Without Regrouping",
          bigIdea: "Subtraction finds a missing part when you know the whole and the other part.",
          skills: [
            {
              code: "ch2.sub.mental",
              title: "Subtract within 1,000 (no regrouping)",
              description: "Subtract two numbers where no borrowing is needed.",
              stage: "PICTORIAL",
              prerequisites: ["ch2.numberbond"],
              questions: [
                { code: "ch2.sub.mental.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "subtraction.within1000", params: {}, difficulty: 1 },
                { code: "ch2.sub.mental.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "subtraction.within1000", params: {}, difficulty: 2 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch2-l4",
      title: "Comparison Word Problems",
      type: "STANDARD",
      objective: "Solve word problems that compare two quantities using a bar model.",
      missionBriefing: "Two Valley farms are comparing their harvests. How many more does one have?",
      concepts: [
        {
          title: "Comparing with Bar Models",
          bigIdea: "\"How many more/fewer\" problems are solved by subtracting.",
          skills: [
            {
              code: "ch2.compare.wordproblems",
              title: "Solve comparison word problems",
              description: "Use a bar model to find the difference between two quantities.",
              stage: "PICTORIAL",
              prerequisites: ["ch2.sub.mental"],
              questions: [
                { code: "ch2.compare.wordproblems.q1", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "addsub.wordproblem", params: { op: "compare" }, difficulty: 2 },
                { code: "ch2.compare.wordproblems.q2", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "addsub.wordproblem", params: { op: "compare" }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch2-l5",
      title: "Part-Whole Word Problems",
      type: "PRACTICE",
      objective: "Solve part-whole addition and subtraction word problems using bar models.",
      missionBriefing: "Put your number-bond thinking to work solving real Valley stories.",
      concepts: [
        {
          title: "Part-Whole Word Problems",
          bigIdea: "Identify the whole and the parts before deciding whether to add or subtract.",
          skills: [
            {
              code: "ch2.partwhole.wordproblems",
              title: "Solve part-whole word problems",
              description: "Decide whether to add or subtract based on what is known and unknown.",
              stage: "PICTORIAL",
              prerequisites: ["ch2.add.mental", "ch2.sub.mental"],
              questions: [
                { code: "ch2.partwhole.wordproblems.q1", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "addsub.wordproblem", params: { op: "add" }, difficulty: 2 },
                { code: "ch2.partwhole.wordproblems.q2", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "addsub.wordproblem", params: { op: "sub" }, difficulty: 2 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch2-review",
      title: "Chapter Review: Addition Valley",
      type: "REVIEW",
      objective: "Review number bonds, addition, subtraction, and word problems within 1,000.",
      missionBriefing: "One last round through the Valley before the next adventure!",
      concepts: [
        {
          title: "Mixed Review",
          bigIdea: "Bringing together number bonds, addition, and subtraction.",
          skills: [
            {
              code: "ch2.review",
              title: "Chapter 2 mixed review",
              description: "Mixed practice across all Chapter 2 skills.",
              stage: "ABSTRACT",
              prerequisites: ["ch2.compare.wordproblems", "ch2.partwhole.wordproblems"],
              questions: [
                { code: "ch2.review.q1", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "addition.within1000", params: {}, difficulty: 2 },
                { code: "ch2.review.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "subtraction.within1000", params: {}, difficulty: 2 },
                { code: "ch2.review.q3", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "addsub.wordproblem", params: { op: "compare" }, difficulty: 2 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
