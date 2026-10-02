import type { ChapterDef } from "../types";

export const g1ch4: ChapterDef = {
  code: "g1ch4",
  title: "Subtraction",
  description: "Subtract within 10 — taking away, taking apart, counting back, and connecting addition and subtraction as opposite moves.",
  worldName: "Lily Pond",
  worldTheme: "pond",
  lessons: [
    {
      code: "g1ch4-l1",
      title: "Subtraction as Taking Away",
      type: "STANDARD",
      objective: "Find how many are left after some are removed from a group.",
      missionBriefing: "8 frogs are resting on a log in the Lily Pond. 5 hop away. How many frogs are still on the log?",
      workedExample: {
        problem: "There were 8 ants on a log. 5 ants left the log. How many ants are still on the log?",
        steps: [
          { text: "Start with the whole group: 8 ants." },
          { text: "5 ants leave — take them away.", visual: { view: "numberBond", data: { whole: 8, part1: 5, part2: 3 } } },
          { text: "8 − 5 = 3." },
        ],
        answer: "There are 3 ants still on the log.",
        answerVisual: { view: "equation", data: { left: 8, op: "-", right: 5, result: 3 } },
      },
      concepts: [
        {
          title: "Taking Away",
          bigIdea: "Subtraction tells you how many are left after some are removed from a group.",
          skills: [
            {
              code: "g1ch4.takeaway",
              title: "Subtraction as taking away",
              description: "Find how many are left after some (within 10) are taken away from a group.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch3.facts"],
              questions: [
                { code: "g1ch4.takeaway.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.basic", params: { max: 10 }, difficulty: 1 },
                { code: "g1ch4.takeaway.q2", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.basic", params: { max: 10 }, difficulty: 2 },
                { code: "g1ch4.takeaway.q3", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.subtraction.wordproblem", params: { max: 10 }, difficulty: 2 },
                { code: "g1ch4.takeaway.q4", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.subtraction.wordproblem", params: { max: 10 }, difficulty: 3 },
                { code: "g1ch4.takeaway.q5", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.basic", params: { max: 10 }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch4-l2",
      title: "Subtraction as Taking Apart",
      type: "STANDARD",
      objective: "Given a whole group and one described part, find the other part by subtracting.",
      missionBriefing: "7 buckets sit by the pond — some pink, some blue. If you know how many are blue, can you figure out how many are pink without counting them again?",
      workedExample: {
        problem: "There are 7 buckets. 3 are blue. How many are pink?",
        steps: [
          { text: "The whole group is 7 buckets." },
          { text: "One part — the blue buckets — is 3.", visual: { view: "numberBond", data: { whole: 7, part1: 3, part2: 4 } } },
          { text: "Subtract the known part from the whole: 7 − 3 = 4." },
        ],
        answer: "There are 4 pink buckets.",
        answerVisual: { view: "equation", data: { left: 7, op: "-", right: 3, result: 4 } },
      },
      concepts: [
        {
          title: "Finding the Other Part",
          bigIdea: "When you know the whole and one part, subtracting gives you the other part.",
          skills: [
            {
              code: "g1ch4.takeapart",
              title: "Subtraction as taking apart",
              description: "Find a missing part of a whole (within 10) by subtracting the known part.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch4.takeaway", "g1ch2.make10a"],
              questions: [
                { code: "g1ch4.takeapart.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.basic", params: { max: 10 }, difficulty: 1 },
                { code: "g1ch4.takeapart.q2", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.basic", params: { max: 10 }, difficulty: 2 },
                { code: "g1ch4.takeapart.q3", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.subtraction.wordproblem", params: { max: 10 }, difficulty: 2 },
                { code: "g1ch4.takeapart.q4", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.basic", params: { max: 10 }, difficulty: 3 },
                { code: "g1ch4.takeapart.q5", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.subtraction.wordproblem", params: { max: 10 }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch4-l3",
      title: "Subtraction by Counting Back",
      type: "STANDARD",
      objective: "Subtract a small number (1, 2, or 3) by counting back instead of recounting the whole group.",
      missionBriefing: "8 grapes are on a plate. If 1, 2, or 3 are eaten, can you count back instead of starting over?",
      workedExample: {
        problem: "There are 8 grapes. 3 are eaten. How many grapes are left?",
        steps: [
          { text: "Start at 8 — don't recount the grapes." },
          { text: "Count back 3: 7, 6, 5." },
          { text: "8 − 3 = 5." },
        ],
        answer: "There are 5 grapes left.",
        answerVisual: { view: "equation", data: { left: 8, op: "-", right: 3, result: 5 } },
      },
      concepts: [
        {
          title: "Counting Back",
          bigIdea: "Instead of recounting what's left from scratch, start at the bigger number and count back by the smaller one.",
          skills: [
            {
              code: "g1ch4.countback",
              title: "Subtraction by counting back",
              description: "Subtract 1, 2, or 3 from a number within 10 by counting back.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch4.takeaway"],
              questions: [
                { code: "g1ch4.countback.q1", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, bMin: 1, bMax: 1 }, difficulty: 1 },
                { code: "g1ch4.countback.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, bMin: 1, bMax: 2 }, difficulty: 2 },
                { code: "g1ch4.countback.q3", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, bMin: 1, bMax: 3 }, difficulty: 3 },
                { code: "g1ch4.countback.q4", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, bMin: 2, bMax: 3 }, difficulty: 3 },
                { code: "g1ch4.countback.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, bMin: 1, bMax: 3 }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch4-l4",
      title: "Subtraction with 0",
      type: "STANDARD",
      objective: "Understand that subtracting 0 leaves a number unchanged, and subtracting all of it leaves 0.",
      missionBriefing: "If 0 pears are eaten, how many are left? If every pear is eaten, how many are left?",
      workedExample: {
        problem: "There are 3 pears. If 0 are eaten, how many are left? If all 3 are eaten, how many are left?",
        steps: [
          { text: "If 0 pears are eaten, nothing changes: 3 − 0 = 3.", visual: { view: "numberBond", data: { whole: 3, part1: 3, part2: 0 } } },
          { text: "If all 3 pears are eaten, none are left: 3 − 3 = 0." },
        ],
        answer: "3 − 0 = 3, and 3 − 3 = 0.",
        answerVisual: { view: "equation", data: { left: 3, op: "-", right: 3, result: 0 } },
      },
      concepts: [
        {
          title: "Subtracting Zero or Everything",
          bigIdea: "Subtracting 0 never changes a number. Subtracting a number from itself always leaves 0.",
          skills: [
            {
              code: "g1ch4.subzero",
              title: "Subtraction with 0",
              description: "Recognize that a − 0 = a, and a − a = 0.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch4.takeaway"],
              questions: [
                { code: "g1ch4.subzero.q1", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, zeroMode: "subtractZero" }, difficulty: 1 },
                { code: "g1ch4.subzero.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, zeroMode: "subtractAll" }, difficulty: 1 },
                { code: "g1ch4.subzero.q3", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, zeroMode: "subtractZero" }, difficulty: 2 },
                { code: "g1ch4.subzero.q4", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, zeroMode: "subtractZero", missing: "b" }, difficulty: 3 },
                { code: "g1ch4.subzero.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, zeroMode: "subtractAll", missing: "a" }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch4-l5",
      title: "Make Subtraction Stories",
      type: "STANDARD",
      objective: "Write and solve an original subtraction story.",
      missionBriefing: "6 pens are in the tray. Some have caps, some don't. Can you turn that into your own subtraction story?",
      workedExample: {
        problem: "There are 6 pens. 2 pens are picked up. How many pens are left in the tray?",
        steps: [
          { text: "Start with the whole group: 6 pens." },
          { text: "Turn it into a story: \"There are 6 pens. 2 are picked up. How many are left?\"" },
          { text: "Solve it: 6 − 2 = 4.", visual: { view: "numberBond", data: { whole: 6, part1: 2, part2: 4 } } },
        ],
        answer: "There are 4 pens left in the tray.",
        answerVisual: { view: "equation", data: { left: 6, op: "-", right: 2, result: 4 } },
      },
      concepts: [
        {
          title: "Telling the Story",
          bigIdea: "Every subtraction equation can be told as a real-life story about a group losing some of its members.",
          skills: [
            {
              code: "g1ch4.stories",
              title: "Make subtraction stories",
              description: "Solve short subtraction word problems within 10.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch4.takeaway", "g1ch4.takeapart"],
              questions: [
                { code: "g1ch4.stories.q1", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.subtraction.wordproblem", params: { max: 10 }, difficulty: 2 },
                { code: "g1ch4.stories.q2", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.subtraction.wordproblem", params: { max: 10 }, difficulty: 2 },
                { code: "g1ch4.stories.q3", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.subtraction.wordproblem", params: { max: 10 }, difficulty: 3 },
                { code: "g1ch4.stories.q4", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.subtraction.wordproblem", params: { max: 10 }, difficulty: 3 },
                { code: "g1ch4.stories.q5", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.subtraction.wordproblem", params: { max: 10 }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch4-l6",
      title: "Subtraction with Number Bonds",
      type: "STANDARD",
      objective: "Use number bonds to find any missing number in a subtraction fact — the whole or either part.",
      missionBriefing: "8 goats live on the hill — some brown, some black. A number bond shows the whole herd and both colors at once.",
      workedExample: {
        problem: "There are 8 goats. 5 are brown. How many are black?",
        steps: [
          { text: "8 is the whole, and 5 is one part.", visual: { view: "numberBond", data: { whole: 8, part1: 5, part2: 3 } } },
          { text: "Subtract the known part from the whole: 8 − 5 = 3." },
          { text: "The number bond also tells you 8 − 3 = 5 — the other subtraction fact from the same three numbers." },
        ],
        answer: "There are 3 black goats.",
        answerVisual: { view: "equation", data: { left: 8, op: "-", right: 5, result: 3 } },
      },
      concepts: [
        {
          title: "Any Missing Part",
          bigIdea: "A number bond holds the whole and both parts at once, so you can find whichever one a subtraction question is missing.",
          skills: [
            {
              code: "g1ch4.bonds",
              title: "Subtraction with number bonds",
              description: "Find any missing number — the result or either operand — in a subtraction fact within 10.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch4.takeapart", "g1ch2.make10a"],
              questions: [
                { code: "g1ch4.bonds.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.basic", params: { max: 10 }, difficulty: 1 },
                { code: "g1ch4.bonds.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, missing: "a" }, difficulty: 2 },
                { code: "g1ch4.bonds.q3", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, missing: "b" }, difficulty: 3 },
                { code: "g1ch4.bonds.q4", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, missing: "a" }, difficulty: 3 },
                { code: "g1ch4.bonds.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, missing: "b" }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch4-l7",
      title: "Addition and Subtraction",
      type: "STANDARD",
      objective: "See addition and subtraction as opposite moves that connect through the same number bond.",
      missionBriefing: "7 sharpeners sit in a tray — 4 red, 3 purple. One number bond, two kinds of questions: adding the parts, or subtracting one part from the whole.",
      workedExample: {
        problem: "There are 4 red sharpeners and 3 purple sharpeners. Use one number bond to find the total, and then a missing part.",
        steps: [
          { text: "To find the whole, add the parts: 4 + 3 = 7.", visual: { view: "numberBond", data: { whole: 7, part1: 4, part2: 3 } } },
          { text: "To find a missing part, subtract the part you know from the whole: 7 − 3 = 4." },
          { text: "Addition finds the whole; subtraction finds a missing part — same number bond, opposite direction." },
        ],
        answer: "4 + 3 = 7, and 7 − 3 = 4.",
        answerVisual: { view: "equation", data: { left: 7, op: "-", right: 3, result: 4 } },
      },
      concepts: [
        {
          title: "Opposite Moves",
          bigIdea: "Addition and subtraction undo each other — they're two directions through the exact same number bond.",
          skills: [
            {
              code: "g1ch4.addsub",
              title: "Addition and subtraction together",
              description: "Move fluently between an addition fact and its matching subtraction fact.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch4.bonds", "g1ch3.bonds"],
              questions: [
                { code: "g1ch4.addsub.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 2 },
                { code: "g1ch4.addsub.q2", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.basic", params: { max: 10 }, difficulty: 2 },
                { code: "g1ch4.addsub.q3", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, missing: "a" }, difficulty: 3 },
                { code: "g1ch4.addsub.q4", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, missing: "b" }, difficulty: 3 },
                { code: "g1ch4.addsub.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 4 },
                { code: "g1ch4.addsub.q6", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10 }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch4-l8",
      title: "Make Addition and Subtraction Story Problems",
      type: "STANDARD",
      objective: "Write and solve both an addition and a subtraction story about the same picture.",
      missionBriefing: "A carton has some eggs inside, some sit on the plate. Can you make up both an addition story AND a subtraction story about them?",
      workedExample: {
        problem: "4 slices of orange are small. 6 slices are big. Make an addition story. Then use the total to make a subtraction story.",
        steps: [
          { text: "Addition story: \"There are 4 small slices and 6 big slices. How many slices in all?\" 4 + 6 = 10.", visual: { view: "numberBond", data: { whole: 10, part1: 4, part2: 6 } } },
          { text: "Subtraction story: \"There are 10 slices. 6 are big. How many are small?\" 10 − 6 = 4." },
        ],
        answer: "4 + 6 = 10, and 10 − 6 = 4 — the same number bond answers both stories.",
        answerVisual: { view: "equation", data: { left: 10, op: "-", right: 6, result: 4 } },
      },
      concepts: [
        {
          title: "Two Stories, One Number Bond",
          bigIdea: "The same group of numbers can be told as either an addition story (finding the whole) or a subtraction story (finding a part).",
          skills: [
            {
              code: "g1ch4.mixedstories",
              title: "Make addition and subtraction story problems",
              description: "Solve addition and subtraction word problems within 10, mixed together.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch4.stories", "g1ch3.stories"],
              questions: [
                { code: "g1ch4.mixedstories.q1", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 10 }, difficulty: 2 },
                { code: "g1ch4.mixedstories.q2", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.subtraction.wordproblem", params: { max: 10 }, difficulty: 2 },
                { code: "g1ch4.mixedstories.q3", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 10 }, difficulty: 3 },
                { code: "g1ch4.mixedstories.q4", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.subtraction.wordproblem", params: { max: 10 }, difficulty: 3 },
                { code: "g1ch4.mixedstories.q5", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.subtraction.wordproblem", params: { max: 10 }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch4-l9",
      title: "Subtraction Facts",
      type: "STANDARD",
      objective: "Build fast, automatic recall of every subtraction fact within 10.",
      missionBriefing: "Flash-card time! Every subtraction fact up to 10 — can you answer them fast, without counting back on your fingers?",
      workedExample: {
        problem: "What patterns do you notice in 10-1, 10-2, 10-3, 10-4?",
        steps: [
          { text: "Look at the second number: 1, 2, 3, 4 — it goes up by 1 each time." },
          { text: "Now look at the answer: 9, 8, 7, 6 — it goes down by 1 each time." },
          { text: "Spotting the pattern makes recall faster than counting back every time." },
        ],
        answer: "10−1=9, 10−2=8, 10−3=7, 10−4=6 — as the number subtracted grows by 1, the answer shrinks by 1.",
        answerVisual: { view: "equation", data: { left: 10, op: "-", right: 4, result: 6 } },
      },
      concepts: [
        {
          title: "Fast Fact Recall",
          bigIdea: "The more you practice subtraction facts within 10, the faster and more automatic they become.",
          skills: [
            {
              code: "g1ch4.facts",
              title: "Subtraction facts within 10",
              description: "Quickly recall any subtraction fact within 10.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch4.bonds", "g1ch4.countback"],
              questions: [
                { code: "g1ch4.facts.q1", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10 }, difficulty: 2 },
                { code: "g1ch4.facts.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10 }, difficulty: 3 },
                { code: "g1ch4.facts.q3", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10 }, difficulty: 4 },
                { code: "g1ch4.facts.q4", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10 }, difficulty: 4 },
                { code: "g1ch4.facts.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10 }, difficulty: 5 },
                { code: "g1ch4.facts.q6", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10 }, difficulty: 5 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch4-l10",
      title: "Practice",
      type: "PRACTICE",
      objective: "Mixed practice subtracting within 10 — equations, word problems, missing numbers, and fact families.",
      missionBriefing: "Show everything you've learned about subtraction at the Lily Pond!",
      workedExample: {
        problem: "Quick recap: what's the one big idea behind every subtraction question?",
        steps: [
          { text: "Taking away, or finding a missing part — both are subtraction." },
          { text: "A number bond shows the whole and both parts, so you can find whichever one is missing.", visual: { view: "numberBond", data: { whole: 8, part1: 5, part2: 3 } } },
          { text: "Addition and subtraction are opposite moves through the exact same number bond." },
        ],
        answer: "Subtraction always means finding what's left, or finding a missing part.",
      },
      concepts: [
        {
          title: "Mixed Review",
          bigIdea: "Bringing together every way of thinking about subtraction within 10.",
          skills: [
            {
              code: "g1ch4.practice",
              title: "Chapter 4 mixed practice",
              description: "Mixed practice subtracting within 10.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch4.facts", "g1ch4.mixedstories", "g1ch4.subzero"],
              questions: [
                { code: "g1ch4.practice.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.basic", params: { max: 10 }, difficulty: 2 },
                { code: "g1ch4.practice.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, zeroMode: "subtractZero" }, difficulty: 2 },
                { code: "g1ch4.practice.q3", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.subtraction.wordproblem", params: { max: 10 }, difficulty: 3 },
                { code: "g1ch4.practice.q4", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 10 }, difficulty: 3 },
                { code: "g1ch4.practice.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, missing: "a" }, difficulty: 3 },
                { code: "g1ch4.practice.q6", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, missing: "b" }, difficulty: 4 },
                { code: "g1ch4.practice.q7", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 4 },
                { code: "g1ch4.practice.q8", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10 }, difficulty: 5 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch4-review",
      title: "Review 1: Numbers to 10",
      type: "REVIEW",
      objective: "Cumulative review of counting, number bonds, addition, and subtraction within 10 (Chapters 1-4).",
      missionBriefing: "A big checkpoint! Show everything you've learned since the start of the adventure — counting, number bonds, addition, and subtraction.",
      workedExample: {
        problem: "Quick recap: how do counting, number bonds, addition, and subtraction all connect?",
        steps: [
          { text: "Counting tells you how many are in a group.", visual: { view: "equalGroups", data: { groups: 1, perGroup: 7, itemIcon: "star" } } },
          { text: "A number bond splits that count into two parts.", visual: { view: "numberBond", data: { whole: 7, part1: 3, part2: 4 } } },
          { text: "Addition puts the parts back together: 3 + 4 = 7." },
          { text: "Subtraction finds a missing part: 7 − 4 = 3." },
        ],
        answer: "Counting, number bonds, addition, and subtraction are all connected through the same numbers.",
      },
      concepts: [
        {
          title: "Cumulative Review",
          bigIdea: "Every skill from the first four chapters works together.",
          skills: [
            {
              code: "g1ch4.review",
              title: "Review 1 mixed practice",
              description: "Mixed cumulative review across Chapters 1-4.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch4.practice", "g1ch1.compare", "g1ch1.order"],
              questions: [
                { code: "g1ch4.review.q1", kind: "FILL_IN_BLANK", stage: "CONCRETE", generatorId: "g1.count.objects", params: {}, difficulty: 2 },
                { code: "g1ch4.review.q2", kind: "MULTIPLE_CHOICE", stage: "PICTORIAL", generatorId: "compare.numbers", params: { min: 0, max: 10 }, difficulty: 2 },
                { code: "g1ch4.review.q3", kind: "SORT_ORDER", stage: "ABSTRACT", generatorId: "order.numbers", params: { min: 0, max: 10, count: 3 }, difficulty: 2 },
                { code: "g1ch4.review.q4", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "g1.numberbond.missing", params: { wholes: [6, 7, 8, 9, 10] }, difficulty: 3 },
                { code: "g1ch4.review.q5", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 3 },
                { code: "g1ch4.review.q6", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.subtraction.basic", params: { max: 10 }, difficulty: 3 },
                { code: "g1ch4.review.q7", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 10 }, difficulty: 4 },
                { code: "g1ch4.review.q8", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.subtraction.wordproblem", params: { max: 10 }, difficulty: 4 },
                { code: "g1ch4.review.q9", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, missing: "a" }, difficulty: 4 },
                { code: "g1ch4.review.q10", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.subtraction.basic", params: { max: 10, missing: "b" }, difficulty: 5 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
