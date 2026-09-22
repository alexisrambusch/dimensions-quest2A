import type { ChapterDef } from "../types";

export const ch7: ChapterDef = {
  code: "ch7",
  title: "Multiplication and Division of 2, 5, and 10",
  description:
    "Build fluency with the ×2, ×5, ×10 tables and their division inverses through strategy and relationship, not rote timed drilling.",
  worldName: "Division Realm",
  worldTheme: "realm",
  lessons: [
    {
      code: "ch7-l1",
      title: "The Multiplication Table of 5",
      type: "STANDARD",
      objective: "Build the multiplication table of 5 and investigate how the product changes as the number of groups of 5 increases or decreases.",
      missionBriefing: "The Realm's ×5 tower needs building, one group of 5 at a time. Watch how the total grows!",
      concepts: [
        {
          title: "Building the ×5 Table",
          bigIdea: "Each time you add one more group of 5, the product grows by 5.",
          skills: [
            {
              code: "ch7.mult5.table",
              title: "Build the multiplication table of 5",
              description: "Build equal groups of 5 and observe the growing product as groups increase.",
              stage: "CONCRETE",
              prerequisites: ["ch6.mult.equalgroups"],
              questions: [
                { code: "ch7.mult5.table.q1", kind: "ARRAY_VISUAL", stage: "CONCRETE", generatorId: "mult.table", params: { factor: 5 }, difficulty: 1 },
                { code: "ch7.mult5.table.q2", kind: "ARRAY_VISUAL", stage: "CONCRETE", generatorId: "mult.table", params: { factor: 5 }, difficulty: 2 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch7-l2",
      title: "Multiplication Facts of 5",
      type: "STANDARD",
      objective: "Learn a × 5 and 5 × a for a = 1-9, and the commutative relationship between them.",
      missionBriefing: "Realm scouts need instant recall of ×5 facts in either order — practice both!",
      concepts: [
        {
          title: "×5 Facts, Both Orders",
          bigIdea: "a × 5 and 5 × a always give the same product — order doesn't change the total.",
          skills: [
            {
              code: "ch7.mult5.facts",
              title: "Recall multiplication facts of 5",
              description: "Fluently recall a × 5 and 5 × a for a = 1-9.",
              stage: "ABSTRACT",
              prerequisites: ["ch7.mult5.table"],
              questions: [
                { code: "ch7.mult5.facts.q1", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "mult.fact", params: { factor: 5 }, difficulty: 2 },
                { code: "ch7.mult5.facts.q2", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "mult.wordproblem", params: { factor: 5 }, difficulty: 2 },
                { code: "ch7.mult5.facts.q3", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "mult.findmistake", params: { factor: 5 }, difficulty: 2 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch7-l3",
      title: "Practice A",
      type: "PRACTICE",
      objective: "Practice multiplication facts of 5.",
      missionBriefing: "Time to prove your ×5 mastery with a Realm training round.",
      concepts: [
        {
          title: "×5 Practice",
          bigIdea: "Repeated, varied practice builds fluency without rote memorization alone.",
          skills: [
            {
              code: "ch7.mult5.practice",
              title: "Practice ×5 facts",
              description: "Mixed practice of ×5 facts across formats.",
              stage: "ABSTRACT",
              prerequisites: ["ch7.mult5.facts"],
              questions: [
                { code: "ch7.mult5.practice.q1", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "mult.fact", params: { factor: 5 }, difficulty: 3 },
                { code: "ch7.mult5.practice.q2", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "mult.wordproblem", params: { factor: 5 }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch7-l4",
      title: "The Multiplication Table of 2",
      type: "STANDARD",
      objective: "Build the multiplication table of 2 and investigate how the product changes as the number of groups of 2 increases or decreases.",
      missionBriefing: "Now build the Realm's ×2 tower, one pair at a time.",
      concepts: [
        {
          title: "Building the ×2 Table",
          bigIdea: "Each time you add one more group of 2, the product grows by 2 — doubling.",
          skills: [
            {
              code: "ch7.mult2.table",
              title: "Build the multiplication table of 2",
              description: "Build equal groups of 2 and observe the growing product as groups increase.",
              stage: "CONCRETE",
              prerequisites: ["ch6.mult.equalgroups"],
              questions: [
                { code: "ch7.mult2.table.q1", kind: "ARRAY_VISUAL", stage: "CONCRETE", generatorId: "mult.table", params: { factor: 2 }, difficulty: 1 },
                { code: "ch7.mult2.table.q2", kind: "ARRAY_VISUAL", stage: "CONCRETE", generatorId: "mult.table", params: { factor: 2 }, difficulty: 2 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch7-l5",
      title: "Multiplication Facts of 2",
      type: "STANDARD",
      objective: "Learn a × 2 and 2 × a for a = 1-9.",
      missionBriefing: "Realm scouts now need instant recall of ×2 facts in either order.",
      concepts: [
        {
          title: "×2 Facts, Both Orders",
          bigIdea: "×2 is the same as doubling, in either order.",
          skills: [
            {
              code: "ch7.mult2.facts",
              title: "Recall multiplication facts of 2",
              description: "Fluently recall a × 2 and 2 × a for a = 1-9.",
              stage: "ABSTRACT",
              prerequisites: ["ch7.mult2.table"],
              questions: [
                { code: "ch7.mult2.facts.q1", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "mult.fact", params: { factor: 2 }, difficulty: 2 },
                { code: "ch7.mult2.facts.q2", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "mult.wordproblem", params: { factor: 2 }, difficulty: 2 },
                { code: "ch7.mult2.facts.q3", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "mult.findmistake", params: { factor: 2 }, difficulty: 2 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch7-l6",
      title: "Practice B",
      type: "PRACTICE",
      objective: "Practice multiplication facts of 2.",
      missionBriefing: "Prove your ×2 mastery with another Realm training round.",
      concepts: [
        {
          title: "×2 Practice",
          bigIdea: "Repeated, varied practice builds fluency without rote memorization alone.",
          skills: [
            {
              code: "ch7.mult2.practice",
              title: "Practice ×2 facts",
              description: "Mixed practice of ×2 facts across formats.",
              stage: "ABSTRACT",
              prerequisites: ["ch7.mult2.facts"],
              questions: [
                { code: "ch7.mult2.practice.q1", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "mult.fact", params: { factor: 2 }, difficulty: 3 },
                { code: "ch7.mult2.practice.q2", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "mult.wordproblem", params: { factor: 2 }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch7-l7",
      title: "The Multiplication Table of 10",
      type: "STANDARD",
      objective: "Build the multiplication table of 10 and learn a × 10 and 10 × a for a = 1-9, emphasizing the place-value pattern.",
      missionBriefing: "Build the tallest tower yet — the Realm's ×10 tower — and notice the pattern in the ones place!",
      concepts: [
        {
          title: "Building the ×10 Table",
          bigIdea: "Multiplying by 10 shifts every digit one place value up, leaving a zero in the ones place.",
          skills: [
            {
              code: "ch7.mult10.table",
              title: "Build the multiplication table of 10",
              description: "Build equal groups of 10 and observe the growing product as groups increase.",
              stage: "CONCRETE",
              prerequisites: ["ch6.mult.equalgroups"],
              questions: [
                { code: "ch7.mult10.table.q1", kind: "ARRAY_VISUAL", stage: "CONCRETE", generatorId: "mult.table", params: { factor: 10 }, difficulty: 1 },
                { code: "ch7.mult10.table.q2", kind: "ARRAY_VISUAL", stage: "CONCRETE", generatorId: "mult.table", params: { factor: 10 }, difficulty: 2 },
              ],
            },
            {
              code: "ch7.mult10.facts",
              title: "Recall multiplication facts of 10",
              description: "Fluently recall a × 10 and 10 × a for a = 1-9, using the place-value pattern.",
              stage: "ABSTRACT",
              prerequisites: ["ch7.mult10.table"],
              questions: [
                { code: "ch7.mult10.facts.q1", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "mult.fact", params: { factor: 10 }, difficulty: 2 },
                { code: "ch7.mult10.facts.q2", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "mult.wordproblem", params: { factor: 10 }, difficulty: 2 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch7-l8",
      title: "Dividing by 2",
      type: "STANDARD",
      objective: "Relate division facts for 2 to multiplication facts for 2, and learn division facts for 2.",
      missionBriefing: "The Realm's ×2 facts hold the key to their matching ÷2 facts. Discover the connection!",
      concepts: [
        {
          title: "÷2 from ×2",
          bigIdea: "Every ×2 fact has a matching ÷2 fact — division undoes multiplication.",
          skills: [
            {
              code: "ch7.div2",
              title: "Divide by 2",
              description: "Use known ×2 facts to find ÷2 facts.",
              stage: "PICTORIAL",
              prerequisites: ["ch7.mult2.facts", "ch6.factfamily"],
              questions: [
                { code: "ch7.div2.q1", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "div.frommult", params: { factor: 2 }, difficulty: 2 },
                { code: "ch7.div2.q2", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "div.fact", params: { factor: 2 }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch7-l9",
      title: "Dividing by 5 and 10",
      type: "STANDARD",
      objective: "Teach division facts for 5 and 10, and the relationship between multiplication and division.",
      missionBriefing: "Now unlock the ÷5 and ÷10 facts using what you already know about ×5 and ×10.",
      concepts: [
        {
          title: "÷5 from ×5",
          bigIdea: "Every ×5 fact has a matching ÷5 fact.",
          skills: [
            {
              code: "ch7.div5",
              title: "Divide by 5",
              description: "Use known ×5 facts to find ÷5 facts.",
              stage: "PICTORIAL",
              prerequisites: ["ch7.mult5.facts", "ch6.factfamily"],
              questions: [
                { code: "ch7.div5.q1", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "div.frommult", params: { factor: 5 }, difficulty: 2 },
                { code: "ch7.div5.q2", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "div.fact", params: { factor: 5 }, difficulty: 3 },
              ],
            },
          ],
        },
        {
          title: "÷10 from ×10",
          bigIdea: "Every ×10 fact has a matching ÷10 fact, following the same place-value pattern in reverse.",
          skills: [
            {
              code: "ch7.div10",
              title: "Divide by 10",
              description: "Use known ×10 facts to find ÷10 facts.",
              stage: "PICTORIAL",
              prerequisites: ["ch7.mult10.facts", "ch6.factfamily"],
              questions: [
                { code: "ch7.div10.q1", kind: "FILL_IN_BLANK", stage: "PICTORIAL", generatorId: "div.frommult", params: { factor: 10 }, difficulty: 2 },
                { code: "ch7.div10.q2", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "div.fact", params: { factor: 10 }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch7-l10",
      title: "Practice C",
      type: "PRACTICE",
      objective: "Mixed multiplication/division practice: ×2, ×5, ×10, ÷2, ÷5, ÷10.",
      missionBriefing: "The ultimate Realm training round — every fact you've learned, all mixed together.",
      concepts: [
        {
          title: "Mixed Fact Practice",
          bigIdea: "Fluency means recognizing which fact family applies quickly, not just computing one type.",
          skills: [
            {
              code: "ch7.mixed.practice",
              title: "Mixed ×2/×5/×10 and ÷2/÷5/÷10 practice",
              description: "Practice all six fact families together.",
              stage: "ABSTRACT",
              prerequisites: ["ch7.mult5.facts", "ch7.mult2.facts", "ch7.mult10.facts", "ch7.div2", "ch7.div5", "ch7.div10"],
              questions: [
                { code: "ch7.mixed.practice.q1", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "mixed.factdrill", params: { factors: [2, 5, 10], ops: ["x", "d"] }, difficulty: 3 },
                { code: "ch7.mixed.practice.q2", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "mixed.factdrill", params: { factors: [2, 5, 10], ops: ["x", "d"] }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch7-l11",
      title: "Word Problems",
      type: "STANDARD",
      objective: "Solve one-step word problems involving multiplication or division by 2, 5, or 10 using bar models and equal-group reasoning.",
      missionBriefing: "Real Realm quests await — use bar models to solve each one-step story problem.",
      concepts: [
        {
          title: "One-Step Word Problems",
          bigIdea: "Identify what's known and unknown, then choose multiplication or (partitive/measurement) division.",
          skills: [
            {
              code: "ch7.wordproblems",
              title: "Solve ×/÷ word problems with 2, 5, 10",
              description: "Solve one-step multiplication and division word problems using bar models.",
              stage: "PICTORIAL",
              prerequisites: ["ch7.mixed.practice"],
              questions: [
                { code: "ch7.wordproblems.q1", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "mult.wordproblem", params: { factor: 5 }, difficulty: 3 },
                { code: "ch7.wordproblems.q2", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "div.wordproblem.partitive", params: { factor: 2 }, difficulty: 3 },
                { code: "ch7.wordproblems.q3", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "div.wordproblem.measurement", params: { factor: 10 }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch7-review",
      title: "Review 2: Division Realm",
      type: "REVIEW",
      objective: "Review the complete chapter: ×2/×5/×10 tables and facts, ÷2/÷5/÷10, and word problems.",
      missionBriefing: "The Realm's final challenge — show everything you've mastered about 2s, 5s, and 10s!",
      concepts: [
        {
          title: "Full Chapter Review",
          bigIdea: "Bringing together tables, facts, division, and word problems for ×2/×5/×10.",
          skills: [
            {
              code: "ch7.review",
              title: "Chapter 7 mixed review",
              description: "Mixed practice across all Chapter 7 skills.",
              stage: "ABSTRACT",
              prerequisites: ["ch7.wordproblems"],
              questions: [
                { code: "ch7.review.q1", kind: "FILL_IN_BLANK", stage: "ABSTRACT", generatorId: "mixed.factdrill", params: { factors: [2, 5, 10], ops: ["x", "d"] }, difficulty: 4 },
                { code: "ch7.review.q2", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "mult.wordproblem", params: { factor: 2 }, difficulty: 3 },
                { code: "ch7.review.q3", kind: "WORD_PROBLEM", stage: "PICTORIAL", generatorId: "div.wordproblem.partitive", params: { factor: 5 }, difficulty: 3 },
                { code: "ch7.review.q4", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "mult.findmistake", params: { factor: 10 }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
