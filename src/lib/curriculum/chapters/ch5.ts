import type { ChapterDef } from "../types";

export const ch5: ChapterDef = {
  code: "ch5",
  title: "Weight",
  description: "Understand and estimate weight in grams, kilograms, ounces, and pounds using familiar objects.",
  worldName: "Weight Works",
  worldTheme: "factory",
  lessons: [
    {
      code: "ch5-l1",
      title: "Grams and Kilograms",
      type: "STANDARD",
      objective: "Decide whether grams or kilograms is the reasonable unit for weighing an object.",
      missionBriefing: "The Weight Works factory needs help sorting objects onto the right scale!",
      workedExample: {
        problem: "Would you weigh a paperclip in grams or kilograms? What about a bicycle?",
        steps: [
          "Grams are for light things — a paperclip weighs about 1 gram.",
          "Kilograms are for heavier things — about the weight of a liter bottle of water, or more.",
          "A paperclip is very light, so grams make sense for it.",
          "A bicycle is much heavier, so kilograms make more sense there.",
        ],
        answer: "Paperclip → grams. Bicycle → kilograms.",
      },
      concepts: [
        {
          title: "Grams vs. Kilograms",
          bigIdea: "Light things are weighed in grams; heavier things are weighed in kilograms.",
          skills: [
            {
              code: "ch5.chooseunit",
              title: "Choose grams or kilograms",
              description: "Select the reasonable unit for weighing a given object.",
              stage: "ABSTRACT",
              prerequisites: [],
              questions: [
                { code: "ch5.chooseunit.q1", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "weight.chooseunit", params: { system: "metric" }, difficulty: 1 },
                { code: "ch5.chooseunit.q2", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "weight.chooseunit", params: { system: "metric" }, difficulty: 2 },
                { code: "ch5.chooseunit.q3", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "weight.chooseunit", params: { system: "metric" }, difficulty: 3 },
                { code: "ch5.chooseunit.q4", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "weight.reasonableestimate", params: { unit: "kg" }, difficulty: 3 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch5-l2",
      title: "Estimating Weight",
      type: "STANDARD",
      objective: "Reason about whether familiar objects weigh more or less than one kilogram.",
      missionBriefing: "Before you weigh it for real, guess: is it heavier or lighter than a kilogram bag of rice?",
      workedExample: {
        problem: "A toy box balances exactly against these weights: 100 g, 20 g, 20 g, and 5 g. How much does the toy box weigh?",
        steps: [
          "When a scale balances, both sides weigh the same amount.",
          "To find the toy box's weight, add up all the weights on the other side.",
          "Add them one at a time: 100 + 20 = 120.",
          "120 + 20 = 140, then 140 + 5 = 145.",
        ],
        answer: "The toy box weighs 145 g.",
      },
      concepts: [
        {
          title: "Reasoning About Weight",
          bigIdea: "Comparing an object to a familiar 1-kilogram benchmark builds a real sense of weight.",
          skills: [
            {
              code: "ch5.estimate",
              title: "Estimate weight relative to 1 kilogram",
              description: "Decide whether an object weighs more or less than 1 kilogram.",
              stage: "PICTORIAL",
              prerequisites: ["ch5.chooseunit"],
              questions: [
                { code: "ch5.estimate.q1", kind: "ESTIMATION", stage: "PICTORIAL", generatorId: "weight.estimate", params: { system: "metric" }, difficulty: 1 },
                { code: "ch5.estimate.q2", kind: "ESTIMATION", stage: "PICTORIAL", generatorId: "weight.estimate", params: { system: "metric" }, difficulty: 2 },
                { code: "ch5.estimate.q3", kind: "ESTIMATION", stage: "PICTORIAL", generatorId: "weight.estimate", params: { system: "metric" }, difficulty: 3 },
                { code: "ch5.estimate.q4", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "weight.sumblocks", params: { system: "metric" }, difficulty: 3 },
                { code: "ch5.estimate.q5", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "weight.missingbalance", params: { system: "metric" }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch5-l3",
      title: "Ounces and Pounds",
      type: "STANDARD",
      objective: "Choose between ounces and pounds, and estimate weight relative to one pound.",
      missionBriefing: "The factory just got a shipment measured in pounds — help sort it out!",
      workedExample: {
        problem: "Would you weigh a strawberry in ounces or pounds? What about a cat?",
        steps: [
          "Ounces are for light things, just like grams. Pounds are for heavier things, like kilograms.",
          "A strawberry is light, so ounces make sense for it.",
          "A cat weighs around 9 pounds — much more than 1 pound — so pounds make more sense there.",
        ],
        answer: "Strawberry → ounces. Cat → pounds.",
      },
      concepts: [
        {
          title: "Customary Weight",
          bigIdea: "Ounces and pounds measure the same kinds of things as grams and kilograms, just in different-sized steps.",
          skills: [
            {
              code: "ch5.chooseunit.customary",
              title: "Choose ounces or pounds",
              description: "Select the reasonable customary unit for weighing a given object.",
              stage: "ABSTRACT",
              prerequisites: ["ch5.chooseunit"],
              questions: [
                { code: "ch5.chooseunit.customary.q1", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "weight.chooseunit", params: { system: "customary" }, difficulty: 1 },
                { code: "ch5.chooseunit.customary.q2", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "weight.chooseunit", params: { system: "customary" }, difficulty: 2 },
                { code: "ch5.chooseunit.customary.q3", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "weight.chooseunit", params: { system: "customary" }, difficulty: 3 },
                { code: "ch5.chooseunit.customary.q4", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "weight.reasonableestimate", params: { unit: "lb" }, difficulty: 3 },
              ],
            },
            {
              code: "ch5.estimate.customary",
              title: "Estimate weight relative to 1 pound",
              description: "Decide whether an object weighs more or less than 1 pound.",
              stage: "PICTORIAL",
              prerequisites: ["ch5.estimate"],
              questions: [
                { code: "ch5.estimate.customary.q1", kind: "ESTIMATION", stage: "PICTORIAL", generatorId: "weight.estimate", params: { system: "customary" }, difficulty: 1 },
                { code: "ch5.estimate.customary.q2", kind: "ESTIMATION", stage: "PICTORIAL", generatorId: "weight.estimate", params: { system: "customary" }, difficulty: 2 },
                { code: "ch5.estimate.customary.q3", kind: "ESTIMATION", stage: "PICTORIAL", generatorId: "weight.estimate", params: { system: "customary" }, difficulty: 3 },
                { code: "ch5.estimate.customary.q4", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "weight.sumblocks", params: { system: "customary" }, difficulty: 3 },
                { code: "ch5.estimate.customary.q5", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "weight.compareobjects", params: { system: "customary" }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch5-review",
      title: "Chapter Review: Weight Works",
      type: "REVIEW",
      objective: "Review choosing units and estimating weight across metric and customary systems.",
      missionBriefing: "Show the Weight Works crew what you've learned about grams, kilograms, ounces, and pounds!",
      workedExample: {
        problem: "Quick recap: how do you decide a unit, and how do you find an unknown weight?",
        steps: [
          "Light objects use small units (grams or ounces); heavy objects use big units (kilograms or pounds).",
          "To estimate, compare the object to a familiar benchmark like 1 kilogram or 1 pound.",
          "If a scale balances, add up all the known weights on one side to find the total.",
          "If one weight is missing, subtract the known weights from the total to find it.",
        ],
        answer: "Pick the right-sized unit, compare to a benchmark, and add or subtract the known weights.",
      },
      concepts: [
        {
          title: "Mixed Review",
          bigIdea: "Bringing together unit choice and weight estimation.",
          skills: [
            {
              code: "ch5.review",
              title: "Chapter 5 mixed review",
              description: "Mixed practice across Chapter 5 skills.",
              stage: "ABSTRACT",
              prerequisites: ["ch5.estimate", "ch5.estimate.customary"],
              questions: [
                { code: "ch5.review.q1", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "weight.chooseunit", params: { system: "metric" }, difficulty: 2 },
                { code: "ch5.review.q2", kind: "ESTIMATION", stage: "PICTORIAL", generatorId: "weight.estimate", params: { system: "metric" }, difficulty: 2 },
                { code: "ch5.review.q3", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "weight.chooseunit", params: { system: "customary" }, difficulty: 2 },
                { code: "ch5.review.q4", kind: "ESTIMATION", stage: "PICTORIAL", generatorId: "weight.estimate", params: { system: "customary" }, difficulty: 2 },
                { code: "ch5.review.q5", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "weight.reasonableestimate", params: { unit: "g" }, difficulty: 4 },
                { code: "ch5.review.q6", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "weight.missingbalance", params: { system: "metric" }, difficulty: 5 },
                { code: "ch5.review.q7", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "weight.compareobjects", params: { system: "metric" }, difficulty: 4 },
                { code: "ch5.review.q8", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "weight.sumblocks", params: { system: "customary" }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
