import type { ChapterDef } from "../types";

export const g1ch2: ChapterDef = {
  code: "g1ch2",
  title: "Number Bonds",
  description: "Break numbers from 6 to 10 apart into two parts, and put two parts back together — the foundation for all addition and subtraction.",
  worldName: "Treetop Grove",
  worldTheme: "treehouse",
  lessons: [
    {
      code: "g1ch2-l1",
      title: "Make 6",
      type: "STANDARD",
      objective: "Break 6 into two parts in every possible way, and find a missing part given the whole and one part.",
      missionBriefing: "6 fireflies are glowing in the Treetop Grove tonight. Some are near the fence, some are near the tree — help sort them into their two groups!",
      workedExample: {
        problem: "6 fireflies are glowing. 2 are near the fence and 4 are near the tree.",
        steps: [
          { text: "The whole group of fireflies is 6." },
          { text: "One part is near the fence: 2 fireflies.", visual: { view: "numberBond", data: { whole: 6, part1: 2, part2: 4 } } },
          { text: "The other part is near the tree: 4 fireflies." },
        ],
        answer: "6 is 2 and 4.",
        answerVisual: { view: "numberBond", data: { whole: 6, part1: 2, part2: 4 } },
      },
      concepts: [
        {
          title: "Breaking Apart 6",
          bigIdea: "A number can be split into two parts in more than one way, and the parts always add back up to the whole.",
          skills: [
            {
              code: "g1ch2.make6",
              title: "Make 6",
              description: "Find the missing part of a number bond when the whole is 6.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch1.count"],
              questions: [
                { code: "g1ch2.make6.q1", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [6], framing: "bond" }, difficulty: 1 },
                { code: "g1ch2.make6.q2", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [6], framing: "bond" }, difficulty: 2 },
                { code: "g1ch2.make6.q3", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [6], framing: "more" }, difficulty: 2 },
                { code: "g1ch2.make6.q4", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [6], framing: "more" }, difficulty: 3 },
                { code: "g1ch2.make6.q5", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [6] }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch2-l2",
      title: "Make 7",
      type: "STANDARD",
      objective: "Break 7 into two parts in every possible way, and find a missing part given the whole and one part.",
      missionBriefing: "7 acorns fell from the big oak tree. Some landed in the grass, some landed on the path — figure out how they split!",
      workedExample: {
        problem: "7 acorns fell. 3 landed in the grass and 4 landed on the path.",
        steps: [
          { text: "The whole group of acorns is 7." },
          { text: "One part is in the grass: 3 acorns.", visual: { view: "numberBond", data: { whole: 7, part1: 3, part2: 4 } } },
          { text: "The other part is on the path: 4 acorns." },
        ],
        answer: "7 is 3 and 4.",
        answerVisual: { view: "numberBond", data: { whole: 7, part1: 3, part2: 4 } },
      },
      concepts: [
        {
          title: "Breaking Apart 7",
          bigIdea: "A number can be split into two parts in more than one way, and the parts always add back up to the whole.",
          skills: [
            {
              code: "g1ch2.make7",
              title: "Make 7",
              description: "Find the missing part of a number bond when the whole is 7.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch2.make6"],
              questions: [
                { code: "g1ch2.make7.q1", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [7], framing: "bond" }, difficulty: 1 },
                { code: "g1ch2.make7.q2", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [7], framing: "bond" }, difficulty: 2 },
                { code: "g1ch2.make7.q3", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [7], framing: "more" }, difficulty: 2 },
                { code: "g1ch2.make7.q4", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [7], framing: "more" }, difficulty: 3 },
                { code: "g1ch2.make7.q5", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [7] }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch2-l3",
      title: "Make 8",
      type: "STANDARD",
      objective: "Break 8 into two parts in every possible way, and find a missing part given the whole and one part.",
      missionBriefing: "8 bees are buzzing around the flower patch. Some are on the pink flowers, some are on the red ones — sort them into their two groups!",
      workedExample: {
        problem: "8 bees are buzzing. 5 are on pink flowers and 3 are on red flowers.",
        steps: [
          { text: "The whole group of bees is 8." },
          { text: "One part is on pink flowers: 5 bees.", visual: { view: "numberBond", data: { whole: 8, part1: 5, part2: 3 } } },
          { text: "The other part is on red flowers: 3 bees." },
        ],
        answer: "8 is 5 and 3.",
        answerVisual: { view: "numberBond", data: { whole: 8, part1: 5, part2: 3 } },
      },
      concepts: [
        {
          title: "Breaking Apart 8",
          bigIdea: "A number can be split into two parts in more than one way, and the parts always add back up to the whole.",
          skills: [
            {
              code: "g1ch2.make8",
              title: "Make 8",
              description: "Find the missing part of a number bond when the whole is 8.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch2.make7"],
              questions: [
                { code: "g1ch2.make8.q1", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [8], framing: "bond" }, difficulty: 1 },
                { code: "g1ch2.make8.q2", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [8], framing: "bond" }, difficulty: 2 },
                { code: "g1ch2.make8.q3", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [8], framing: "more" }, difficulty: 2 },
                { code: "g1ch2.make8.q4", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [8], framing: "more" }, difficulty: 3 },
                { code: "g1ch2.make8.q5", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [8] }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch2-l4",
      title: "Make 9",
      type: "STANDARD",
      objective: "Break 9 into two parts in every possible way, and find a missing part given the whole and one part.",
      missionBriefing: "9 ducks are paddling near the pond. Some are on the grass, some are in the water — figure out how they split!",
      workedExample: {
        problem: "9 ducks are paddling. 4 are on the grass and 5 are in the water.",
        steps: [
          { text: "The whole group of ducks is 9." },
          { text: "One part is on the grass: 4 ducks.", visual: { view: "numberBond", data: { whole: 9, part1: 4, part2: 5 } } },
          { text: "The other part is in the water: 5 ducks." },
        ],
        answer: "9 is 4 and 5.",
        answerVisual: { view: "numberBond", data: { whole: 9, part1: 4, part2: 5 } },
      },
      concepts: [
        {
          title: "Breaking Apart 9",
          bigIdea: "A number can be split into two parts in more than one way, and the parts always add back up to the whole.",
          skills: [
            {
              code: "g1ch2.make9",
              title: "Make 9",
              description: "Find the missing part of a number bond when the whole is 9.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch2.make8"],
              questions: [
                { code: "g1ch2.make9.q1", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [9], framing: "bond" }, difficulty: 1 },
                { code: "g1ch2.make9.q2", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [9], framing: "bond" }, difficulty: 2 },
                { code: "g1ch2.make9.q3", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [9], framing: "more" }, difficulty: 2 },
                { code: "g1ch2.make9.q4", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [9], framing: "more" }, difficulty: 3 },
                { code: "g1ch2.make9.q5", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [9] }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch2-l5",
      title: "Make 10 — Part 1",
      type: "STANDARD",
      objective: "Break 10 into two parts in every possible way, and find a missing part given the whole and one part.",
      missionBriefing: "10 frogs are hopping around the pond — some on the lily pad, some on the log. Making 10 is the most important number bond of all, so take your time!",
      workedExample: {
        problem: "10 frogs are hopping. 6 are on the lily pad and 4 are on the log.",
        steps: [
          { text: "The whole group of frogs is 10." },
          { text: "One part is on the lily pad: 6 frogs.", visual: { view: "numberBond", data: { whole: 10, part1: 6, part2: 4 } } },
          { text: "The other part is on the log: 4 frogs." },
        ],
        answer: "10 is 6 and 4.",
        answerVisual: { view: "numberBond", data: { whole: 10, part1: 6, part2: 4 } },
      },
      concepts: [
        {
          title: "Breaking Apart 10",
          bigIdea: "Knowing all the ways to make 10 is the single most useful number fact in math — it's the key to adding and subtracting bigger numbers later.",
          skills: [
            {
              code: "g1ch2.make10a",
              title: "Make 10 — Part 1",
              description: "Find the missing part of a number bond when the whole is 10.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch2.make9"],
              questions: [
                { code: "g1ch2.make10a.q1", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [10], framing: "bond" }, difficulty: 1 },
                { code: "g1ch2.make10a.q2", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [10], framing: "bond" }, difficulty: 2 },
                { code: "g1ch2.make10a.q3", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [10], framing: "more" }, difficulty: 2 },
                { code: "g1ch2.make10a.q4", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [10], framing: "more" }, difficulty: 3 },
                { code: "g1ch2.make10a.q5", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [10] }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch2-l6",
      title: "Make 10 — Part 2",
      type: "STANDARD",
      objective: "Recognize and recite every pair that makes 10, from 0+10 up to 10+0 — fast, automatic recall.",
      missionBriefing: "Line up every single pair of numbers that makes 10, from smallest to biggest. Can you spot the pattern?",
      workedExample: {
        problem: "What are all the ways to make 10 with two parts?",
        steps: [
          { text: "Start with one part as 0: 0 and 10 make 10." },
          { text: "Now try 1: 1 and 9 make 10.", visual: { view: "numberBond", data: { whole: 10, part1: 1, part2: 9 } } },
          { text: "Keep going — as one part goes up by 1, the other part goes down by 1: 2 and 8, 3 and 7, 4 and 6, 5 and 5, and so on." },
          { text: "Every pair always adds up to 10, all the way to 10 and 0." },
        ],
        answer: "0+10, 1+9, 2+8, 3+7, 4+6, 5+5, 6+4, 7+3, 8+2, 9+1, 10+0 — all make 10.",
        answerVisual: { view: "numberBond", data: { whole: 10, part1: 5, part2: 5 } },
      },
      concepts: [
        {
          title: "Every Way to Make 10",
          bigIdea: "As one part grows by 1, the other part shrinks by 1 — the pairs that make 10 follow a steady, predictable pattern.",
          skills: [
            {
              code: "g1ch2.make10b",
              title: "Make 10 — Part 2",
              description: "Quickly recall any missing part of 10, including the pairs with 0.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch2.make10a"],
              questions: [
                { code: "g1ch2.make10b.q1", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [10], framing: "bond" }, difficulty: 2 },
                { code: "g1ch2.make10b.q2", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "g1.numberbond.missing", params: { wholes: [10], framing: "more" }, difficulty: 3 },
                { code: "g1ch2.make10b.q3", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "g1.numberbond.missing", params: { wholes: [10], framing: "more" }, difficulty: 4 },
                { code: "g1ch2.make10b.q4", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "g1.numberbond.missing", params: { wholes: [10], framing: "bond" }, difficulty: 4 },
                { code: "g1ch2.make10b.q5", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "g1.numberbond.missing", params: { wholes: [10] }, difficulty: 5 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch2-l7",
      title: "Practice",
      type: "PRACTICE",
      objective: "Mixed practice finding missing number-bond parts for wholes from 6 to 10.",
      missionBriefing: "Show off everything you've learned about number bonds in the Treetop Grove!",
      workedExample: {
        problem: "Quick recap: what's the one big idea behind every number bond?",
        steps: [
          { text: "A whole can always be split into two parts.", visual: { view: "numberBond", data: { whole: 8, part1: 5, part2: 3 } } },
          { text: "If you know the whole and one part, you can always find the missing part." },
          { text: "Knowing all the ways to make 10 helps with everything that comes next!" },
        ],
        answer: "Parts always add back up to the whole — that's the big idea of number bonds.",
      },
      concepts: [
        {
          title: "Mixed Review",
          bigIdea: "Bringing together number bonds for every whole from 6 to 10.",
          skills: [
            {
              code: "g1ch2.practice",
              title: "Chapter 2 mixed practice",
              description: "Mixed practice finding missing parts for wholes 6-10.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch2.make6", "g1ch2.make7", "g1ch2.make8", "g1ch2.make9", "g1ch2.make10a", "g1ch2.make10b"],
              questions: [
                { code: "g1ch2.practice.q1", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [6, 7], framing: "bond" }, difficulty: 2 },
                { code: "g1ch2.practice.q2", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [7, 8], framing: "more" }, difficulty: 2 },
                { code: "g1ch2.practice.q3", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [8, 9] }, difficulty: 3 },
                { code: "g1ch2.practice.q4", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [9, 10] }, difficulty: 3 },
                { code: "g1ch2.practice.q5", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "g1.numberbond.missing", params: { wholes: [10] }, difficulty: 4 },
                { code: "g1ch2.practice.q6", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "g1.numberbond.missing", params: { wholes: [6, 7, 8, 9, 10] }, difficulty: 3 },
                { code: "g1ch2.practice.q7", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "g1.numberbond.missing", params: { wholes: [6, 7, 8, 9, 10] }, difficulty: 4 },
                { code: "g1ch2.practice.q8", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "g1.numberbond.missing", params: { wholes: [6, 7, 8, 9, 10] }, difficulty: 5 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
