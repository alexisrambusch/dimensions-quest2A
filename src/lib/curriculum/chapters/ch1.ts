import type { ChapterDef } from "../types";

export const ch1: ChapterDef = {
  code: "ch1",
  title: "Numbers to 1,000",
  description:
    "Understand, represent, compare, and order numbers to 1,000 using place value: hundreds, tens, and ones.",
  worldName: "Number Kingdom",
  worldTheme: "castle",
  lessons: [
    {
      code: "ch1-l1",
      title: "Counting and Building Numbers",
      type: "STANDARD",
      objective: "Count and represent numbers to 1,000 using base-ten blocks.",
      missionBriefing: "The Number Kingdom needs a builder! Use hundreds, tens, and ones blocks to build any number the King asks for.",
      concepts: [
        {
          title: "Building Numbers with Blocks",
          bigIdea: "Any number to 1,000 can be built from hundreds, tens, and ones blocks.",
          skills: [
            {
              code: "ch1.placevalue.build",
              title: "Build numbers with place-value blocks",
              description: "Represent a 2- or 3-digit number using hundreds, tens, and ones blocks, then name the number.",
              stage: "CONCRETE",
              prerequisites: [],
              questions: [
                { code: "ch1.placevalue.build.q1", kind: "BUILD_MODEL", stage: "CONCRETE", generatorId: "placevalue.build", params: {}, difficulty: 1 },
                { code: "ch1.placevalue.build.q2", kind: "BUILD_MODEL", stage: "CONCRETE", generatorId: "placevalue.build", params: {}, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch1-l2",
      title: "Hundreds, Tens, and Ones",
      type: "STANDARD",
      objective: "Decompose numbers into hundreds, tens, and ones and understand place value.",
      missionBriefing: "The King's scribes need help splitting numbers into their hundreds, tens, and ones so the royal ledger stays organized.",
      concepts: [
        {
          title: "Place Value Decomposition",
          bigIdea: "The same digit means something different depending on its place.",
          skills: [
            {
              code: "ch1.placevalue.decompose",
              title: "Decompose numbers into hundreds, tens, ones",
              description: "Write a number as a sum of hundreds, tens, and ones.",
              stage: "PICTORIAL",
              prerequisites: ["ch1.placevalue.build"],
              questions: [
                { code: "ch1.placevalue.decompose.q1", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "placevalue.decompose", params: {}, difficulty: 2 },
                { code: "ch1.placevalue.decompose.q2", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "placevalue.decompose", params: {}, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch1-l3",
      title: "Comparing Numbers",
      type: "STANDARD",
      objective: "Compare two numbers to 1,000 using <, >, and =.",
      missionBriefing: "Two royal treasure chests are full of coins. Help the guards figure out which has more!",
      concepts: [
        {
          title: "Greater Than, Less Than, Equal To",
          bigIdea: "Comparing numbers means comparing their place values, starting from the hundreds.",
          skills: [
            {
              code: "ch1.compare",
              title: "Compare numbers to 1,000",
              description: "Use <, >, and = to compare two numbers.",
              stage: "PICTORIAL",
              prerequisites: ["ch1.placevalue.build"],
              questions: [
                { code: "ch1.compare.q1", kind: "MULTIPLE_CHOICE", stage: "PICTORIAL", generatorId: "compare.numbers", params: {}, difficulty: 2 },
                { code: "ch1.compare.q2", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "compare.numbers", params: {}, difficulty: 4 },
              ],
            },
          ],
        },
        {
          title: "Where Numbers Live",
          bigIdea: "A number line shows where a number sits compared to its neighbors — a spatial sense of size.",
          skills: [
            {
              code: "ch1.numberline",
              title: "Place numbers on a number line",
              description: "Locate a given number's position on a number line.",
              stage: "PICTORIAL",
              prerequisites: ["ch1.compare"],
              questions: [
                { code: "ch1.numberline.q1", kind: "NUMBER_LINE", stage: "PICTORIAL", generatorId: "numberline.place", params: {}, difficulty: 1 },
                { code: "ch1.numberline.q2", kind: "NUMBER_LINE", stage: "PICTORIAL", generatorId: "numberline.place", params: {}, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch1-l4",
      title: "Ordering Numbers",
      type: "STANDARD",
      objective: "Order a set of numbers to 1,000 from least to greatest.",
      missionBriefing: "The royal parade needs to line up by height... of their numbers! Put them in order.",
      concepts: [
        {
          title: "Ordering a Set of Numbers",
          bigIdea: "Numbers can be arranged in order once we compare them pairwise.",
          skills: [
            {
              code: "ch1.order",
              title: "Order numbers to 1,000",
              description: "Arrange 3-4 numbers from least to greatest.",
              stage: "ABSTRACT",
              prerequisites: ["ch1.compare"],
              questions: [
                { code: "ch1.order.q1", kind: "SORT_ORDER", stage: "ABSTRACT", generatorId: "order.numbers", params: {}, difficulty: 2 },
                { code: "ch1.order.q2", kind: "SORT_ORDER", stage: "ABSTRACT", generatorId: "order.numbers", params: {}, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch1-l5",
      title: "Number Patterns",
      type: "STANDARD",
      objective: "Recognize and extend patterns in the number system (skip-counting by 10s and 100s).",
      missionBriefing: "The kingdom's number path has some stones missing. Figure out the pattern to fill them in!",
      concepts: [
        {
          title: "Skip-Counting Patterns",
          bigIdea: "Numbers follow predictable patterns when you count by 10s or 100s.",
          skills: [
            {
              code: "ch1.patterns",
              title: "Recognize number patterns",
              description: "Find the missing number in a skip-counting sequence by 10s or 100s.",
              stage: "PICTORIAL",
              prerequisites: ["ch1.placevalue.build"],
              questions: [
                { code: "ch1.patterns.q1", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "pattern.skipcount", params: { step: 10 }, difficulty: 2 },
                { code: "ch1.patterns.q2", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "pattern.skipcount", params: { step: 100 }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch1-review",
      title: "Chapter Review: Number Kingdom",
      type: "REVIEW",
      objective: "Review building, comparing, ordering, and finding patterns in numbers to 1,000.",
      missionBriefing: "Show everything you've learned in the Number Kingdom before we move on!",
      concepts: [
        {
          title: "Mixed Review",
          bigIdea: "Bringing together place value, comparison, ordering, and patterns.",
          skills: [
            {
              code: "ch1.review",
              title: "Chapter 1 mixed review",
              description: "Mixed practice across all Chapter 1 skills.",
              stage: "ABSTRACT",
              prerequisites: ["ch1.compare", "ch1.order", "ch1.patterns", "ch1.numberline"],
              questions: [
                { code: "ch1.review.q1", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "compare.numbers", params: {}, difficulty: 3 },
                { code: "ch1.review.q2", kind: "SORT_ORDER", stage: "ABSTRACT", generatorId: "order.numbers", params: {}, difficulty: 3 },
                { code: "ch1.review.q3", kind: "BUILD_MODEL", stage: "CONCRETE", generatorId: "placevalue.build", params: {}, difficulty: 3 },
                { code: "ch1.review.q4", kind: "NUMBER_LINE", stage: "PICTORIAL", generatorId: "numberline.place", params: {}, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
