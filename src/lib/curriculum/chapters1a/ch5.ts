import type { ChapterDef } from "../types";

export const g1ch5: ChapterDef = {
  code: "g1ch5",
  title: "Numbers to 20",
  description: "Count, order, compare, add, and subtract with numbers up to 20 — every teen number is 10 and some ones.",
  worldName: "Twinkle Carnival",
  worldTheme: "carnival",
  lessons: [
    {
      code: "g1ch5-l1",
      title: "Numbers to 20",
      type: "STANDARD",
      objective: "Understand every teen number (11-20) as 10 plus some ones.",
      missionBriefing: "Welcome to the Twinkle Carnival! Every prize count past 10 is really just '10 and some more' — let's learn to see it that way.",
      workedExample: {
        problem: "There are 10 blue hats and 5 red hats. How many hats altogether?",
        steps: [
          { text: "10 is a whole group by itself — a full ten." },
          { text: "5 more join it: 10 + 5.", visual: { view: "numberBond", data: { whole: 15, part1: 10, part2: 5 } } },
          { text: "10 + 5 = 15 — fifteen is '10 and 5 ones.'" },
        ],
        answer: "There are 15 hats altogether.",
        answerVisual: { view: "equation", data: { left: 10, op: "+", right: 5, result: 15 } },
      },
      concepts: [
        {
          title: "Ten and Some Ones",
          bigIdea: "Every number from 11 to 20 is exactly one ten plus some ones — that's the whole idea of a teen number.",
          skills: [
            {
              code: "g1ch5.teen",
              title: "Numbers to 20 as 10 and ones",
              description: "Compose a teen number (11-20) from 10 and a number of ones.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch2.make10a"],
              questions: [
                { code: "g1ch5.teen.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.teen.tensones", params: { forms: ["addTen"] }, difficulty: 1 },
                { code: "g1ch5.teen.q2", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.teen.tensones", params: { forms: ["addTen"] }, difficulty: 2 },
                { code: "g1ch5.teen.q3", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.teen.tensones", params: { forms: ["addOnes"] }, difficulty: 2 },
                { code: "g1ch5.teen.q4", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.teen.tensones", params: { forms: ["addOnes"] }, difficulty: 3 },
                { code: "g1ch5.teen.q5", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.teen.tensones", params: { forms: ["addTen", "addOnes"] }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch5-l2",
      title: "Add or Subtract Tens or Ones",
      type: "STANDARD",
      objective: "Move fluently between a teen number and its ten and its ones, using both addition and subtraction.",
      missionBriefing: "16 cups are on the carnival table — 10 pink, 6 purple. Can you find the total by adding, and find a missing group by subtracting?",
      workedExample: {
        problem: "There are 10 pink cups and 6 purple cups. How many cups altogether? If there are 16 cups and 6 are purple, how many are pink?",
        steps: [
          { text: "To find the total, add the ten and the ones: 10 + 6 = 16.", visual: { view: "numberBond", data: { whole: 16, part1: 10, part2: 6 } } },
          { text: "To find a missing part, subtract the known part from the whole: 16 − 6 = 10." },
        ],
        answer: "10 + 6 = 16, and 16 − 6 = 10.",
        answerVisual: { view: "equation", data: { left: 16, op: "-", right: 6, result: 10 } },
      },
      concepts: [
        {
          title: "The Ten and the Ones, Both Ways",
          bigIdea: "A teen number's ten and ones connect through addition (ten + ones = teen) and subtraction (teen − ones = ten, teen − ten = ones).",
          skills: [
            {
              code: "g1ch5.tensones",
              title: "Add or subtract tens or ones",
              description: "Add a ten and ones to make a teen number, or subtract to find the missing ten or ones.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch5.teen"],
              questions: [
                { code: "g1ch5.tensones.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.teen.tensones", params: { forms: ["addTen", "addOnes"] }, difficulty: 2 },
                { code: "g1ch5.tensones.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.teen.tensones", params: { forms: ["subOnes"] }, difficulty: 2 },
                { code: "g1ch5.tensones.q3", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.teen.tensones", params: { forms: ["subTen"] }, difficulty: 3 },
                { code: "g1ch5.tensones.q4", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.teen.tensones", params: {}, difficulty: 3 },
                { code: "g1ch5.tensones.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.teen.tensones", params: {}, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch5-l3",
      title: "Order Numbers to 20",
      type: "STANDARD",
      objective: "Order numbers to 20, find 1 more or 1 less, and fill in missing numbers in a sequence.",
      missionBriefing: "Line up the carnival ticket numbers from 11 to 20 — and figure out what number comes right before or after any of them.",
      workedExample: {
        problem: "What number is 1 more than 18? What number is 1 less than 15?",
        steps: [
          { text: "1 more than 18 means count on by 1: 18, 19.", visual: { view: "equation", data: { left: 18, op: "+", right: 1, result: 19 } } },
          { text: "1 less than 15 means count back by 1: 15, 14." },
        ],
        answer: "1 more than 18 is 19. 1 less than 15 is 14.",
        answerVisual: { view: "equation", data: { left: 15, op: "-", right: 1, result: 14 } },
      },
      concepts: [
        {
          title: "Ordering to 20",
          bigIdea: "Numbers to 20 follow the exact same ordering pattern as numbers to 10 — just keep counting past the ten.",
          skills: [
            {
              code: "g1ch5.order",
              title: "Order numbers to 20",
              description: "Arrange numbers from 0-20 in order, and fill in a missing number in a counting sequence.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch5.teen", "g1ch1.order"],
              questions: [
                { code: "g1ch5.order.q1", kind: "SORT_ORDER", stage: "ABSTRACT", generatorId: "order.numbers", params: { min: 11, max: 20, count: 3 }, difficulty: 2 },
                { code: "g1ch5.order.q2", kind: "SORT_ORDER", stage: "ABSTRACT", generatorId: "order.numbers", params: { min: 11, max: 20, count: 3, direction: "desc" }, difficulty: 2 },
                { code: "g1ch5.order.q3", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.count.sequence", params: { max: 20 }, difficulty: 2 },
                { code: "g1ch5.order.q4", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.count.sequence", params: { max: 20, direction: "backward" }, difficulty: 3 },
                { code: "g1ch5.order.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 20, bMin: 1, bMax: 1 }, difficulty: 2 },
                { code: "g1ch5.order.q6", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 20, bMin: 1, bMax: 1 }, difficulty: 2 },
                { code: "g1ch5.order.q7", kind: "SORT_ORDER", stage: "ABSTRACT", generatorId: "order.numbers", params: { min: 0, max: 20, count: 4 }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch5-l4",
      title: "Compare Numbers to 20",
      type: "STANDARD",
      objective: "Compare two numbers to 20 using more, fewer, and the symbols <, >, =.",
      missionBriefing: "Which carnival game booth gave out more prizes — the one with 16, or the one with 12?",
      workedExample: {
        problem: "Which is greater: 16 or 12?",
        steps: [
          { text: "Both numbers have 1 ten, so compare the ones: 16 has 6 ones, 12 has 2 ones." },
          { text: "6 ones is more than 2 ones, so 16 is greater.", visual: { view: "compareNumbers", data: { a: 16, b: 12, symbol: ">" } } },
        ],
        answer: "16 > 12.",
        answerVisual: { view: "compareNumbers", data: { a: 16, b: 12, symbol: ">" } },
      },
      concepts: [
        {
          title: "More, Fewer, and Equal to 20",
          bigIdea: "Comparing teen numbers works the same way as comparing numbers to 10 — compare the tens first, then the ones.",
          skills: [
            {
              code: "g1ch5.compare",
              title: "Compare numbers to 20",
              description: "Use <, >, and = to compare two numbers from 0-20.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch5.teen", "g1ch1.compare"],
              questions: [
                { code: "g1ch5.compare.q1", kind: "MULTIPLE_CHOICE", stage: "PICTORIAL", generatorId: "compare.numbers", params: { min: 0, max: 20 }, difficulty: 1 },
                { code: "g1ch5.compare.q2", kind: "MULTIPLE_CHOICE", stage: "PICTORIAL", generatorId: "compare.numbers", params: { min: 11, max: 20 }, difficulty: 2 },
                { code: "g1ch5.compare.q3", kind: "MULTIPLE_CHOICE", stage: "PICTORIAL", generatorId: "compare.numbers", params: { min: 11, max: 20 }, difficulty: 3 },
                { code: "g1ch5.compare.q4", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "compare.numbers", params: { min: 0, max: 20 }, difficulty: 3 },
                { code: "g1ch5.compare.q5", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "compare.numbers", params: { min: 0, max: 20 }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch5-l5",
      title: "Addition",
      type: "STANDARD",
      objective: "Add a single digit to a teen number without crossing into another ten.",
      missionBriefing: "There are 12 candies in the jar and 3 more are added. The ten stays whole — only the ones change!",
      workedExample: {
        problem: "There are 12 green candies and 3 orange candies. How many candies altogether?",
        steps: [
          { text: "12 is 1 ten and 2 ones." },
          { text: "Add the 3 ones to the 2 ones: 2 + 3 = 5 ones.", visual: { view: "numberBond", data: { whole: 15, part1: 12, part2: 3 } } },
          { text: "The ten stays the same: 1 ten and 5 ones is 15." },
        ],
        answer: "There are 15 candies altogether.",
        answerVisual: { view: "equation", data: { left: 12, op: "+", right: 3, result: 15 } },
      },
      concepts: [
        {
          title: "Adding Within the Same Ten",
          bigIdea: "Adding a small number to a teen number only changes the ones — the ten stays exactly the same.",
          skills: [
            {
              code: "g1ch5.add",
              title: "Addition within 20 (no new ten)",
              description: "Add a single digit to a teen number (11-19) without crossing into the next ten.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch5.tensones", "g1ch3.facts"],
              questions: [
                { code: "g1ch5.add.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.teen.addsub.nocross", params: { op: "add" }, difficulty: 1 },
                { code: "g1ch5.add.q2", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.teen.addsub.nocross", params: { op: "add" }, difficulty: 2 },
                { code: "g1ch5.add.q3", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.teen.addsub.nocross", params: { op: "add" }, difficulty: 3 },
                { code: "g1ch5.add.q4", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.teen.addsub.nocross", params: { op: "add", missing: "b" }, difficulty: 4 },
                { code: "g1ch5.add.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.teen.addsub.nocross", params: { op: "add" }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch5-l6",
      title: "Subtraction",
      type: "STANDARD",
      objective: "Subtract a single digit from a teen number without crossing below the ten.",
      missionBriefing: "15 foxes are sitting in the snow and 3 go away to find something to eat. The ten stays whole — only the ones change!",
      workedExample: {
        problem: "There are 15 foxes. 3 go away. How many foxes are left?",
        steps: [
          { text: "15 is 1 ten and 5 ones." },
          { text: "Subtract the 3 from the 5 ones: 5 − 3 = 2 ones.", visual: { view: "numberBond", data: { whole: 15, part1: 12, part2: 3 } } },
          { text: "The ten stays the same: 1 ten and 2 ones is 12." },
        ],
        answer: "There are 12 foxes left.",
        answerVisual: { view: "equation", data: { left: 15, op: "-", right: 3, result: 12 } },
      },
      concepts: [
        {
          title: "Subtracting Within the Same Ten",
          bigIdea: "Subtracting a small number from a teen number only changes the ones — the ten stays exactly the same.",
          skills: [
            {
              code: "g1ch5.sub",
              title: "Subtraction within 20 (no borrowing)",
              description: "Subtract a single digit from a teen number (11-19) without crossing below the ten.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch5.tensones", "g1ch4.facts"],
              questions: [
                { code: "g1ch5.sub.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.teen.addsub.nocross", params: { op: "sub" }, difficulty: 1 },
                { code: "g1ch5.sub.q2", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.teen.addsub.nocross", params: { op: "sub" }, difficulty: 2 },
                { code: "g1ch5.sub.q3", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.teen.addsub.nocross", params: { op: "sub" }, difficulty: 3 },
                { code: "g1ch5.sub.q4", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.teen.addsub.nocross", params: { op: "sub", missing: "b" }, difficulty: 4 },
                { code: "g1ch5.sub.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.teen.addsub.nocross", params: { op: "sub" }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch5-l7",
      title: "Practice",
      type: "PRACTICE",
      objective: "Mixed practice with numbers to 20 — composing teens, ordering, comparing, adding, and subtracting.",
      missionBriefing: "Show off everything you've learned at the Twinkle Carnival!",
      workedExample: {
        problem: "Quick recap: what's the one big idea behind every number to 20?",
        steps: [
          { text: "Every teen number is 1 ten and some ones.", visual: { view: "numberBond", data: { whole: 14, part1: 10, part2: 4 } } },
          { text: "Ordering and comparing teens works just like numbers to 10 — just one ten further." },
          { text: "Adding or subtracting a small number only changes the ones, as long as you don't cross the ten." },
        ],
        answer: "Every number to 20 is built from a ten and some ones.",
      },
      concepts: [
        {
          title: "Mixed Review",
          bigIdea: "Bringing together every way of thinking about numbers to 20.",
          skills: [
            {
              code: "g1ch5.practice",
              title: "Chapter 5 mixed practice",
              description: "Mixed practice with numbers to 20.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch5.add", "g1ch5.sub", "g1ch5.compare", "g1ch5.order"],
              questions: [
                { code: "g1ch5.practice.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.teen.tensones", params: {}, difficulty: 2 },
                { code: "g1ch5.practice.q2", kind: "SORT_ORDER", stage: "ABSTRACT", generatorId: "order.numbers", params: { min: 11, max: 20, count: 3 }, difficulty: 2 },
                { code: "g1ch5.practice.q3", kind: "MULTIPLE_CHOICE", stage: "PICTORIAL", generatorId: "compare.numbers", params: { min: 0, max: 20 }, difficulty: 2 },
                { code: "g1ch5.practice.q4", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.teen.addsub.nocross", params: { op: "add" }, difficulty: 3 },
                { code: "g1ch5.practice.q5", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.teen.addsub.nocross", params: { op: "sub" }, difficulty: 3 },
                { code: "g1ch5.practice.q6", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.count.sequence", params: { max: 20 }, difficulty: 3 },
                { code: "g1ch5.practice.q7", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.teen.addsub.nocross", params: { op: "add", missing: "b" }, difficulty: 4 },
                { code: "g1ch5.practice.q8", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.teen.addsub.nocross", params: { op: "sub", missing: "b" }, difficulty: 5 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
