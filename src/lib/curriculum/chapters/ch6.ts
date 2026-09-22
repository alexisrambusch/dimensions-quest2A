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
              ],
            },
          ],
        },
      ],
    },
  ],
};
