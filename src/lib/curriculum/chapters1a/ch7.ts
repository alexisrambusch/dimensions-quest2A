import type { ChapterDef } from "../types";

export const g1ch7: ChapterDef = {
  code: "g1ch7",
  title: "Subtraction Within 20",
  description: "Subtract a single digit from a teen number that crosses below the ten, using 'subtract from 10' or 'subtract the ones first.'",
  worldName: "Seashell Cove",
  worldTheme: "cove",
  lessons: [
    {
      code: "g1ch7-l1",
      title: "Subtract from 10 — Part 1",
      type: "STANDARD",
      objective: "Subtract 8 or 9 from a teen number by first subtracting from the ten.",
      missionBriefing: "15 cars are in the Seashell Cove parking lot. 8 drive away. Can you subtract from the ten first to find how many are left?",
      workedExample: {
        problem: "There are 15 cars in the parking lot. 8 cars drive away. How many cars are left?",
        steps: [
          { text: "15 is 1 ten and 5 ones." },
          { text: "Subtract 8 from the ten: 10 − 8 = 2.", visual: { view: "numberBond", data: { whole: 15, part1: 10, part2: 5 } } },
          { text: "Add back the ones: 2 + 5 = 7." },
        ],
        answer: "There are 7 cars left.",
        answerVisual: { view: "equation", data: { left: 15, op: "-", right: 8, result: 7 } },
      },
      concepts: [
        {
          title: "Subtract from the Ten",
          bigIdea: "When the subtrahend is close to 10, subtract it from the ten first — then add back whatever ones were left over.",
          skills: [
            {
              code: "g1ch7.subten1",
              title: "Subtract from 10 — Part 1",
              description: "Subtract 8 or 9 from a teen number using the subtract-from-10 strategy.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch2.make10a", "g1ch6.maketen1"],
              questions: [
                { code: "g1ch7.subten1.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.crossten", params: { bMin: 8, bMax: 9 }, difficulty: 1 },
                { code: "g1ch7.subten1.q2", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.crossten", params: { bMin: 8, bMax: 9 }, difficulty: 2 },
                { code: "g1ch7.subten1.q3", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.crossten", params: { bMin: 8, bMax: 9 }, difficulty: 2 },
                { code: "g1ch7.subten1.q4", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.crossten", params: { bMin: 8, bMax: 9 }, difficulty: 3 },
                { code: "g1ch7.subten1.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.crossten", params: { bMin: 8, bMax: 9 }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch7-l2",
      title: "Subtract from 10 — Part 2",
      type: "STANDARD",
      objective: "Subtract 6 or 7 from a teen number by first subtracting from the ten.",
      missionBriefing: "Mei caught 12 trout and puts 7 back. Same strategy as before, a little further from the ten.",
      workedExample: {
        problem: "Mei caught 12 trout. She puts 7 back. How many trout are left?",
        steps: [
          { text: "12 is 1 ten and 2 ones." },
          { text: "Subtract 7 from the ten: 10 − 7 = 3.", visual: { view: "numberBond", data: { whole: 12, part1: 10, part2: 2 } } },
          { text: "Add back the ones: 3 + 2 = 5." },
        ],
        answer: "There are 5 trout left.",
        answerVisual: { view: "equation", data: { left: 12, op: "-", right: 7, result: 5 } },
      },
      concepts: [
        {
          title: "Subtract from the Ten, Further Out",
          bigIdea: "The subtract-from-10 strategy works for any subtrahend, not just ones close to 10.",
          skills: [
            {
              code: "g1ch7.subten2",
              title: "Subtract from 10 — Part 2",
              description: "Subtract 6 or 7 from a teen number using the subtract-from-10 strategy.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch7.subten1"],
              questions: [
                { code: "g1ch7.subten2.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.crossten", params: { bMin: 6, bMax: 7 }, difficulty: 1 },
                { code: "g1ch7.subten2.q2", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.crossten", params: { bMin: 6, bMax: 7 }, difficulty: 2 },
                { code: "g1ch7.subten2.q3", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.crossten", params: { bMin: 6, bMax: 7 }, difficulty: 2 },
                { code: "g1ch7.subten2.q4", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.crossten", params: { bMin: 6, bMax: 7 }, difficulty: 3 },
                { code: "g1ch7.subten2.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.crossten", params: { bMin: 6, bMax: 7 }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch7-l3",
      title: "Subtract the Ones First",
      type: "STANDARD",
      objective: "Subtract a single digit from a teen number by first subtracting down to the ten, then subtracting the rest.",
      missionBriefing: "Sofia has 12 raspberries and eats 5. Which ones will she eat first — can subtracting the ones first make it easier?",
      workedExample: {
        problem: "Sofia has 12 raspberries. She eats 5 of them. How many raspberries are left?",
        steps: [
          { text: "Method 1 — subtract the ones first: 12 has 2 ones. Subtract those 2 first: 12 − 2 = 10." },
          { text: "Then subtract what's left of the 5: 5 − 2 = 3, so 10 − 3 = 7.", visual: { view: "numberBond", data: { whole: 5, part1: 2, part2: 3 } } },
          { text: "Method 2 — subtract from 10: 10 − 5 = 5, then 5 + 2 = 7. Both methods give the same answer." },
        ],
        answer: "There are 7 raspberries left.",
        answerVisual: { view: "equation", data: { left: 12, op: "-", right: 5, result: 7 } },
      },
      concepts: [
        {
          title: "Two Ways to Cross the Ten",
          bigIdea: "You can subtract the ones first to reach the ten, or subtract from the ten directly — both strategies cross the ten and land on the same answer.",
          skills: [
            {
              code: "g1ch7.subones",
              title: "Subtract the ones first",
              description: "Subtract a single digit from a teen number that crosses below the ten, choosing either strategy.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch7.subten2"],
              questions: [
                { code: "g1ch7.subones.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.crossten", params: { bMin: 2, bMax: 9 }, difficulty: 2 },
                { code: "g1ch7.subones.q2", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.crossten", params: { bMin: 2, bMax: 9 }, difficulty: 3 },
                { code: "g1ch7.subones.q3", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.crossten", params: { bMin: 2, bMax: 9 }, difficulty: 3 },
                { code: "g1ch7.subones.q4", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.crossten", params: { bMin: 2, bMax: 9 }, difficulty: 4 },
                { code: "g1ch7.subones.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.crossten", params: { bMin: 2, bMax: 9 }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch7-l4",
      title: "Word Problems",
      type: "STANDARD",
      objective: "Solve addition and subtraction word problems with numbers to 20.",
      missionBriefing: "15 balloons are floating by the cove. 7 fly away. How many word problems can you solve about them?",
      workedExample: {
        problem: "There are 15 balloons. 7 fly away. How many balloons will be left?",
        steps: [
          { text: "The whole is 15. One part (the ones that fly away) is 7.", visual: { view: "numberBond", data: { whole: 15, part1: 7, part2: 8 } } },
          { text: "Subtract the known part from the whole: 15 − 7 = 8." },
        ],
        answer: "There will be 8 balloons left.",
        answerVisual: { view: "equation", data: { left: 15, op: "-", right: 7, result: 8 } },
      },
      concepts: [
        {
          title: "Stories to 20",
          bigIdea: "Word problems to 20 use the exact same addition and subtraction thinking as problems to 10 — just bigger numbers.",
          skills: [
            {
              code: "g1ch7.wordproblems",
              title: "Word problems to 20",
              description: "Solve addition and subtraction word problems with numbers up to 20.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch7.subones", "g1ch6.maketen3"],
              questions: [
                { code: "g1ch7.wordproblems.q1", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 19 }, difficulty: 2 },
                { code: "g1ch7.wordproblems.q2", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.subtraction.wordproblem", params: { max: 19 }, difficulty: 2 },
                { code: "g1ch7.wordproblems.q3", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 19 }, difficulty: 3 },
                { code: "g1ch7.wordproblems.q4", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.subtraction.wordproblem", params: { max: 19 }, difficulty: 3 },
                { code: "g1ch7.wordproblems.q5", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.subtraction.wordproblem", params: { max: 19 }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch7-l5",
      title: "Subtraction Facts Within 20",
      type: "STANDARD",
      objective: "Build fast, automatic recall of subtraction facts that cross below the ten.",
      missionBriefing: "Flash-card time! Every subtraction fact that crosses the ten — can you answer fast, using your favorite strategy?",
      workedExample: {
        problem: "What patterns do you notice in 11-9, 12-9, 13-9, 14-9?",
        steps: [
          { text: "Subtracting 9 is just like subtracting 10, then adding 1 back." },
          { text: "11-9=2, 12-9=3, 13-9=4, 14-9=5 — the answer is always one less than the ones digit of the teen number, plus one." },
          { text: "Spotting the pattern makes every 'minus 9' fact fast to recall." },
        ],
        answer: "11−9=2, 12−9=3, 13−9=4, 14−9=5 — each answer grows by 1 as the teen number grows by 1.",
        answerVisual: { view: "equation", data: { left: 14, op: "-", right: 9, result: 5 } },
      },
      concepts: [
        {
          title: "Fast Fact Recall",
          bigIdea: "The more you practice crossing-the-ten subtraction facts, the faster and more automatic they become.",
          skills: [
            {
              code: "g1ch7.facts",
              title: "Subtraction facts within 20",
              description: "Quickly recall subtraction facts that cross below the ten.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch7.subones"],
              questions: [
                { code: "g1ch7.facts.q1", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.crossten", params: {}, difficulty: 2 },
                { code: "g1ch7.facts.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.crossten", params: {}, difficulty: 3 },
                { code: "g1ch7.facts.q3", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.crossten", params: {}, difficulty: 4 },
                { code: "g1ch7.facts.q4", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.crossten", params: {}, difficulty: 4 },
                { code: "g1ch7.facts.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.crossten", params: {}, difficulty: 5 },
                { code: "g1ch7.facts.q6", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.crossten", params: {}, difficulty: 5 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch7-l6",
      title: "Practice",
      type: "PRACTICE",
      objective: "Mixed practice subtracting within 20, including addition and subtraction word problems.",
      missionBriefing: "Show off everything you've learned about subtracting past the ten in Seashell Cove!",
      workedExample: {
        problem: "Quick recap: what's the one big idea behind every crossing-the-ten subtraction fact?",
        steps: [
          { text: "Break the teen number into a ten and some ones." },
          { text: "Subtract from the ten, or subtract the ones first — either way crosses the ten.", visual: { view: "numberBond", data: { whole: 7, part1: 2, part2: 5 } } },
          { text: "Add back whatever is left over to get the final answer." },
        ],
        answer: "Crossing the ten always means breaking the subtraction into two easier steps.",
      },
      concepts: [
        {
          title: "Mixed Review",
          bigIdea: "Bringing together every way of subtracting past the ten within 20.",
          skills: [
            {
              code: "g1ch7.practice",
              title: "Chapter 7 mixed practice",
              description: "Mixed practice subtracting within 20, plus addition and subtraction word problems.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch7.facts", "g1ch7.wordproblems"],
              questions: [
                { code: "g1ch7.practice.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.crossten", params: { bMin: 8, bMax: 9 }, difficulty: 2 },
                { code: "g1ch7.practice.q2", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.crossten", params: {}, difficulty: 3 },
                { code: "g1ch7.practice.q3", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 19 }, difficulty: 3 },
                { code: "g1ch7.practice.q4", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.subtraction.wordproblem", params: { max: 19 }, difficulty: 3 },
                { code: "g1ch7.practice.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.crossten", params: { missing: "b" }, difficulty: 4 },
                { code: "g1ch7.practice.q6", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.crossten", params: {}, difficulty: 4 },
                { code: "g1ch7.practice.q7", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.crossten", params: {}, difficulty: 4 },
                { code: "g1ch7.practice.q8", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.crossten", params: {}, difficulty: 5 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
