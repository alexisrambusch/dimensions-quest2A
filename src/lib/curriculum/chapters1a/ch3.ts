import type { ChapterDef } from "../types";

export const g1ch3: ChapterDef = {
  code: "g1ch3",
  title: "Addition",
  description: "Add numbers within 10 — putting groups together, adding more, counting on, and building fast fact recall.",
  worldName: "Sunflower Garden",
  worldTheme: "garden",
  lessons: [
    {
      code: "g1ch3-l1",
      title: "Addition as Putting Together",
      type: "STANDARD",
      objective: "Combine two separate groups into one total using addition.",
      missionBriefing: "Two flocks of birds land on the same branch in the Sunflower Garden. How many birds are there once they're all together?",
      workedExample: {
        problem: "5 birds are on one branch. 3 birds are on another branch. How many birds are there altogether?",
        steps: [
          { text: "There are two separate groups: 5 birds and 3 birds." },
          { text: "Putting them together means adding: 5 + 3.", visual: { view: "numberBond", data: { whole: 8, part1: 5, part2: 3 } } },
          { text: "5 + 3 = 8." },
        ],
        answer: "There are 8 birds altogether.",
        answerVisual: { view: "equation", data: { left: 5, op: "+", right: 3, result: 8 } },
      },
      concepts: [
        {
          title: "Combining Two Groups",
          bigIdea: "When two separate groups are put together, addition tells you the new total.",
          skills: [
            {
              code: "g1ch3.together",
              title: "Addition as putting together",
              description: "Find the total when two groups (each within 10) are combined.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch2.make10a"],
              questions: [
                { code: "g1ch3.together.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 1 },
                { code: "g1ch3.together.q2", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 2 },
                { code: "g1ch3.together.q3", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 10, style: "together" }, difficulty: 2 },
                { code: "g1ch3.together.q4", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 10, style: "together" }, difficulty: 3 },
                { code: "g1ch3.together.q5", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch3-l2",
      title: "Addition as Adding More",
      type: "STANDARD",
      objective: "Find a new total when more items join a starting group.",
      missionBriefing: "5 birds are already resting on a branch. 2 more swoop in to join them. How many birds are on the branch now?",
      workedExample: {
        problem: "5 birds are on a branch. 2 more birds come. How many birds will be on the branch altogether?",
        steps: [
          { text: "Start with the group that's already there: 5 birds." },
          { text: "2 more birds arrive, so add them on: 5 + 2.", visual: { view: "numberBond", data: { whole: 7, part1: 5, part2: 2 } } },
          { text: "5 + 2 = 7." },
        ],
        answer: "There will be 7 birds on the branch altogether.",
        answerVisual: { view: "equation", data: { left: 5, op: "+", right: 2, result: 7 } },
      },
      concepts: [
        {
          title: "A Group Growing",
          bigIdea: "When more items join a group that's already there, addition tells you the new total — same math as putting together, different story.",
          skills: [
            {
              code: "g1ch3.addmore",
              title: "Addition as adding more",
              description: "Find the new total when more items (within 10) join a starting group.",
              stage: "PICTORIAL",
              prerequisites: ["g1ch3.together"],
              questions: [
                { code: "g1ch3.addmore.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 1 },
                { code: "g1ch3.addmore.q2", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 10, style: "more" }, difficulty: 2 },
                { code: "g1ch3.addmore.q3", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 10, style: "more" }, difficulty: 3 },
                { code: "g1ch3.addmore.q4", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 3 },
                { code: "g1ch3.addmore.q5", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 10, style: "more" }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch3-l3",
      title: "Addition with 0",
      type: "STANDARD",
      objective: "Understand that adding 0 to a number never changes it.",
      missionBriefing: "0 puppies get in the bed, then 3 more arrive. Does adding 0 ever change how many there are?",
      workedExample: {
        problem: "There are 7 birds on one branch and 0 birds on the other. How many birds are there in all?",
        steps: [
          { text: "One branch has 7 birds. The other branch has 0 birds — it's empty." },
          { text: "Adding 0 doesn't add anything new: 7 + 0.", visual: { view: "numberBond", data: { whole: 7, part1: 7, part2: 0 } } },
          { text: "7 + 0 = 7 — the total stays exactly the same." },
        ],
        answer: "There are 7 birds in all.",
        answerVisual: { view: "equation", data: { left: 7, op: "+", right: 0, result: 7 } },
      },
      concepts: [
        {
          title: "Adding Zero",
          bigIdea: "Adding 0 to any number leaves it unchanged — 0 means nothing is being added.",
          skills: [
            {
              code: "g1ch3.addzero",
              title: "Addition with 0",
              description: "Recognize that a number plus 0 (in either order) equals that same number.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch3.together"],
              questions: [
                { code: "g1ch3.addzero.q1", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, forceZero: true }, difficulty: 1 },
                { code: "g1ch3.addzero.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, forceZero: true }, difficulty: 1 },
                { code: "g1ch3.addzero.q3", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, forceZero: true }, difficulty: 2 },
                { code: "g1ch3.addzero.q4", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, forceZero: true, missing: "a" }, difficulty: 3 },
                { code: "g1ch3.addzero.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, forceZero: true, missing: "b" }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch3-l4",
      title: "Addition with Number Bonds",
      type: "STANDARD",
      objective: "Use number bonds to see that addition can be done in either order, and find any missing number in the equation.",
      missionBriefing: "4 blue birds and 3 yellow birds land in the tree. Does it matter which color you count first?",
      workedExample: {
        problem: "4 blue birds and 3 yellow birds are in a tree. How many birds are there altogether?",
        steps: [
          { text: "4 and 3 are the two parts of the whole.", visual: { view: "numberBond", data: { whole: 7, part1: 4, part2: 3 } } },
          { text: "4 + 3 = 7." },
          { text: "It also works the other way around: 3 + 4 = 7 — the order doesn't change the total." },
        ],
        answer: "There are 7 birds altogether, and 4 + 3 = 3 + 4.",
        answerVisual: { view: "equation", data: { left: 4, op: "+", right: 3, result: 7 } },
      },
      concepts: [
        {
          title: "Any Order, Any Missing Part",
          bigIdea: "A number bond shows all three numbers in an addition fact at once, so you can find whichever one is missing — the whole or either part.",
          skills: [
            {
              code: "g1ch3.bonds",
              title: "Addition with number bonds",
              description: "Find any missing number — the sum or either addend — in an addition fact within 10.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch3.addmore", "g1ch2.make10a"],
              questions: [
                { code: "g1ch3.bonds.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 1 },
                { code: "g1ch3.bonds.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, missing: "a" }, difficulty: 2 },
                { code: "g1ch3.bonds.q3", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, missing: "b" }, difficulty: 3 },
                { code: "g1ch3.bonds.q4", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, missing: "a" }, difficulty: 3 },
                { code: "g1ch3.bonds.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, missing: "b" }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch3-l5",
      title: "Addition by Counting On",
      type: "STANDARD",
      objective: "Add a small number (1, 2, or 3) by counting on from the larger addend instead of starting over from 1.",
      missionBriefing: "4 strawberries are on a plate. If 1, 2, or 3 more are added, can you count on instead of counting everything from the start?",
      workedExample: {
        problem: "There are 4 strawberries. 3 more are added. How many strawberries are there now?",
        steps: [
          { text: "Start at 4 — don't recount those strawberries." },
          { text: "Count on 3 more: 5, 6, 7." },
          { text: "4 + 3 = 7." },
        ],
        answer: "There are 7 strawberries now.",
        answerVisual: { view: "equation", data: { left: 4, op: "+", right: 3, result: 7 } },
      },
      concepts: [
        {
          title: "Counting On",
          bigIdea: "Instead of counting a whole group from 1 again, start at the bigger number and count on by the smaller one — it's faster and just as accurate.",
          skills: [
            {
              code: "g1ch3.counton",
              title: "Addition by counting on",
              description: "Add 1, 2, or 3 to a number within 10 by counting on.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch3.together"],
              questions: [
                { code: "g1ch3.counton.q1", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, bMin: 1, bMax: 1 }, difficulty: 1 },
                { code: "g1ch3.counton.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, bMin: 1, bMax: 2 }, difficulty: 2 },
                { code: "g1ch3.counton.q3", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, bMin: 1, bMax: 3 }, difficulty: 3 },
                { code: "g1ch3.counton.q4", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, bMin: 2, bMax: 3 }, difficulty: 3 },
                { code: "g1ch3.counton.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, bMin: 1, bMax: 3 }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch3-l6",
      title: "Make Addition Stories",
      type: "STANDARD",
      objective: "Write and solve an original addition story for a given picture or situation.",
      missionBriefing: "2 of the garden kids have yo-yos, and 3 don't. Can you turn that into your own addition story?",
      workedExample: {
        problem: "There are 2 large rabbits and 4 small rabbits in the garden. Make up an addition story.",
        steps: [
          { text: "Notice the two groups: 2 large rabbits and 4 small rabbits." },
          { text: "Turn it into a story: \"There are 2 large rabbits and 4 small rabbits. How many rabbits are there in all?\"" },
          { text: "Solve it: 2 + 4 = 6.", visual: { view: "numberBond", data: { whole: 6, part1: 2, part2: 4 } } },
        ],
        answer: "There are 6 rabbits altogether.",
        answerVisual: { view: "equation", data: { left: 2, op: "+", right: 4, result: 6 } },
      },
      concepts: [
        {
          title: "Telling the Story",
          bigIdea: "Every addition equation can be told as a real-life story about two groups coming together.",
          skills: [
            {
              code: "g1ch3.stories",
              title: "Make addition stories",
              description: "Solve short addition word problems within 10.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch3.together", "g1ch3.addmore"],
              questions: [
                { code: "g1ch3.stories.q1", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 10, style: "together" }, difficulty: 2 },
                { code: "g1ch3.stories.q2", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 10, style: "more" }, difficulty: 2 },
                { code: "g1ch3.stories.q3", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 10, style: "together" }, difficulty: 3 },
                { code: "g1ch3.stories.q4", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 10, style: "more" }, difficulty: 3 },
                { code: "g1ch3.stories.q5", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 10 }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch3-l7",
      title: "Addition Facts",
      type: "STANDARD",
      objective: "Build fast, automatic recall of every addition fact within 10.",
      missionBriefing: "Flash-card time! Every addition fact up to 10 — can you answer them fast, without counting on your fingers?",
      workedExample: {
        problem: "What patterns do you notice in the addition facts that make 9: 1+8, 2+7, 3+6, 4+5?",
        steps: [
          { text: "Look at how the first number changes: 1, 2, 3, 4 — it goes up by 1 each time." },
          { text: "Now look at the second number: 8, 7, 6, 5 — it goes down by 1 each time." },
          { text: "Knowing the pattern makes it faster to recall every fact, not just count them out." },
        ],
        answer: "1+8, 2+7, 3+6, and 4+5 all equal 9 — as one addend grows by 1, the other shrinks by 1.",
        answerVisual: { view: "equation", data: { left: 4, op: "+", right: 5, result: 9 } },
      },
      concepts: [
        {
          title: "Fast Fact Recall",
          bigIdea: "The more you practice addition facts within 10, the faster and more automatic they become.",
          skills: [
            {
              code: "g1ch3.facts",
              title: "Addition facts within 10",
              description: "Quickly recall any addition fact within 10.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch3.bonds", "g1ch3.counton"],
              questions: [
                { code: "g1ch3.facts.q1", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 2 },
                { code: "g1ch3.facts.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 3 },
                { code: "g1ch3.facts.q3", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 4 },
                { code: "g1ch3.facts.q4", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 4 },
                { code: "g1ch3.facts.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 5 },
                { code: "g1ch3.facts.q6", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 5 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "g1ch3-l8",
      title: "Practice",
      type: "PRACTICE",
      objective: "Mixed practice adding within 10 — equations, word problems, and missing numbers.",
      missionBriefing: "Show everything you've learned about addition in the Sunflower Garden!",
      workedExample: {
        problem: "Quick recap: what's the one big idea behind every addition question?",
        steps: [
          { text: "Putting two groups together, or adding more to a group — both are addition." },
          { text: "A number bond shows the whole and both parts, and you can find any missing one.", visual: { view: "numberBond", data: { whole: 7, part1: 4, part2: 3 } } },
          { text: "The more you practice, the faster your addition facts become." },
        ],
        answer: "Addition always means finding a total — the same big idea, in every kind of story.",
      },
      concepts: [
        {
          title: "Mixed Review",
          bigIdea: "Bringing together every way of thinking about addition within 10.",
          skills: [
            {
              code: "g1ch3.practice",
              title: "Chapter 3 mixed practice",
              description: "Mixed practice adding within 10.",
              stage: "ABSTRACT",
              prerequisites: ["g1ch3.facts", "g1ch3.stories", "g1ch3.addzero"],
              questions: [
                { code: "g1ch3.practice.q1", kind: "BUILD_EQUATION", stage: "PICTORIAL", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 2 },
                { code: "g1ch3.practice.q2", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, forceZero: true }, difficulty: 2 },
                { code: "g1ch3.practice.q3", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 10, style: "together" }, difficulty: 3 },
                { code: "g1ch3.practice.q4", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "g1.addition.wordproblem", params: { max: 10, style: "more" }, difficulty: 3 },
                { code: "g1ch3.practice.q5", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, missing: "a" }, difficulty: 3 },
                { code: "g1ch3.practice.q6", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10, missing: "b" }, difficulty: 4 },
                { code: "g1ch3.practice.q7", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 4 },
                { code: "g1ch3.practice.q8", kind: "BUILD_EQUATION", stage: "ABSTRACT", generatorId: "g1.addition.basic", params: { max: 10 }, difficulty: 5 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
