import type { ChapterDef } from "../types";

export const ch6: ChapterDef = {
  code: "ch6",
  title: "Multiplication & Division",
  description: "Build the conceptual foundation for multiplication (equal groups, arrays) and division (sharing, grouping) before moving to fact fluency in Chapter 7.",
  worldName: "Multiplication Forest",
  worldTheme: "forest",
  lessons: [
    {
      code: "ch6-l1",
      title: "Multiplication as Equal Groups",
      type: "STANDARD",
      objective: "Understand multiplication as combining equal-sized groups, not as repeated addition drilled abstractly.",
      missionBriefing: "Forest critters love working in equal teams. Count how many acorns they collect together!",
      workedExample: {
        problem: "3 forest teams each collect 4 acorns. How many acorns in all?",
        steps: [
          "There are 3 equal groups, and each group has 4 acorns.",
          "You could add: 4 + 4 + 4 = 12.",
          "Multiplication is a faster way to write the same thing: 3 groups of 4 is 3 × 4.",
          "3 × 4 = 12.",
        ],
        answer: "The teams collected 12 acorns in all.",
      },
      concepts: [
        {
          title: "Equal Groups",
          bigIdea: "Multiplication counts the total when you have several groups of the same size.",
          skills: [
            {
              code: "ch6.mult.equalgroups",
              title: "Multiply using equal groups",
              description: "Find the total in a set of equal-sized groups.",
              stage: "CONCRETE",
              prerequisites: [],
              questions: [
                { code: "ch6.mult.equalgroups.q1", kind: "ARRAY_VISUAL", stage: "CONCRETE", generatorId: "mult.table", params: { factor: 3 }, difficulty: 1 },
                { code: "ch6.mult.equalgroups.q2", kind: "ARRAY_VISUAL", stage: "CONCRETE", generatorId: "mult.table", params: { factor: 4 }, difficulty: 2 },
                { code: "ch6.mult.equalgroups.q3", kind: "ARRAY_VISUAL", stage: "CONCRETE", generatorId: "mult.table", params: { factor: 5 }, difficulty: 1 },
                { code: "ch6.mult.equalgroups.q4", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "mult.findmistake", params: { factor: 3 }, difficulty: 2 },
                { code: "ch6.mult.equalgroups.q5", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "multdiv.chooseoperation", params: { factor: 3 }, difficulty: 2 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch6-l2",
      title: "Arrays",
      type: "STANDARD",
      objective: "See multiplication as rows and columns in an array.",
      missionBriefing: "Help the Forest gardeners plant their vegetable rows in neat arrays.",
      workedExample: {
        problem: "The gardeners plant vegetables in 3 rows of 5. How many plants in all?",
        steps: [
          "An array is just equal groups arranged in neat rows and columns.",
          "Here there are 3 rows, and each row has 5 plants.",
          "Rows × columns gives the total: 3 × 5.",
          "3 × 5 = 15.",
        ],
        answer: "There are 15 plants in all.",
      },
      concepts: [
        {
          title: "Rows and Columns",
          bigIdea: "An array shows multiplication as rows × columns — the same total as equal groups.",
          skills: [
            {
              code: "ch6.mult.arrays",
              title: "Multiply using arrays",
              description: "Find the total number of items in a rows-by-columns array.",
              stage: "PICTORIAL",
              prerequisites: ["ch6.mult.equalgroups"],
              questions: [
                { code: "ch6.mult.arrays.q1", kind: "ARRAY_VISUAL", stage: "PICTORIAL", generatorId: "mult.array", params: { factor: 3 }, difficulty: 2 },
                { code: "ch6.mult.arrays.q2", kind: "ARRAY_VISUAL", stage: "PICTORIAL", generatorId: "mult.array", params: { factor: 4 }, difficulty: 3 },
                { code: "ch6.mult.arrays.q3", kind: "ARRAY_VISUAL", stage: "PICTORIAL", generatorId: "mult.array", params: { factor: 5 }, difficulty: 2 },
                { code: "ch6.mult.arrays.q4", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "mult.commutativeclaim", params: { factor: 3 }, difficulty: 3 },
                { code: "ch6.mult.arrays.q5", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "mult.findmistake", params: { factor: 4 }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch6-l3",
      title: "Division as Sharing",
      type: "STANDARD",
      objective: "Understand partitive division: sharing a total equally among a known number of groups.",
      missionBriefing: "The Forest council must share supplies fairly among all the dens. How much does each den get?",
      workedExample: {
        problem: "12 berries are shared equally among 3 dens. How many berries does each den get?",
        steps: [
          "You know the total (12 berries) and the number of groups (3 dens).",
          "The question is: how many go in each group?",
          "That's what division finds: 12 ÷ 3.",
          "12 ÷ 3 = 4.",
        ],
        answer: "Each den gets 4 berries.",
      },
      concepts: [
        {
          title: "Sharing Equally",
          bigIdea: "Partitive division finds how much is in each group when the number of groups is known.",
          skills: [
            {
              code: "ch6.div.sharing",
              title: "Divide by sharing equally",
              description: "Find the size of each group when a total is shared equally.",
              stage: "CONCRETE",
              prerequisites: ["ch6.mult.equalgroups"],
              questions: [
                { code: "ch6.div.sharing.q1", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "div.wordproblem.partitive", params: { factor: 3 }, difficulty: 1 },
                { code: "ch6.div.sharing.q2", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "div.wordproblem.partitive", params: { factor: 4 }, difficulty: 2 },
                { code: "ch6.div.sharing.q3", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "div.wordproblem.partitive", params: { factor: 5 }, difficulty: 3 },
                { code: "ch6.div.sharing.q4", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "div.findmistake", params: { factor: 3 }, difficulty: 2 },
                { code: "ch6.div.sharing.q5", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "multdiv.chooseoperation", params: { factor: 4 }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch6-l4",
      title: "Division as Grouping",
      type: "STANDARD",
      objective: "Understand measurement division: finding how many equal groups can be made.",
      missionBriefing: "Pack the Forest's berries into baskets that each hold the same amount. How many baskets do you need?",
      workedExample: {
        problem: "There are 12 berries. Each basket holds 4 berries. How many baskets can we fill?",
        steps: [
          "This time you know the total (12 berries) and the size of each group (4 per basket).",
          "The question is: how many groups can you make?",
          "That's also division: 12 ÷ 4.",
          "12 ÷ 4 = 3.",
        ],
        answer: "You can fill 3 baskets.",
      },
      concepts: [
        {
          title: "Making Equal Groups",
          bigIdea: "Measurement division finds how many groups you can make when the group size is known.",
          skills: [
            {
              code: "ch6.div.grouping",
              title: "Divide by making equal groups",
              description: "Find the number of equal groups that can be made from a total.",
              stage: "CONCRETE",
              prerequisites: ["ch6.mult.equalgroups"],
              questions: [
                { code: "ch6.div.grouping.q1", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "div.wordproblem.measurement", params: { factor: 3 }, difficulty: 1 },
                { code: "ch6.div.grouping.q2", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "div.wordproblem.measurement", params: { factor: 4 }, difficulty: 2 },
                { code: "ch6.div.grouping.q3", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "div.wordproblem.measurement", params: { factor: 5 }, difficulty: 3 },
                { code: "ch6.div.grouping.q4", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "div.findmistake", params: { factor: 4 }, difficulty: 3 },
                { code: "ch6.div.grouping.q5", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "multdiv.chooseoperation", params: { factor: 5 }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch6-l5",
      title: "Connecting Multiplication & Division",
      type: "STANDARD",
      objective: "See multiplication and division as inverse operations within the same fact family.",
      missionBriefing: "Every Forest team has a matching division fact. Discover the connection!",
      workedExample: {
        problem: "You know 3 × 4 = 12. What is 12 ÷ 3? What is 12 ÷ 4?",
        steps: [
          "Multiplication and division are inverses — they use the same three numbers, just asked differently.",
          "3 × 4 = 12 means 3 groups of 4 make 12.",
          "So 12 ÷ 3 asks 'how many in each of 3 groups?' — the answer is 4.",
          "And 12 ÷ 4 asks 'how many groups of 4?' — the answer is 3.",
        ],
        answer: "12 ÷ 3 = 4, and 12 ÷ 4 = 3.",
      },
      concepts: [
        {
          title: "Fact Families",
          bigIdea: "If a × b = c, then c ÷ a = b and c ÷ b = a — multiplication and division undo each other.",
          skills: [
            {
              code: "ch6.factfamily",
              title: "Connect multiplication and division facts",
              description: "Use a known multiplication fact to find the related division fact.",
              stage: "PICTORIAL",
              prerequisites: ["ch6.mult.arrays", "ch6.div.sharing", "ch6.div.grouping"],
              questions: [
                { code: "ch6.factfamily.q1", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "div.frommult", params: { factor: 3 }, difficulty: 2 },
                { code: "ch6.factfamily.q2", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "div.frommult", params: { factor: 4 }, difficulty: 3 },
                { code: "ch6.factfamily.q3", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "div.frommult", params: { factor: 5 }, difficulty: 3 },
                { code: "ch6.factfamily.q4", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "mult.commutativeclaim", params: { factor: 5 }, difficulty: 4 },
                { code: "ch6.factfamily.q5", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "mult.wordproblem", params: { factor: 4 }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch6-review",
      title: "Chapter Review: Multiplication Forest",
      type: "REVIEW",
      objective: "Review equal groups, arrays, sharing, grouping, and fact families.",
      missionBriefing: "One last romp through the Forest before Chapter 7's fact-fluency quest!",
      workedExample: {
        problem: "Quick recap: how are multiplication and division connected?",
        steps: [
          "Multiplication combines equal groups into a total: groups × size = total.",
          "Sharing division finds the size of each group when you know the total and the number of groups.",
          "Grouping division finds the number of groups when you know the total and the group size.",
          "All three use the same three numbers — just asking a different one of them.",
        ],
        answer: "Multiplication and division are two sides of the same equal-groups idea.",
      },
      concepts: [
        {
          title: "Mixed Review",
          bigIdea: "Bringing together the concrete meanings of multiplication and division.",
          skills: [
            {
              code: "ch6.review",
              title: "Chapter 6 mixed review",
              description: "Mixed practice across Chapter 6 skills.",
              stage: "PICTORIAL",
              prerequisites: ["ch6.factfamily"],
              questions: [
                { code: "ch6.review.q1", kind: "ARRAY_VISUAL", stage: "PICTORIAL", generatorId: "mult.table", params: { factor: 3 }, difficulty: 2 },
                { code: "ch6.review.q2", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "div.wordproblem.partitive", params: { factor: 4 }, difficulty: 2 },
                { code: "ch6.review.q3", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "div.frommult", params: { factor: 3 }, difficulty: 2 },
                { code: "ch6.review.q4", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "mult.findmistake", params: { factor: 5 }, difficulty: 4 },
                { code: "ch6.review.q5", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "div.findmistake", params: { factor: 5 }, difficulty: 4 },
                { code: "ch6.review.q6", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "multdiv.chooseoperation", params: { factor: 4 }, difficulty: 4 },
                { code: "ch6.review.q7", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "div.frommult", params: { factor: 5 }, difficulty: 4 },
                { code: "ch6.review.q8", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "mult.wordproblem", params: { factor: 5 }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
