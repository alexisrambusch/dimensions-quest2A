import type { Generator, GeneratedInstance, ValidationResult } from "../types";
import { seededRng, shuffle } from "../random";

// PreK "My Body" science: name a body part by what it does. Plain-text
// choices — no icons — to sidestep any emoji-rendering risk for a
// reliability-critical first-week activity.

const BODY_PART_CLUES: { clue: string; answer: string; distractors: string[] }[] = [
  { clue: "Which one helps you smell flowers?", answer: "Nose", distractors: ["Ear", "Foot"] },
  { clue: "Which one helps you listen to music?", answer: "Ears", distractors: ["Nose", "Elbow"] },
  { clue: "Which one helps you see this question?", answer: "Eyes", distractors: ["Chin", "Hand"] },
  { clue: "Which one helps you taste your food?", answer: "Tongue", distractors: ["Knee", "Ear"] },
  { clue: "Which one do you stand on?", answer: "Feet", distractors: ["Hands", "Hair"] },
  { clue: "Which one do you wave hello with?", answer: "Hand", distractors: ["Foot", "Nose"] },
];

/** "Which one helps you smell flowers?" — a clue about a body part's job, tap the matching word. */
export const bodyParts: Generator = {
  id: "prek.science.bodyParts",
  generate(seed): GeneratedInstance {
    const rng = seededRng(seed);
    const item = BODY_PART_CLUES[Math.floor(rng() * BODY_PART_CLUES.length)];
    const choices = shuffle(rng, [item.answer, ...item.distractors]);

    return {
      prompt: {
        view: "textChoice",
        kind: "MULTIPLE_CHOICE",
        stage: "CONCRETE",
        text: item.clue,
        data: { choices },
      },
      answer: { value: item.answer, explanation: `${item.answer} — ${item.clue.toLowerCase().replace("which one", "that's the part that")}` },
      meta: { answer: item.answer },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

export const prekScienceGenerators = [bodyParts];
