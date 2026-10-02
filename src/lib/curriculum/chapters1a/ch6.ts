import type { ChapterDef } from "../types";

export const g1ch6: ChapterDef = {
  code: "g1ch6",
  title: "Addition to 20",
  description: "Add two single-digit numbers that cross into the teens, using the 'make a ten' strategy.",
  worldName: "Sweet Bakery",
  worldTheme: "bakery",
  lessons: [
    {
      code: "g1ch6-l1",
      title: "Add by Making 10 — Part 1",
      type: "STANDARD",
      objective: "Add a number close to 10 (8 or 9) to a smaller number by first making a ten.",
      missionBriefing: "9 yellow peppers and 4 orange peppers are in the Sweet Bakery's garden crate. Can you make a 10 first to find the total fast?",
      workedExample: {
        problem: "There are 9 yellow peppers and 4 orange peppers. How many peppers are there altogether?",
        steps: [
          { text: "9 is close to 10 — only 1 more is needed to make a ten." },
          { text: "Split the 4 into 1 and 3: the 1 completes the ten, the 3 is left over.", visual: { view: "numberBond", data: { whole: 4, part1: 1, part2: 3 } } },
          { text: "9 + 1 = 10, then 10 + 3 = 13." },
        ],
        answer: "There are 13 peppers altogether.",
        answerVisual: { view: "equation", data: { left: 9, op: "+", right: 4, result: 13 } },
      },
      concepts: [
        {
          title: "Make a Ten from the Bigger Number",
          bigIdea: "When one addend is close to 10, split the other addend so part of it completes the ten — then add what's left.",
          skills: [
            {
              code: "g1ch6.maketen1",
              title: "Add by making 10 — Part 1",
              description: "Add 8 or 9 to a smaller number using the make-a-ten strategy.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch2.make10a", "g1ch5.add"],
              questions: [
                { code: "g1ch6.maketen1.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.crossten", params: { aMin: 8, aMax: 9, bMin: 2, bMax: 9 }, difficulty: 1 },
                { code: "g1ch6.maketen1.q2", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.crossten", params: { aMin: 8, aMax: 9, bMin: 2, bMax: 9 }, difficulty: 2 },
                { code: "g1ch6.maketen1.q3", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.crossten", params: { aMin: 8, aMax: 9, bMin: 2, bMax: 9 }, difficulty: 2 },
                { code: "g1ch6.maketen1.q4", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.crossten", params: { aMin: 8, aMax: 9, bMin: 2, bMax: 9 }, difficulty: 3 },
                { code: "g1ch6.maketen1.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.crossten", params: { aMin: 8, aMax: 9, bMin: 2, bMax: 9 }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch6-l2",
      title: "Add by Making 10 — Part 2",
      type: "STANDARD",
      objective: "Add a smaller number to a number close to 10 (8 or 9), making a ten with the second addend.",
      missionBriefing: "3 orange hangers, then 9 blue hangers. Same strategy, numbers swapped — make the ten with whichever addend is close to it.",
      workedExample: {
        problem: "Sofia has 3 orange coat hangers and 9 blue coat hangers. How many coat hangers does she have altogether?",
        steps: [
          { text: "9 is close to 10, even though it's the second number this time." },
          { text: "Split the 3 into 1 and 2: the 1 completes the ten, the 2 is left over.", visual: { view: "numberBond", data: { whole: 3, part1: 1, part2: 2 } } },
          { text: "1 + 9 = 10, then 10 + 2 = 12." },
        ],
        answer: "She has 12 coat hangers altogether.",
        answerVisual: { view: "equation", data: { left: 3, op: "+", right: 9, result: 12 } },
      },
      concepts: [
        {
          title: "Make a Ten, Either Order",
          bigIdea: "It doesn't matter which addend comes first — look for the one close to 10 and make a ten with it.",
          skills: [
            {
              code: "g1ch6.maketen2",
              title: "Add by making 10 — Part 2",
              description: "Add a smaller number to 8 or 9, using the make-a-ten strategy.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch6.maketen1"],
              questions: [
                { code: "g1ch6.maketen2.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.crossten", params: { aMin: 2, aMax: 9, bMin: 8, bMax: 9 }, difficulty: 1 },
                { code: "g1ch6.maketen2.q2", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.crossten", params: { aMin: 2, aMax: 9, bMin: 8, bMax: 9 }, difficulty: 2 },
                { code: "g1ch6.maketen2.q3", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.crossten", params: { aMin: 2, aMax: 9, bMin: 8, bMax: 9 }, difficulty: 2 },
                { code: "g1ch6.maketen2.q4", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.crossten", params: { aMin: 2, aMax: 9, bMin: 8, bMax: 9 }, difficulty: 3 },
                { code: "g1ch6.maketen2.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.crossten", params: { aMin: 2, aMax: 9, bMin: 8, bMax: 9 }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch6-l3",
      title: "Add by Making 10 — Part 3",
      type: "STANDARD",
      objective: "Add two single-digit numbers, choosing whichever addend to split to make a ten.",
      missionBriefing: "One box has 7 chocolates, the other has 8. Neither one is especially close to 10 — which one will you split to make a ten?",
      workedExample: {
        problem: "One box has 7 chocolates. The other box has 8 chocolates. How many chocolates altogether?",
        steps: [
          { text: "Method 1: split the 8 into 3 and 5, since 7 and 3 make 10.", visual: { view: "numberBond", data: { whole: 8, part1: 3, part2: 5 } } },
          { text: "7 + 3 = 10, then 10 + 5 = 15." },
          { text: "Method 2: split the 7 into 2 and 5, since 8 and 2 make 10 — either way gets the same answer." },
        ],
        answer: "There are 15 chocolates altogether.",
        answerVisual: { view: "equation", data: { left: 7, op: "+", right: 8, result: 15 } },
      },
      concepts: [
        {
          title: "Choosing Which to Split",
          bigIdea: "When neither addend is obviously close to 10, you can split either one — the make-a-ten strategy always works.",
          skills: [
            {
              code: "g1ch6.maketen3",
              title: "Add by making 10 — Part 3",
              description: "Add two single-digit numbers that cross into the teens, splitting whichever addend is convenient.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch6.maketen2"],
              questions: [
                { code: "g1ch6.maketen3.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.crossten", params: { aMin: 5, aMax: 9, bMin: 5, bMax: 9 }, difficulty: 2 },
                { code: "g1ch6.maketen3.q2", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.crossten", params: { aMin: 5, aMax: 9, bMin: 5, bMax: 9 }, difficulty: 3 },
                { code: "g1ch6.maketen3.q3", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.crossten", params: { aMin: 2, aMax: 9, bMin: 2, bMax: 9 }, difficulty: 3 },
                { code: "g1ch6.maketen3.q4", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 18 }, difficulty: 3 },
                { code: "g1ch6.maketen3.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.crossten", params: { aMin: 2, aMax: 9, bMin: 2, bMax: 9 }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch6-l4",
      title: "Addition Facts to 20",
      type: "STANDARD",
      objective: "Build fast, automatic recall of addition facts that cross into the teens.",
      missionBriefing: "Flash-card time! Every addition fact that crosses into the teens — can you answer fast, using make-a-ten in your head?",
      workedExample: {
        problem: "What patterns do you notice in 9+2, 9+3, 9+4, 9+5?",
        steps: [
          { text: "9 always needs just 1 more to make 10." },
          { text: "9+2=11, 9+3=12, 9+4=13, 9+5=14 — the answer is always 10 plus one less than the other addend." },
          { text: "Spotting this pattern makes every '9 plus something' fact fast to recall." },
        ],
        answer: "9+2=11, 9+3=12, 9+4=13, 9+5=14 — each answer is 10 + (the other number − 1).",
        answerVisual: { view: "equation", data: { left: 9, op: "+", right: 5, result: 14 } },
      },
      concepts: [
        {
          title: "Fast Fact Recall",
          bigIdea: "The more you practice crossing-the-ten addition facts, the faster and more automatic they become.",
          skills: [
            {
              code: "g1ch6.facts",
              title: "Addition facts to 20",
              description: "Quickly recall addition facts that cross into the teens.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch6.maketen3"],
              questions: [
                { code: "g1ch6.facts.q1", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.crossten", params: {}, difficulty: 2 },
                { code: "g1ch6.facts.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.crossten", params: {}, difficulty: 3 },
                { code: "g1ch6.facts.q3", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.crossten", params: {}, difficulty: 4 },
                { code: "g1ch6.facts.q4", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.crossten", params: {}, difficulty: 4 },
                { code: "g1ch6.facts.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.crossten", params: {}, difficulty: 5 },
                { code: "g1ch6.facts.q6", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.crossten", params: {}, difficulty: 5 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch6-l5",
      title: "Practice",
      type: "PRACTICE",
      objective: "Mixed practice adding single-digit numbers that cross into the teens.",
      missionBriefing: "Show off everything you've learned about making a ten in the Sweet Bakery!",
      workedExample: {
        problem: "Quick recap: what's the one big idea behind every crossing-the-ten addition fact?",
        steps: [
          { text: "Find the addend closest to 10." },
          { text: "Split the other addend so part of it completes the ten.", visual: { view: "numberBond", data: { whole: 5, part1: 1, part2: 4 } } },
          { text: "Add the ten, then add what's left over." },
        ],
        answer: "Making a ten first turns a hard fact into two easy ones.",
      },
      concepts: [
        {
          title: "Mixed Review",
          bigIdea: "Bringing together every way of making a ten to add within 20.",
          skills: [
            {
              code: "g1ch6.practice",
              title: "Chapter 6 mixed practice",
              description: "Mixed practice adding single-digit numbers that cross into the teens.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch6.facts"],
              questions: [
                { code: "g1ch6.practice.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.crossten", params: { aMin: 8, aMax: 9 }, difficulty: 2 },
                { code: "g1ch6.practice.q2", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.crossten", params: { bMin: 8, bMax: 9 }, difficulty: 2 },
                { code: "g1ch6.practice.q3", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.crossten", params: {}, difficulty: 3 },
                { code: "g1ch6.practice.q4", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 18 }, difficulty: 3 },
                { code: "g1ch6.practice.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.crossten", params: { missing: "a" }, difficulty: 4 },
                { code: "g1ch6.practice.q6", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.crossten", params: { missing: "b" }, difficulty: 4 },
                { code: "g1ch6.practice.q7", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.crossten", params: {}, difficulty: 4 },
                { code: "g1ch6.practice.q8", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.crossten", params: {}, difficulty: 5 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
