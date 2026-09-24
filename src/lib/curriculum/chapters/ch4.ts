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
      workedExample: {
        problem: "Would you measure a paperclip in centimeters or meters? What about the length of a hallway?",
        steps: [
          { text: "Centimeters are for small things — about the size of your finger or smaller steps." },
          { text: "Meters are for long things — hallways, pools, whole rooms." },
          {
            text: "A paperclip is tiny, so centimeters make sense for it.",
            visual: { view: "rulerMeasure", data: { object: "paperclip", icon: "paperclip", actualLength: 3, maxLength: 8, unitLabel: "cm" } },
          },
          {
            text: "A hallway is long, so meters make more sense there — a meter is much bigger than a centimeter.",
            visual: { view: "equals", data: { left: "1 m", right: "100 cm" } },
          },
        ],
        answer: "Paperclip → centimeters. Hallway → meters.",
      },
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
                { code: "ch4.chooseunit.q3", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "length.chooseunit", params: { system: "metric" }, difficulty: 3 },
                { code: "ch4.chooseunit.q4", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "length.reasonableestimate", params: { unit: "m" }, difficulty: 3 },
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
      workedExample: {
        problem: "About how long is a crayon? Estimate first, then check with a ruler.",
        steps: [
          { text: "A centimeter is about the width of your smallest fingernail — use that as a mental ruler." },
          { text: "A crayon looks like it's about as long as 8 fingernail-widths in a row." },
          { text: "So a good estimate is about 8 centimeters." },
          {
            text: "Now check with the real ruler: line up one end at 0, and read where the other end lands.",
            visual: { view: "rulerMeasure", data: { object: "crayon", icon: "crayon", actualLength: 8, maxLength: 12, unitLabel: "cm" } },
          },
        ],
        answer: "The crayon is about 8 cm long — checking confirms the estimate.",
        answerVisual: { view: "compareNumbers", data: { a: "estimate: 8 cm", b: "measured: 8 cm", symbol: "=" } },
      },
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
                { code: "ch4.estimate.measure.q3", kind: "ESTIMATION", stage: "CONCRETE", generatorId: "length.estimatemeasure", params: { unit: "cm" }, difficulty: 3 },
                { code: "ch4.estimate.measure.q4", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "length.rulerfindmistake", params: { unit: "cm" }, difficulty: 3 },
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
      workedExample: {
        problem: "Would you measure a pencil in inches or feet? About how many inches long is it?",
        steps: [
          { text: "Inches are for small things, just like centimeters. Feet are for longer things, like meters." },
          { text: "A pencil is small, so inches make sense here." },
          { text: "A typical pencil is a little longer than your hand — about 7 inches." },
          {
            text: "Check with the inch ruler: line up one end at 0 and read where it ends.",
            visual: { view: "rulerMeasure", data: { object: "pencil", icon: "pencil", actualLength: 7, maxLength: 10, unitLabel: "in" } },
          },
        ],
        answer: "Use inches — a pencil is about 7 inches long.",
        answerVisual: { view: "equals", data: { left: "1 ft", right: "12 in" } },
      },
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
                { code: "ch4.chooseunit.customary.q3", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "length.chooseunit", params: { system: "customary" }, difficulty: 3 },
                { code: "ch4.chooseunit.customary.q4", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "length.reasonableestimate", params: { unit: "in" }, difficulty: 3 },
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
                { code: "ch4.estimate.measure.inches.q3", kind: "ESTIMATION", stage: "CONCRETE", generatorId: "length.estimatemeasure", params: { unit: "in" }, difficulty: 3 },
                { code: "ch4.estimate.measure.inches.q4", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "length.rulerfindmistake", params: { unit: "in" }, difficulty: 3 },
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
      workedExample: {
        problem: "A pencil is 18 cm long. A crayon is 9 cm long. Which is longer, and by how many centimeters?",
        steps: [
          { text: "Both lengths are already in the same unit (centimeters), so you can compare the numbers directly." },
          {
            text: "18 is greater than 9, so the pencil is longer.",
            visual: { view: "barModelCompare", data: { larger: 18, smaller: 9 } },
          },
          { text: "To find how much longer, subtract: 18 − 9." },
          {
            text: "18 − 9 = 9.",
            visual: { view: "compareNumbers", data: { a: "18 − 9", b: 9, symbol: "=" } },
          },
        ],
        answer: "The pencil is longer, by 9 cm.",
        answerVisual: { view: "barModelCompare", data: { larger: 18, smaller: 9 } },
      },
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
                { code: "ch4.compare.q3", kind: "MULTIPLE_CHOICE", stage: "PICTORIAL", generatorId: "length.comparethree", params: { unit: "cm", mode: "longest" }, difficulty: 3 },
                { code: "ch4.compare.q4", kind: "MULTIPLE_CHOICE", stage: "PICTORIAL", generatorId: "length.comparethree", params: { unit: "in", mode: "shortest" }, difficulty: 3 },
                { code: "ch4.compare.q5", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "length.difference", params: { unit: "cm" }, difficulty: 3 },
                { code: "ch4.compare.q6", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "length.difference", params: { unit: "in" }, difficulty: 4 },
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
      workedExample: {
        problem: "Quick recap: how do you decide what unit to use, and how do you compare lengths?",
        steps: [
          {
            text: "Small objects use small units (centimeters or inches); long distances use big units (meters or feet).",
            visual: { view: "rulerMeasure", data: { object: "paperclip", icon: "paperclip", actualLength: 3, maxLength: 8, unitLabel: "cm" } },
          },
          {
            text: "To estimate, compare the object to something familiar you already know the size of.",
            visual: { view: "rulerMeasure", data: { object: "crayon", icon: "crayon", actualLength: 8, maxLength: 12, unitLabel: "cm" } },
          },
          {
            text: "To compare two measured lengths in the same unit, just compare the numbers.",
            visual: { view: "barModelCompare", data: { larger: 18, smaller: 9 } },
          },
          {
            text: "To find 'how much longer,' subtract the shorter length from the longer one.",
            visual: { view: "compareNumbers", data: { a: "18 − 9", b: 9, symbol: "=" } },
          },
        ],
        answer: "Pick the right-sized unit, estimate from something familiar, then compare or subtract the numbers.",
      },
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
                { code: "ch4.review.q5", kind: "MULTIPLE_CHOICE", stage: "ABSTRACT", generatorId: "length.reasonableestimate", params: { unit: "m" }, difficulty: 4 },
                { code: "ch4.review.q6", kind: "FIND_THE_MISTAKE", stage: "ABSTRACT", generatorId: "length.rulerfindmistake", params: { unit: "cm" }, difficulty: 4 },
                { code: "ch4.review.q7", kind: "MULTIPLE_CHOICE", stage: "PICTORIAL", generatorId: "length.comparethree", params: { unit: "cm", mode: "longest" }, difficulty: 4 },
                { code: "ch4.review.q8", kind: "WORD_PROBLEM", stage: "ABSTRACT", generatorId: "length.difference", params: { unit: "in" }, difficulty: 4 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
