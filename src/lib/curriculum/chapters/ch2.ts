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
      workedExample: {
        problem: "The whole harvest is 90 apples. One basket has 60 apples. How many apples are in the other basket?",
        steps: [
          { text: "A number bond shows a whole split into two parts: whole = part + part." },
          {
            text: "Here the whole is 90, and one part (the first basket) is 60.",
            visual: { view: "numberBond", data: { whole: 90, part1: 60, part2: 30 } },
          },
          { text: "To find the missing part, subtract the known part from the whole: 90 − 60." },
          {
            text: "90 − 60 = 30.",
            visual: { view: "equals", data: { left: "90 - 60", right: 30 } },
          },
        ],
        answer: "The other basket has 30 apples.",
        answerVisual: { view: "numberBond", data: { whole: 90, part1: 60, part2: 30 } },
      },
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
                { code: "ch2.numberbond.q3", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "numberbond.missingpart", params: {}, difficulty: 2 },
                { code: "ch2.numberbond.q4", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "numberbond.missingpart", params: {}, difficulty: 4 },
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
      workedExample: {
        problem: "One farm picked 213 apples. Another farm picked 154 apples. How many apples in all?",
        steps: [
          { text: "Line the numbers up by place value: hundreds, tens, ones." },
          {
            text: "Add the ones: 3 + 4 = 7 — no regrouping needed, since it's under 10.",
            visual: { view: "equation", data: { left: 3, op: "+", right: 4, result: 7 } },
          },
          { text: "Add the tens: 1 ten + 5 tens = 6 tens." },
          {
            text: "Add the hundreds: 2 hundreds + 1 hundred = 3 hundreds.",
            visual: { view: "equation", data: { left: "2 hundreds", op: "+", right: "1 hundred", result: "3 hundreds" } },
          },
          {
            text: "Put it together: 367.",
            visual: { view: "placeValueBlocks", data: { hundreds: 3, tens: 6, ones: 7 } },
          },
        ],
        answer: "213 + 154 = 367",
        answerVisual: { view: "equation", data: { left: 213, op: "+", right: 154, result: 367 } },
      },
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
                { code: "ch2.add.mental.q3", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "addition.within1000", params: { forceRegroup: false }, difficulty: 3 },
                { code: "ch2.add.mental.q4", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "addsub.missingoperand", params: { op: "add" }, difficulty: 3 },
                { code: "ch2.add.mental.q5", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "addsub.findmistake", params: { op: "add" }, difficulty: 3 },
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
      workedExample: {
        problem: "The farmers had 378 apples. They sold 125 at the market. How many apples are left?",
        steps: [
          { text: "Line the numbers up by place value: hundreds, tens, ones." },
          {
            text: "Subtract the ones: 8 − 5 = 3 — no borrowing needed.",
            visual: { view: "equation", data: { left: 8, op: "-", right: 5, result: 3 } },
          },
          { text: "Subtract the tens: 7 tens − 2 tens = 5 tens." },
          {
            text: "Subtract the hundreds: 3 hundreds − 1 hundred = 2 hundreds.",
            visual: { view: "equation", data: { left: "3 hundreds", op: "-", right: "1 hundred", result: "2 hundreds" } },
          },
          {
            text: "Put it together: 253.",
            visual: { view: "placeValueBlocks", data: { hundreds: 2, tens: 5, ones: 3 } },
          },
        ],
        answer: "378 − 125 = 253",
        answerVisual: { view: "equation", data: { left: 378, op: "-", right: 125, result: 253 } },
      },
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
                { code: "ch2.sub.mental.q3", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "subtraction.within1000", params: {}, difficulty: 3 },
                { code: "ch2.sub.mental.q4", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "addsub.missingoperand", params: { op: "sub" }, difficulty: 3 },
                { code: "ch2.sub.mental.q5", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "addsub.findmistake", params: { op: "sub" }, difficulty: 3 },
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
      workedExample: {
        problem: "Farm A harvested 340 pumpkins. Farm B harvested 210 pumpkins. How many more pumpkins did Farm A harvest?",
        steps: [
          {
            text: "Draw a bar for Farm A (340) and a shorter bar for Farm B (210) lined up at the start.",
            visual: { view: "barModelCompare", data: { larger: 340, smaller: 210 } },
          },
          { text: "The question 'how many more' asks for the gap between the two bars." },
          {
            text: "Find the gap by subtracting the smaller amount from the larger amount: 340 − 210.",
            visual: { view: "equals", data: { left: "340 - 210", right: 130 } },
          },
          { text: "340 − 210 = 130." },
        ],
        answer: "Farm A harvested 130 more pumpkins.",
        answerVisual: { view: "barModelCompare", data: { larger: 340, smaller: 210 } },
      },
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
                { code: "ch2.compare.wordproblems.q3", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "addsub.wordproblem", params: { op: "compare" }, difficulty: 1 },
                { code: "ch2.compare.wordproblems.q4", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "addsub.wordproblem", params: { op: "compare" }, difficulty: 4 },
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
      workedExample: {
        problem: "There are 500 sunflowers in the field. 320 are yellow and the rest are orange. How many are orange?",
        steps: [
          {
            text: "The whole is 500 sunflowers, split into two parts: yellow and orange.",
            visual: { view: "barModelPartWhole", data: { whole: 500, known: 320, hiddenLabel: "orange" } },
          },
          { text: "One part (yellow) is known: 320. The other part (orange) is missing." },
          {
            text: "Whole − known part = missing part, so 500 − 320.",
            visual: { view: "equals", data: { left: "500 - 320", right: 180 } },
          },
          { text: "500 − 320 = 180." },
        ],
        answer: "180 sunflowers are orange.",
        answerVisual: { view: "barModelPartWhole", data: { whole: 500, known: 320, hiddenLabel: "orange" } },
      },
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
                { code: "ch2.partwhole.wordproblems.q3", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "addsub.wordproblem", params: { op: "add" }, difficulty: 4 },
                { code: "ch2.partwhole.wordproblems.q4", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "addsub.wordproblem", params: { op: "sub" }, difficulty: 4 },
                { code: "ch2.partwhole.wordproblems.q5", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "addsub.twostep", params: {}, difficulty: 3 },
                { code: "ch2.partwhole.wordproblems.q6", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "addsub.twostep", params: {}, difficulty: 5 },
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
      workedExample: {
        problem: "Quick recap: what's the one big idea behind every skill in Addition Valley?",
        steps: [
          {
            text: "Number bonds, addition, and subtraction are all part-whole relationships in disguise.",
            visual: { view: "numberBond", data: { whole: 90, part1: 60, part2: 30 } },
          },
          {
            text: "If you know the whole and one part, subtract to find the other part.",
            visual: { view: "equation", data: { left: 90, op: "-", right: 60, result: 30 } },
          },
          {
            text: "If you know both parts, add to find the whole.",
            visual: { view: "equation", data: { left: 213, op: "+", right: 154, result: 367 } },
          },
          {
            text: "For 'how many more/fewer' problems, subtract the smaller amount from the larger one.",
            visual: { view: "barModelCompare", data: { larger: 340, smaller: 210 } },
          },
        ],
        answer: "Whole = part + part — every problem in this chapter uses that one idea.",
        answerVisual: { view: "numberBond", data: { whole: 90, part1: 60, part2: 30 } },
      },
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
                { code: "ch2.review.q4", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "addsub.findmistake", params: { op: "add" }, difficulty: 4 },
                { code: "ch2.review.q5", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "addsub.findmistake", params: { op: "sub" }, difficulty: 4 },
                { code: "ch2.review.q6", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "addsub.missingoperand", params: { op: "add" }, difficulty: 3 },
                { code: "ch2.review.q7", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "addsub.twostep", params: {}, difficulty: 4 },
                { code: "ch2.review.q8", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "numberbond.missingpart", params: {}, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
