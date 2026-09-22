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
              ],
            },
          ],
        },
      ],
    },
  ],
};
