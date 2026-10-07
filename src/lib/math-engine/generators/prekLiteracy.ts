import type { Generator, GeneratedInstance, ValidationResult } from "../types";
import { seededRng, shuffle } from "../random";

// PreK literacy foundations that don't fit the counting/quantity generators:
// recognizing one's own written name among distractors, and telling a
// single letter apart from a whole word. Both answer by tapping plain text
// choices (the "textChoice" QuestionRenderer view) rather than typing.

const DEFAULT_NAME_POOL = ["Alex", "Sam", "Jordan", "Riley", "Max", "Ava", "Leo", "Mia", "Noah", "Ella"];

/** Tap your own name among a few distractor names. `params.studentName` (required, supplied by the server action from the student's profile) is the target; `params.distractorNames` optionally overrides the distractor pool. */
export const nameRecognize: Generator = {
  id: "prek.name.recognize",
  generate(seed, difficulty, params): GeneratedInstance {
    const studentName = typeof params.studentName === "string" && params.studentName.trim() ? params.studentName.trim() : "Friend";
    const pool = (params.distractorNames as string[] | undefined) ?? DEFAULT_NAME_POOL;
    const rng = seededRng(seed);
    const distractors = shuffle(
      rng,
      pool.filter((n) => n.toLowerCase() !== studentName.toLowerCase()),
    ).slice(0, 2);
    const choices = shuffle(rng, [studentName, ...distractors]);

    return {
      prompt: {
        view: "textChoice",
        kind: "MULTIPLE_CHOICE",
        stage: "CONCRETE",
        text: "Tap your name!",
        data: { choices },
      },
      answer: { value: studentName, explanation: `${studentName} — that's your name!` },
      meta: { studentName },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

const LETTERS = ["B", "M", "S", "T", "A", "R", "D", "G"];
const WORDS = ["cat", "sun", "dog", "hat", "run", "map", "pig", "bed"];

/** Is this a single letter, or a whole word? Teaches the letters-vs-words distinction before any phonics begins. */
export const letterOrWord: Generator = {
  id: "prek.literacy.letterOrWord",
  generate(seed): GeneratedInstance {
    const rng = seededRng(seed);
    const isLetter = rng() < 0.5;
    const sample = isLetter ? LETTERS[Math.floor(rng() * LETTERS.length)] : WORDS[Math.floor(rng() * WORDS.length)];
    const answerText = isLetter ? "A letter" : "A word";
    const choices = shuffle(rng, ["A letter", "A word"]);

    return {
      prompt: {
        view: "textChoice",
        kind: "MULTIPLE_CHOICE",
        stage: "CONCRETE",
        text: `Is "${sample}" a letter or a word?`,
        data: { choices },
      },
      answer: {
        value: answerText,
        explanation: isLetter
          ? `"${sample}" is just one letter.`
          : `"${sample}" is a word — it's made of letters put together.`,
      },
      meta: { sample, isLetter },
    };
  },
  validate(response, answer): ValidationResult {
    return { correct: response === answer.value };
  },
};

export const prekLiteracyGenerators = [nameRecognize, letterOrWord];
