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
      workedExample: {
        problem: "The King asks for the number 347. Let's build it with blocks.",
        steps: [
          "347 has 3 digits, and each digit lives in its own place: hundreds, tens, and ones.",
          "The first digit is 3, and it's in the hundreds place — so grab 3 hundred-blocks.",
          "The next digit is 4, in the tens place — grab 4 ten-rods.",
          "The last digit is 7, in the ones place — grab 7 one-cubes.",
          "Put them all together: 3 hundreds + 4 tens + 7 ones makes 347.",
        ],
        answer: "347 = 3 hundreds, 4 tens, 7 ones.",
      },
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
      workedExample: {
        problem: "Write 582 as a sum of hundreds, tens, and ones.",
        steps: [
          "Look at each digit and name its place: 5 is hundreds, 8 is tens, 2 is ones.",
          "The 5 stands for 5 hundreds, which is worth 500.",
          "The 8 stands for 8 tens, which is worth 80.",
          "The 2 stands for 2 ones, which is worth 2.",
          "Add them back up to check your work: 500 + 80 + 2 = 582. ✓",
        ],
        answer: "582 = 500 + 80 + 2",
      },
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
      workedExample: {
        problem: "Chest A holds 428 coins. Chest B holds 419 coins. Which chest has more?",
        steps: [
          "Line up both numbers by place value: hundreds, tens, ones.",
          "Compare the hundreds first: both have 4 hundreds — that's a tie, so keep looking.",
          "Compare the tens next: 428 has 2 tens, but 419 has only 1 ten. 2 tens beats 1 ten!",
          "Since the tens place already decided it, you don't even need to check the ones.",
          "428 is greater than 419, so Chest A has more coins.",
        ],
        answer: "428 > 419 — Chest A wins.",
      },
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
      workedExample: {
        problem: "Line up these parade floats from least to greatest: 612, 589, 601.",
        steps: [
          "Compare the numbers two at a time, starting with the hundreds place.",
          "589 has 5 hundreds, while 612 and 601 both have 6 hundreds — so 589 is the smallest, right away.",
          "Now compare 612 and 601: both have 6 hundreds, but 612 has 1 ten and 601 has 0 tens.",
          "0 tens is less than 1 ten, so 601 comes before 612.",
          "Putting it all together: 589, then 601, then 612.",
        ],
        answer: "589, 601, 612 (least to greatest)",
      },
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
      workedExample: {
        problem: "The path reads 320, 330, 340, 350, ___. What's the next stone?",
        steps: [
          "Look at how much each number grows compared to the one right before it.",
          "330 − 320 = 10, and 340 − 330 = 10, and 350 − 340 = 10 — it grows by 10 every single time.",
          "So the rule for this path is 'add 10 each time.'",
          "Apply the rule to the last number: 350 + 10 = 360.",
        ],
        answer: "The next stone is 360.",
      },
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
      workedExample: {
        problem: "Quick recap: every skill in the Number Kingdom uses the same core idea. What is it?",
        steps: [
          "Building a number? Break it into hundreds, tens, and ones blocks first.",
          "Comparing two numbers? Check the hundreds digit first, then tens, then ones — stop as soon as one is bigger.",
          "Ordering a group of numbers? Compare them two at a time, the same way, until they're all lined up.",
          "Spotting a pattern? Find how much each number changes by, then keep repeating that change.",
        ],
        answer: "Place value is the strategy behind every question in this chapter!",
      },
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
