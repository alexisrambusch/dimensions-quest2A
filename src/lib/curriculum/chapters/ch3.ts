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
      workedExample: {
        problem: "One supply crate holds 158 tools. Another holds 136 tools. How many tools in all?",
        steps: [
          "Add the ones first: 8 + 6 = 14. That's more than 10 ones, so regroup: 1 ten and 4 ones.",
          "Write down the 4 ones, and carry the extra 1 ten over to the tens column.",
          "Add the tens: 5 + 3 + the 1 you carried = 9 tens.",
          "Add the hundreds: 1 + 1 = 2 hundreds.",
          "Put it together: 294.",
        ],
        answer: "158 + 136 = 294",
      },
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
                { code: "ch3.add.regroup.q3", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "addition.within1000", params: { forceRegroup: true }, difficulty: 2 },
                { code: "ch3.add.regroup.q4", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "addsub.findmistake", params: { op: "add" }, difficulty: 4 },
                { code: "ch3.add.regroup.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "addsub.missingoperand", params: { op: "add" }, difficulty: 4 },
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
      workedExample: {
        problem: "The ranger station has 262 supply crates. 148 are sent up the trail. How many crates are left?",
        steps: [
          "Look at the ones first: 2 − 8. You can't take 8 away from 2, so you need to regroup.",
          "Regroup 1 ten from the tens column into 10 ones: now you have 5 tens and 12 ones.",
          "Subtract the ones: 12 − 8 = 4.",
          "Subtract the tens: 5 − 4 = 1.",
          "Subtract the hundreds: 2 − 1 = 1.",
          "Put it together: 114.",
        ],
        answer: "262 − 148 = 114",
      },
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
                { code: "ch3.sub.regroup.q3", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "subtraction.within1000", params: {}, difficulty: 2 },
                { code: "ch3.sub.regroup.q4", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "addsub.findmistake", params: { op: "sub" }, difficulty: 4 },
                { code: "ch3.sub.regroup.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "addsub.missingoperand", params: { op: "sub" }, difficulty: 4 },
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
      workedExample: {
        problem: "There are 304 climbing ropes at the depot. 129 are packed away for the summit trip. How many ropes are left?",
        steps: [
          "Look at the ones first: 4 − 9. You can't do that, so you need to regroup — but the tens digit is 0!",
          "Since there are no tens to regroup from, regroup a hundred first: 3 hundreds becomes 2 hundreds and 10 tens.",
          "Now regroup one of those tens into ones: 10 tens becomes 9 tens, and you get 10 extra ones, making 14 ones.",
          "Subtract the ones: 14 − 9 = 5.",
          "Subtract the tens: 9 − 2 = 7.",
          "Subtract the hundreds: 2 − 1 = 1.",
          "Put it together: 175.",
        ],
        answer: "304 − 129 = 175",
      },
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
                { code: "ch3.sub.acrosszero.q3", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "subtraction.within1000", params: { acrossZero: true }, difficulty: 3 },
                { code: "ch3.sub.acrosszero.q4", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "subtraction.within1000", params: { acrossZero: true }, difficulty: 5 },
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
      workedExample: {
        problem: "The trail crew found 275 pinecones on Monday and 189 more on Tuesday. Then they used 340 pinecones for a craft project. How many pinecones are left?",
        steps: [
          "This story has two steps — first combine what was found, then take away what was used.",
          "Step 1: add the two days together. 275 + 189 = 464.",
          "Step 2: subtract how many were used from that total. 464 − 340 = 124.",
          "Always do the steps in the order the story happens.",
        ],
        answer: "124 pinecones are left.",
      },
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
                { code: "ch3.mixed.wordproblems.q4", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "addsub.wordproblem", params: { op: "add" }, difficulty: 5 },
                { code: "ch3.mixed.wordproblems.q5", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "addsub.twostep", params: {}, difficulty: 4 },
                { code: "ch3.mixed.wordproblems.q6", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "addsub.twostep", params: {}, difficulty: 5 },
                { code: "ch3.mixed.wordproblems.q7", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "addsub.extremepair", params: { mode: "greatest" }, difficulty: 4 },
                { code: "ch3.mixed.wordproblems.q8", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "addsub.extremepair", params: { mode: "least" }, difficulty: 4 },
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
      workedExample: {
        problem: "Quick recap: regrouping in addition and subtraction both use the same trick. What is it?",
        steps: [
          "In addition, when a column adds up to 10 or more, trade 10 of that place for 1 of the next place up.",
          "In subtraction, when there aren't enough to take away, trade 1 of the next place up for 10 of the current place.",
          "If the place you need to borrow from is 0, borrow from the next place over first, then regroup down.",
          "Either way, you're always trading groups of 10 between neighboring places — nothing is created or lost.",
        ],
        answer: "Regrouping just trades between neighboring places in groups of 10 — the total value never changes.",
      },
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
                { code: "ch3.review.q4", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "addsub.findmistake", params: { op: "add" }, difficulty: 5 },
                { code: "ch3.review.q5", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "addsub.findmistake", params: { op: "sub" }, difficulty: 5 },
                { code: "ch3.review.q6", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "addsub.missingoperand", params: { op: "sub" }, difficulty: 4 },
                { code: "ch3.review.q7", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "addsub.twostep", params: {}, difficulty: 5 },
                { code: "ch3.review.q8", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "addsub.extremepair", params: { mode: "least" }, difficulty: 5 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
