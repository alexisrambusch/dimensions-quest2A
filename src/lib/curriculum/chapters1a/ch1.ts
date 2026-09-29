import type { ChapterDef } from "../types";

export const g1ch1: ChapterDef = {
  code: "g1ch1",
  title: "Numbers to 10",
  description: "Count, order, and compare numbers from 0 to 10 — the very first building block of Dimensions Math.",
  worldName: "Counting Meadow",
  worldTheme: "meadow",
  lessons: [
    {
      code: "g1ch1-l1",
      title: "Numbers to 10",
      type: "STANDARD",
      objective: "Count a group of up to 10 objects and match the count to its numeral.",
      missionBriefing: "Welcome to the Counting Meadow! Count the twinkling stars and friendly critters you find here, one at a time.",
      workedExample: {
        problem: "How many stars are twinkling over the meadow?",
        steps: [
          {
            text: "Point to each star and count it just one time.",
            visual: { view: "equalGroups", data: { groups: 1, perGroup: 6, itemIcon: "star" } },
          },
          { text: "1, 2, 3, 4, 5, 6 — that's every star counted." },
        ],
        answer: "There are 6 stars.",
        answerVisual: { view: "equalGroups", data: { groups: 1, perGroup: 6, itemIcon: "star" } },
      },
      concepts: [
        {
          title: "Counting to 10",
          bigIdea: "Counting each object exactly once tells us how many there are in total.",
          skills: [
            {
              code: "g1ch1.count",
              title: "Count objects to 10",
              description: "Count a group of up to ten pictured objects and name the total.",
              stage: "CONCRETE",
              prerequisites: [],
              questions: [
                { code: "g1ch1.count.q1", kind: "FILL_IN_BLANK", stage: "CONCRETE", generatorId: "g1.count.objects", params: {}, difficulty: 1 },
                { code: "g1ch1.count.q2", kind: "FILL_IN_BLANK", stage: "CONCRETE", generatorId: "g1.count.objects", params: {}, difficulty: 2 },
                { code: "g1ch1.count.q3", kind: "FILL_IN_BLANK", stage: "CONCRETE", generatorId: "g1.count.objects", params: {}, difficulty: 3 },
                { code: "g1ch1.count.q4", kind: "FILL_IN_BLANK", stage: "CONCRETE", generatorId: "g1.count.objects", params: {}, difficulty: 4 },
                { code: "g1ch1.count.q5", kind: "FILL_IN_BLANK", stage: "CONCRETE", generatorId: "g1.count.objects", params: {}, difficulty: 5 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch1-l2",
      title: "The Number 0",
      type: "STANDARD",
      objective: "Understand that 0 means none, and count back from 10 to 0.",
      missionBriefing: "Some baskets in the meadow are empty! Learn what 0 means, then count backward from 10 to 0 like a rocket countdown.",
      workedExample: {
        problem: "How many apples are in the empty basket?",
        steps: [
          {
            text: "Look closely inside the basket — are there any apples at all?",
            visual: { view: "equalGroups", data: { groups: 1, perGroup: 0, itemIcon: "apple" } },
          },
          { text: "There isn't a single apple. When there's nothing at all, we write the number 0." },
        ],
        answer: "There are 0 apples.",
        answerVisual: { view: "equalGroups", data: { groups: 1, perGroup: 0, itemIcon: "apple" } },
      },
      concepts: [
        {
          title: "Zero Means None",
          bigIdea: "0 is a real number — it tells us a group has nothing in it.",
          skills: [
            {
              code: "g1ch1.zero.count",
              title: "Count including zero",
              description: "Recognize that an empty group has 0 objects, alongside counting small groups.",
              stage: "CONCRETE",
              prerequisites: ["g1ch1.count"],
              questions: [
                { code: "g1ch1.zero.count.q1", kind: "FILL_IN_BLANK", stage: "CONCRETE", generatorId: "g1.count.objects", params: { allowZero: true, minCount: 0, maxCount: 4 }, difficulty: 1 },
                { code: "g1ch1.zero.count.q2", kind: "FILL_IN_BLANK", stage: "CONCRETE", generatorId: "g1.count.objects", params: { allowZero: true, minCount: 0, maxCount: 4 }, difficulty: 2 },
                { code: "g1ch1.zero.count.q3", kind: "FILL_IN_BLANK", stage: "CONCRETE", generatorId: "g1.count.objects", params: { allowZero: true, minCount: 0, maxCount: 4 }, difficulty: 1 },
                { code: "g1ch1.zero.count.q4", kind: "FILL_IN_BLANK", stage: "CONCRETE", generatorId: "g1.count.objects", params: { allowZero: true, minCount: 0, maxCount: 4 }, difficulty: 3 },
                { code: "g1ch1.zero.count.q5", kind: "FILL_IN_BLANK", stage: "CONCRETE", generatorId: "g1.count.objects", params: { allowZero: true, minCount: 0, maxCount: 4 }, difficulty: 2 },
              ],
            },
          ],
        },
        {
          title: "Counting Back",
          bigIdea: "Counting backward is just counting forward in reverse — each step is one less.",
          skills: [
            {
              code: "g1ch1.zero.countback",
              title: "Count back from 10 to 0",
              description: "Count backward by ones from 10 down to 0, and forward from 0 up to 10.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch1.zero.count"],
              questions: [
                { code: "g1ch1.zero.countback.q1", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.count.sequence", params: { direction: "backward" }, difficulty: 1 },
                { code: "g1ch1.zero.countback.q2", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.count.sequence", params: { direction: "backward" }, difficulty: 2 },
                { code: "g1ch1.zero.countback.q3", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.count.sequence", params: { direction: "backward" }, difficulty: 3 },
                { code: "g1ch1.zero.countback.q4", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.count.sequence", params: { direction: "forward" }, difficulty: 2 },
                { code: "g1ch1.zero.countback.q5", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.count.sequence", params: { direction: "forward" }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch1-l3",
      title: "Order Numbers",
      type: "STANDARD",
      objective: "Arrange numbers 0-10 from least to greatest or greatest to least, and find a missing number in a sequence.",
      missionBriefing: "Line up the number stones along the meadow path — sometimes counting up, sometimes counting down!",
      workedExample: {
        problem: "Put these number stones in order from least to greatest: 7, 2, 9.",
        steps: [
          { text: "Compare the numbers to find the smallest one first.", visual: { view: "compareNumbers", data: { a: 2, b: 7, symbol: "<" } } },
          { text: "2 is less than both 7 and 9, so 2 goes first." },
          { text: "Now compare what's left: 7 is less than 9.", visual: { view: "compareNumbers", data: { a: 7, b: 9, symbol: "<" } } },
          { text: "Putting it all together, the order is 2, then 7, then 9.", visual: { view: "sortedNumbers", data: { values: [2, 7, 9] } } },
        ],
        answer: "2, 7, 9 (least to greatest)",
        answerVisual: { view: "sortedNumbers", data: { values: [2, 7, 9] } },
      },
      concepts: [
        {
          title: "Ordering a Set of Numbers",
          bigIdea: "Numbers can be lined up in order once we compare them two at a time.",
          skills: [
            {
              code: "g1ch1.order",
              title: "Order numbers to 10",
              description: "Arrange 3 numbers from 0-10 from least to greatest, or greatest to least.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch1.count"],
              questions: [
                { code: "g1ch1.order.q1", kind: "SORT_ORDER", stage: "ABSTRACT", generatorId: "order.numbers", params: { min: 0, max: 10, count: 3 }, difficulty: 1 },
                { code: "g1ch1.order.q2", kind: "SORT_ORDER", stage: "ABSTRACT", generatorId: "order.numbers", params: { min: 0, max: 10, count: 3 }, difficulty: 2 },
                { code: "g1ch1.order.q3", kind: "SORT_ORDER", stage: "ABSTRACT", generatorId: "order.numbers", params: { min: 0, max: 10, count: 3, direction: "desc" }, difficulty: 2 },
                { code: "g1ch1.order.q4", kind: "SORT_ORDER", stage: "ABSTRACT", generatorId: "order.numbers", params: { min: 0, max: 10, count: 4, direction: "desc" }, difficulty: 3 },
                { code: "g1ch1.order.q5", kind: "SORT_ORDER", stage: "ABSTRACT", generatorId: "order.numbers", params: { min: 0, max: 10, count: 4 }, difficulty: 3 },
              ],
            },
          ],
        },
        {
          title: "Missing Numbers",
          bigIdea: "A counting sequence follows a steady pattern, so a missing number can be figured out from its neighbors.",
          skills: [
            {
              code: "g1ch1.order.missing",
              title: "Fill in the missing number",
              description: "Find the missing number in a short counting sequence to 10.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch1.order"],
              questions: [
                { code: "g1ch1.order.missing.q1", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.count.sequence", params: { direction: "forward" }, difficulty: 1 },
                { code: "g1ch1.order.missing.q2", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.count.sequence", params: { direction: "forward" }, difficulty: 2 },
                { code: "g1ch1.order.missing.q3", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.count.sequence", params: { direction: "backward" }, difficulty: 2 },
                { code: "g1ch1.order.missing.q4", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.count.sequence", params: { direction: "backward" }, difficulty: 3 },
                { code: "g1ch1.order.missing.q5", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.count.sequence", params: {}, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch1-l4",
      title: "Compare Numbers",
      type: "STANDARD",
      objective: "Compare two numbers to 10 using more, fewer, and the symbols <, >, =.",
      missionBriefing: "Two meadow critters picked baskets of berries. Help them see whose basket has more!",
      workedExample: {
        problem: "Which basket has more strawberries: 5 or 3?",
        steps: [
          { text: "Look at both groups of strawberries.", visual: { view: "compareGroups", data: { countA: 5, countB: 3, itemIcon: "strawberry" } } },
          { text: "5 is more than 3, so the first basket has more.", visual: { view: "compareNumbers", data: { a: 5, b: 3, symbol: ">" } } },
        ],
        answer: "5 > 3",
        answerVisual: { view: "compareNumbers", data: { a: 5, b: 3, symbol: ">" } },
      },
      concepts: [
        {
          title: "More, Fewer, and Equal",
          bigIdea: "Comparing numbers means figuring out which group has more, which has fewer, or whether they're equal.",
          skills: [
            {
              code: "g1ch1.compare",
              title: "Compare numbers to 10",
              description: "Use <, >, and = to compare two numbers from 0-10, shown as numerals or as pictured groups.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch1.count"],
              questions: [
                { code: "g1ch1.compare.q1", kind: "MULTIPLE_CHOICE", stage: "PICTORIAL", generatorId: "compare.numbers", params: { min: 0, max: 10 }, difficulty: 1 },
                { code: "g1ch1.compare.q2", kind: "MULTIPLE_CHOICE", stage: "PICTORIAL", generatorId: "compare.numbers", params: { min: 0, max: 10 }, difficulty: 2 },
                { code: "g1ch1.compare.q3", kind: "MULTIPLE_CHOICE", stage: "PICTORIAL", generatorId: "g1.compare.groups", params: {}, difficulty: 2 },
                { code: "g1ch1.compare.q4", kind: "MULTIPLE_CHOICE", stage: "PICTORIAL", generatorId: "g1.compare.groups", params: {}, difficulty: 3 },
                { code: "g1ch1.compare.q5", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "compare.numbers", params: { min: 0, max: 10 }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch1-l5",
      title: "Practice",
      type: "PRACTICE",
      objective: "Mixed practice across counting, ordering, and comparing numbers to 10.",
      missionBriefing: "Show off everything you've learned in the Counting Meadow!",
      workedExample: {
        problem: "Quick recap: what's the one big idea behind every skill in the Counting Meadow?",
        steps: [
          { text: "Counting a group? Point to each object and say one number for each, only once.", visual: { view: "equalGroups", data: { groups: 1, perGroup: 6, itemIcon: "star" } } },
          { text: "Ordering numbers? Compare them two at a time until they're all lined up.", visual: { view: "sortedNumbers", data: { values: [2, 7, 9] } } },
          { text: "Comparing numbers? Decide which group has more, fewer, or if they're equal.", visual: { view: "compareNumbers", data: { a: 5, b: 3, symbol: ">" } } },
        ],
        answer: "Counting carefully is the foundation for everything else in this chapter!",
      },
      concepts: [
        {
          title: "Mixed Review",
          bigIdea: "Bringing together counting, ordering, and comparing numbers to 10.",
          skills: [
            {
              code: "g1ch1.practice",
              title: "Chapter 1 mixed practice",
              description: "Mixed practice across all Chapter 1 skills.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch1.count", "g1ch1.order", "g1ch1.compare", "g1ch1.zero.count"],
              questions: [
                { code: "g1ch1.practice.q1", kind: "FILL_IN_BLANK", stage: "CONCRETE", generatorId: "g1.count.objects", params: {}, difficulty: 2 },
                { code: "g1ch1.practice.q2", kind: "FILL_IN_BLANK", stage: "CONCRETE", generatorId: "g1.count.objects", params: { allowZero: true, minCount: 0, maxCount: 4 }, difficulty: 1 },
                { code: "g1ch1.practice.q3", kind: "SORT_ORDER", stage: "ABSTRACT", generatorId: "order.numbers", params: { min: 0, max: 10, count: 3 }, difficulty: 2 },
                { code: "g1ch1.practice.q4", kind: "SORT_ORDER", stage: "ABSTRACT", generatorId: "order.numbers", params: { min: 0, max: 10, count: 3, direction: "desc" }, difficulty: 3 },
                { code: "g1ch1.practice.q5", kind: "MULTIPLE_CHOICE", stage: "PICTORIAL", generatorId: "compare.numbers", params: { min: 0, max: 10 }, difficulty: 2 },
                { code: "g1ch1.practice.q6", kind: "MULTIPLE_CHOICE", stage: "PICTORIAL", generatorId: "g1.compare.groups", params: {}, difficulty: 3 },
                { code: "g1ch1.practice.q7", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.count.sequence", params: {}, difficulty: 3 },
                { code: "g1ch1.practice.q8", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.count.sequence", params: { direction: "backward" }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
