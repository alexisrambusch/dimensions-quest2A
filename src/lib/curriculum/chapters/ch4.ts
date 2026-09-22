import type { ChapterDef } from "../types";

export const ch4: ChapterDef = {
  code: "ch4",
  title: "Length",
  description: "Estimate and measure length in centimeters, meters, inches, and feet; choose appropriate units and compare lengths.",
  worldName: "Measurement Island",
  worldTheme: "island",
  lessons: [
    {
      code: "ch4-l1",
      title: "Centimeters and Meters",
      type: "STANDARD",
      objective: "Decide whether centimeters or meters is the reasonable unit for measuring an object.",
      missionBriefing: "The Island surveyors need help picking the right measuring tool for each job.",
      concepts: [
        {
          title: "Centimeters vs. Meters",
          bigIdea: "Small things are measured in centimeters; long distances are measured in meters.",
          skills: [
            {
              code: "ch4.chooseunit",
              title: "Choose centimeters or meters",
              description: "Select the reasonable unit for measuring a given object or distance.",
              stage: "ABSTRACT",
              prerequisites: [],
              questions: [
                { code: "ch4.chooseunit.q1", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "length.chooseunit", params: { system: "metric" }, difficulty: 1 },
                { code: "ch4.chooseunit.q2", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "length.chooseunit", params: { system: "metric" }, difficulty: 2 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch4-l2",
      title: "Estimate, Then Measure (Centimeters)",
      type: "STANDARD",
      objective: "Estimate an object's length in centimeters, then measure it with a ruler and compare.",
      missionBriefing: "Guess how long each Island object is, then check yourself with the ruler!",
      concepts: [
        {
          title: "Estimating Before Measuring",
          bigIdea: "A good estimate comes before an exact measurement — and checking the two builds a feel for length.",
          skills: [
            {
              code: "ch4.estimate.measure",
              title: "Estimate then measure length in centimeters",
              description: "Estimate an object's length, then use a virtual ruler to measure it precisely.",
              stage: "CONCRETE",
              prerequisites: ["ch4.chooseunit"],
              questions: [
                { code: "ch4.estimate.measure.q1", kind: "ESTIMATION", stage: "CONCRETE", generatorId: "length.estimatemeasure", params: { unit: "cm" }, difficulty: 1 },
                { code: "ch4.estimate.measure.q2", kind: "ESTIMATION", stage: "CONCRETE", generatorId: "length.estimatemeasure", params: { unit: "cm" }, difficulty: 2 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch4-l3",
      title: "Inches and Feet",
      type: "STANDARD",
      objective: "Choose between inches and feet, and measure objects in inches with a ruler.",
      missionBriefing: "The Island's American visitors measure things a different way — inches and feet! Give it a try.",
      concepts: [
        {
          title: "Customary Units",
          bigIdea: "Inches and feet measure the same kinds of things as centimeters and meters, just in different-sized steps.",
          skills: [
            {
              code: "ch4.chooseunit.customary",
              title: "Choose inches or feet",
              description: "Select the reasonable customary unit for measuring a given object or distance.",
              stage: "ABSTRACT",
              prerequisites: ["ch4.chooseunit"],
              questions: [
                { code: "ch4.chooseunit.customary.q1", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "length.chooseunit", params: { system: "customary" }, difficulty: 1 },
                { code: "ch4.chooseunit.customary.q2", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "length.chooseunit", params: { system: "customary" }, difficulty: 2 },
              ],
            },
            {
              code: "ch4.estimate.measure.inches",
              title: "Estimate then measure length in inches",
              description: "Estimate an object's length, then use a virtual ruler marked in inches to measure it precisely.",
              stage: "CONCRETE",
              prerequisites: ["ch4.estimate.measure"],
              questions: [
                { code: "ch4.estimate.measure.inches.q1", kind: "ESTIMATION", stage: "CONCRETE", generatorId: "length.estimatemeasure", params: { unit: "in" }, difficulty: 1 },
                { code: "ch4.estimate.measure.inches.q2", kind: "ESTIMATION", stage: "CONCRETE", generatorId: "length.estimatemeasure", params: { unit: "in" }, difficulty: 2 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch4-l4",
      title: "Comparing Lengths",
      type: "PRACTICE",
      objective: "Compare the lengths of two objects and identify which is longer.",
      missionBriefing: "Line up two Island objects side by side — which one wins the length contest?",
      concepts: [
        {
          title: "Longer and Shorter",
          bigIdea: "Comparing lengths means measuring both objects in the same unit, then comparing the numbers.",
          skills: [
            {
              code: "ch4.compare",
              title: "Compare lengths of two objects",
              description: "Given two measured objects, identify which is longer.",
              stage: "PICTORIAL",
              prerequisites: ["ch4.estimate.measure"],
              questions: [
                { code: "ch4.compare.q1", kind: "MULTIPLE_CHOICE", stage: "PICTORIAL", generatorId: "length.compare", params: { unit: "cm" }, difficulty: 1 },
                { code: "ch4.compare.q2", kind: "MULTIPLE_CHOICE", stage: "PICTORIAL", generatorId: "length.compare", params: { unit: "in" }, difficulty: 2 },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "ch4-review",
      title: "Chapter Review: Measurement Island",
      type: "REVIEW",
      objective: "Review choosing units, estimating/measuring length, and comparing lengths.",
      missionBriefing: "Show the Island surveyors everything you've learned about length!",
      concepts: [
        {
          title: "Mixed Review",
          bigIdea: "Bringing together unit choice, measurement, and comparison skills.",
          skills: [
            {
              code: "ch4.review",
              title: "Chapter 4 mixed review",
              description: "Mixed practice across Chapter 4 skills.",
              stage: "ABSTRACT",
              prerequisites: ["ch4.estimate.measure.inches", "ch4.compare"],
              questions: [
                { code: "ch4.review.q1", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "length.chooseunit", params: { system: "metric" }, difficulty: 2 },
                { code: "ch4.review.q2", kind: "ESTIMATION", stage: "CONCRETE", generatorId: "length.estimatemeasure", params: { unit: "cm" }, difficulty: 2 },
                { code: "ch4.review.q3", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "length.chooseunit", params: { system: "customary" }, difficulty: 2 },
                { code: "ch4.review.q4", kind: "MULTIPLE_CHOICE", stage: "PICTORIAL", generatorId: "length.compare", params: { unit: "cm" }, difficulty: 2 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
