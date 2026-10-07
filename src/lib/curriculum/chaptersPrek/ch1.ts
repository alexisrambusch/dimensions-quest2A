import type { ChapterDef } from "../types";

export const pkch1: ChapterDef = {
  code: "pkch1",
  title: "Counting to 10",
  description: "Count a small group of dots, match it to the matching written number, and tell which of two groups has more or fewer.",
  worldName: "Toy Box Town",
  worldTheme: "toybox",
  lessons: [
    {
      code: "pkch1-l1",
      title: "Counting to 5",
      type: "STANDARD",
      objective: "Count a group of up to 5 dots and tap the number that matches.",
      missionBriefing: "Welcome to Toy Box Town! Count the dots you find on each ten-frame, then tap the number that matches.",
      workedExample: {
        problem: "How many dots are on the ten-frame?",
        steps: [
          { text: "Point to each red dot and count it one time.", visual: { view: "tenFrame", data: { count: 3 } } },
          { text: "1, 2, 3 — that's every dot counted!" },
        ],
        answer: "There are 3 dots, so the answer is 3.",
        answerVisual: { view: "tenFrame", data: { count: 3 } },
      },
      concepts: [
        {
          title: "Counting Small Groups",
          bigIdea: "Counting each dot exactly once, in order, tells us how many there are.",
          skills: [
            {
              code: "pkch1.count15",
              title: "Count and match 1 to 5",
              description: "Count a group of up to 5 dots and tap the numeral that matches.",
              stage: "CONCRETE",
              prerequisites: [],
              questions: [
                { code: "pkch1.count15.q1", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.numeral.match", params: { min: 1, max: 5 }, difficulty: 1 },
                { code: "pkch1.count15.q2", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.numeral.match", params: { min: 1, max: 5 }, difficulty: 1 },
                { code: "pkch1.count15.q3", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.numeral.match", params: { min: 1, max: 5 }, difficulty: 1 },
                { code: "pkch1.count15.q4", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.numeral.match", params: { min: 1, max: 5 }, difficulty: 1 },
                { code: "pkch1.count15.q5", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.numeral.match", params: { min: 1, max: 5 }, difficulty: 1 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "pkch1-l2",
      title: "Counting 6 to 10",
      type: "STANDARD",
      objective: "Count a group of up to 10 dots and tap the number that matches.",
      missionBriefing: "More toys to count! This time the ten-frames can fill all the way up — keep counting past 5.",
      workedExample: {
        problem: "How many dots are on the ten-frame?",
        steps: [
          { text: "The top row is full — that's 5. Keep counting into the second row.", visual: { view: "tenFrame", data: { count: 8 } } },
          { text: "5, 6, 7, 8 — that's every dot counted!" },
        ],
        answer: "There are 8 dots, so the answer is 8.",
        answerVisual: { view: "tenFrame", data: { count: 8 } },
      },
      concepts: [
        {
          title: "Counting Past 5",
          bigIdea: "After filling the top row of 5, keep counting one more into the next row.",
          skills: [
            {
              code: "pkch1.count610",
              title: "Count and match 6 to 10",
              description: "Count a group of 6-10 dots and tap the numeral that matches.",
              stage: "CONCRETE",
              prerequisites: ["pkch1.count15"],
              questions: [
                { code: "pkch1.count610.q1", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.numeral.match", params: { min: 6, max: 10 }, difficulty: 1 },
                { code: "pkch1.count610.q2", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.numeral.match", params: { min: 6, max: 10 }, difficulty: 1 },
                { code: "pkch1.count610.q3", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.numeral.match", params: { min: 6, max: 10 }, difficulty: 1 },
                { code: "pkch1.count610.q4", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.numeral.match", params: { min: 6, max: 10 }, difficulty: 1 },
                { code: "pkch1.count610.q5", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.numeral.match", params: { min: 6, max: 10 }, difficulty: 1 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "pkch1-l3",
      title: "More or Fewer",
      type: "STANDARD",
      objective: "Compare two groups of up to 10 dots and tap the group with more, or the group with fewer.",
      missionBriefing: "Two toy boxes, two groups of dots — which box has more? Which has fewer? Tap the one the question asks for.",
      workedExample: {
        problem: "Which group has more dots?",
        steps: [
          { text: "Look at both groups of dots.", visual: { view: "quantityCompare", data: { countA: 2, countB: 5 } } },
          { text: "The first group has 2 and the second has 5. 5 is more, so the second group wins.", visual: { view: "quantityCompare", data: { countA: 2, countB: 5, highlight: "B" } } },
        ],
        answer: "The second group has more.",
        answerVisual: { view: "quantityCompare", data: { countA: 2, countB: 5, highlight: "B" } },
      },
      concepts: [
        {
          title: "Comparing Two Groups",
          bigIdea: "To compare two groups, count each one, then decide which count is bigger or smaller.",
          skills: [
            {
              code: "pkch1.compare",
              title: "Compare two groups to 10",
              description: "Tap the group with more, or the group with fewer, when shown two groups of 1-10 dots.",
              stage: "CONCRETE",
              prerequisites: ["pkch1.count610"],
              questions: [
                { code: "pkch1.compare.q1", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.compare.quantities", params: { min: 1, max: 5, askFor: "more" }, difficulty: 1 },
                { code: "pkch1.compare.q2", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.compare.quantities", params: { min: 1, max: 5, askFor: "fewer" }, difficulty: 1 },
                { code: "pkch1.compare.q3", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.compare.quantities", params: { min: 1, max: 10, askFor: "more" }, difficulty: 1 },
                { code: "pkch1.compare.q4", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.compare.quantities", params: { min: 1, max: 10, askFor: "fewer" }, difficulty: 1 },
                { code: "pkch1.compare.q5", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.compare.quantities", params: { min: 1, max: 10 }, difficulty: 1 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "pkch1-l4",
      title: "Practice",
      type: "PRACTICE",
      objective: "Mixed practice counting, matching numbers, and comparing groups to 10.",
      missionBriefing: "Show off everything you learned in Toy Box Town!",
      workedExample: {
        problem: "Quick recap: what do we do every time we see a group of dots?",
        steps: [
          { text: "Count each dot one time, in order.", visual: { view: "tenFrame", data: { count: 7 } } },
          { text: "Then match the count to its number, or compare it to another group.", visual: { view: "quantityCompare", data: { countA: 7, countB: 4, highlight: "A" } } },
        ],
        answer: "Careful counting is the foundation for everything in Toy Box Town!",
      },
      concepts: [
        {
          title: "Mixed Review",
          bigIdea: "Bringing together counting, number matching, and comparing to 10.",
          skills: [
            {
              code: "pkch1.practice",
              title: "Chapter 1 mixed practice",
              description: "Mixed practice across all Toy Box Town skills.",
              stage: "CONCRETE",
              prerequisites: ["pkch1.count15", "pkch1.count610", "pkch1.compare"],
              questions: [
                { code: "pkch1.practice.q1", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.numeral.match", params: { min: 1, max: 5 }, difficulty: 1 },
                { code: "pkch1.practice.q2", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.numeral.match", params: { min: 6, max: 10 }, difficulty: 1 },
                { code: "pkch1.practice.q3", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.numeral.match", params: { min: 1, max: 10 }, difficulty: 1 },
                { code: "pkch1.practice.q4", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.compare.quantities", params: { min: 1, max: 10, askFor: "more" }, difficulty: 1 },
                { code: "pkch1.practice.q5", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.compare.quantities", params: { min: 1, max: 10, askFor: "fewer" }, difficulty: 1 },
                { code: "pkch1.practice.q6", kind: "MULTIPLE_CHOICE", stage: "CONCRETE", generatorId: "prek.numeral.match", params: { min: 1, max: 10 }, difficulty: 1 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
