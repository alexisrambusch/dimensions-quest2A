import type { SkillDef } from "../skillTypes";

// Letter A: spot its shape among distractors (uppercase, then lowercase)
// before being asked to match the two cases together, and well before any
// confirmation check. "__STUDENT_NAME__" in a hunt's items is swapped for
// the real student's name server-side (see getPreschoolActivity).

export const letterSkills: SkillDef[] = [
  {
    code: "literacy.letter.recognize.A",
    domain: "LITERACY",
    title: "Recognize the letter A",
    description: "Spot uppercase and lowercase A among other letters, then match the two forms together.",
    prerequisites: [],
    activities: [
      { code: "literacy.letter.recognize.A.hunt.upper", engine: "hunt", title: "Capital A Hunt", instructions: "Tap every capital A!", difficulty: 1, content: { promptText: "Find every capital A!", items: [{ label: "A", isMatch: true }, { label: "M", isMatch: false }, { label: "S", isMatch: false }, { label: "A", isMatch: true }, { label: "T", isMatch: false }, { label: "A", isMatch: true }] } },
      { code: "literacy.letter.recognize.A.hunt.lower", engine: "hunt", title: "Lowercase a Hunt", instructions: "Tap every lowercase a!", difficulty: 2, content: { promptText: "Find every lowercase a!", items: [{ label: "a", isMatch: true }, { label: "m", isMatch: false }, { label: "e", isMatch: false }, { label: "a", isMatch: true }, { label: "o", isMatch: false }, { label: "a", isMatch: true }] } },
      { code: "literacy.letter.recognize.A.match", engine: "matchPairs", title: "Big A, Little a", instructions: "Tap a capital letter, then tap its lowercase partner.", difficulty: 2, content: { pairs: [{ left: "A", right: "a" }, { left: "M", right: "m" }, { left: "S", right: "s" }] } },
      { code: "literacy.letter.recognize.A.trace", engine: "trace", title: "Trace the A", instructions: "Trace the letter A with your finger.", difficulty: 1, content: { target: "A" } },
      { code: "literacy.letter.recognize.A.check", engine: "tapAnswer", title: "Which Letter?", instructions: "Tap the letter A.", difficulty: 2, isCheck: true, content: { promptText: "Which letter is A?", choices: ["M", "A", "S"], correctIndex: 1, hint: "A has two slanted lines that meet at the top, with a line across the middle." } },
    ],
  },
  {
    code: "literacy.name.recognize",
    domain: "LITERACY",
    title: "Recognize your name",
    description: "Spot your own written name among other names, then trace it.",
    prerequisites: [],
    activities: [
      { code: "literacy.name.recognize.hunt", engine: "hunt", title: "Find Your Name", instructions: "Tap your name every time you see it!", difficulty: 1, content: { promptText: "Find your name!", items: [{ label: "__STUDENT_NAME__", isMatch: true }, { label: "Sam", isMatch: false }, { label: "Max", isMatch: false }, { label: "__STUDENT_NAME__", isMatch: true }, { label: "Mia", isMatch: false }] } },
      { code: "literacy.name.recognize.trace", engine: "trace", title: "Trace Your Name", instructions: "Trace your name with your finger.", difficulty: 1, content: { target: "name" } },
    ],
  },
];
