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
      { code: "literacy.letter.recognize.A.hunt.upper", engine: "hunt", title: "Capital A Hunt", instructions: "Tap every capital A!", difficulty: 1, content: { promptText: "Find every capital A!", targetVisual: "A", items: [{ label: "A", isMatch: true }, { label: "M", isMatch: false }, { label: "S", isMatch: false }, { label: "A", isMatch: true }, { label: "T", isMatch: false }, { label: "A", isMatch: true }] } },
      { code: "literacy.letter.recognize.A.hunt.lower", engine: "hunt", title: "Lowercase a Hunt", instructions: "Tap every lowercase a!", difficulty: 2, content: { promptText: "Find every lowercase a!", targetVisual: "a", items: [{ label: "a", isMatch: true }, { label: "m", isMatch: false }, { label: "e", isMatch: false }, { label: "a", isMatch: true }, { label: "o", isMatch: false }, { label: "a", isMatch: true }] } },
      { code: "literacy.letter.recognize.A.match", engine: "matchPairs", title: "Big A, Little a", instructions: "Tap a capital letter, then tap its lowercase partner.", difficulty: 2, content: { pairs: [{ left: "A", right: "a" }, { left: "M", right: "m" }, { left: "S", right: "s" }] } },
      { code: "literacy.letter.recognize.A.trace", engine: "trace", title: "Trace the A", instructions: "Trace the letter A with your finger.", difficulty: 1, content: { target: "A" } },
      { code: "literacy.letter.recognize.A.check", engine: "tapAnswer", title: "Which Letter?", instructions: "Tap the letter A.", difficulty: 2, isCheck: true, content: { promptText: "Which letter is A?", choices: ["M", "A", "S"], correctIndex: 1, hint: "A has two slanted lines that meet at the top, with a line across the middle." } },
    ],
  },
  {
    code: "literacy.letter.recognize.M",
    domain: "LITERACY",
    title: "Recognize the letter M",
    description: "Spot uppercase and lowercase M among other letters, then match the two forms together.",
    prerequisites: [],
    activities: [
      { code: "literacy.letter.recognize.M.hunt.upper", engine: "hunt", title: "Capital M Hunt", instructions: "Tap every capital M!", difficulty: 1, content: { promptText: "Find every capital M!", targetVisual: "M", items: [{ label: "M", isMatch: true }, { label: "A", isMatch: false }, { label: "W", isMatch: false }, { label: "M", isMatch: true }, { label: "N", isMatch: false }, { label: "M", isMatch: true }] } },
      { code: "literacy.letter.recognize.M.hunt.lower", engine: "hunt", title: "Lowercase m Hunt", instructions: "Tap every lowercase m!", difficulty: 2, content: { promptText: "Find every lowercase m!", targetVisual: "m", items: [{ label: "m", isMatch: true }, { label: "n", isMatch: false }, { label: "w", isMatch: false }, { label: "m", isMatch: true }, { label: "r", isMatch: false }, { label: "m", isMatch: true }] } },
      { code: "literacy.letter.recognize.M.match", engine: "matchPairs", title: "Big M, Little m", instructions: "Tap a capital letter, then tap its lowercase partner.", difficulty: 2, content: { pairs: [{ left: "M", right: "m" }, { left: "A", right: "a" }, { left: "S", right: "s" }] } },
      { code: "literacy.letter.recognize.M.trace", engine: "trace", title: "Trace the M", instructions: "Trace the letter M with your finger.", difficulty: 1, content: { target: "M" } },
      { code: "literacy.letter.recognize.M.check", engine: "tapAnswer", title: "Which Letter?", instructions: "Tap the letter M.", difficulty: 2, isCheck: true, content: { promptText: "Which letter is M?", choices: ["N", "M", "W"], correctIndex: 1, hint: "M has two tall lines with a zigzag dipping down in the middle." } },
    ],
  },
  {
    code: "literacy.letter.recognize.S",
    domain: "LITERACY",
    title: "Recognize the letter S",
    description: "Spot uppercase and lowercase S among other letters, then match the two forms together.",
    prerequisites: [],
    activities: [
      { code: "literacy.letter.recognize.S.hunt.upper", engine: "hunt", title: "Capital S Hunt", instructions: "Tap every capital S!", difficulty: 1, content: { promptText: "Find every capital S!", targetVisual: "S", items: [{ label: "S", isMatch: true }, { label: "A", isMatch: false }, { label: "M", isMatch: false }, { label: "S", isMatch: true }, { label: "T", isMatch: false }, { label: "S", isMatch: true }] } },
      { code: "literacy.letter.recognize.S.hunt.lower", engine: "hunt", title: "Lowercase s Hunt", instructions: "Tap every lowercase s!", difficulty: 2, content: { promptText: "Find every lowercase s!", targetVisual: "s", items: [{ label: "s", isMatch: true }, { label: "e", isMatch: false }, { label: "a", isMatch: false }, { label: "s", isMatch: true }, { label: "o", isMatch: false }, { label: "s", isMatch: true }] } },
      { code: "literacy.letter.recognize.S.match", engine: "matchPairs", title: "Big S, Little s", instructions: "Tap a capital letter, then tap its lowercase partner.", difficulty: 2, content: { pairs: [{ left: "S", right: "s" }, { left: "A", right: "a" }, { left: "M", right: "m" }] } },
      { code: "literacy.letter.recognize.S.trace", engine: "trace", title: "Trace the S", instructions: "Trace the letter S with your finger.", difficulty: 1, content: { target: "S" } },
      { code: "literacy.letter.recognize.S.check", engine: "tapAnswer", title: "Which Letter?", instructions: "Tap the letter S.", difficulty: 2, isCheck: true, content: { promptText: "Which letter is S?", choices: ["A", "M", "S"], correctIndex: 2, hint: "S curves like a snake — one curve one way, then the other." } },
    ],
  },
  {
    code: "literacy.letter.recognize.T",
    domain: "LITERACY",
    title: "Recognize the letter T",
    description: "Spot uppercase and lowercase T among other letters, then match the two forms together.",
    prerequisites: [],
    activities: [
      { code: "literacy.letter.recognize.T.hunt.upper", engine: "hunt", title: "Capital T Hunt", instructions: "Tap every capital T!", difficulty: 1, content: { promptText: "Find every capital T!", targetVisual: "T", items: [{ label: "T", isMatch: true }, { label: "A", isMatch: false }, { label: "S", isMatch: false }, { label: "T", isMatch: true }, { label: "M", isMatch: false }, { label: "T", isMatch: true }] } },
      { code: "literacy.letter.recognize.T.hunt.lower", engine: "hunt", title: "Lowercase t Hunt", instructions: "Tap every lowercase t!", difficulty: 2, content: { promptText: "Find every lowercase t!", targetVisual: "t", items: [{ label: "t", isMatch: true }, { label: "i", isMatch: false }, { label: "l", isMatch: false }, { label: "t", isMatch: true }, { label: "f", isMatch: false }, { label: "t", isMatch: true }] } },
      { code: "literacy.letter.recognize.T.match", engine: "matchPairs", title: "Big T, Little t", instructions: "Tap a capital letter, then tap its lowercase partner.", difficulty: 2, content: { pairs: [{ left: "T", right: "t" }, { left: "S", right: "s" }, { left: "M", right: "m" }] } },
      { code: "literacy.letter.recognize.T.trace", engine: "trace", title: "Trace the T", instructions: "Trace the letter T with your finger.", difficulty: 1, content: { target: "T" } },
      { code: "literacy.letter.recognize.T.check", engine: "tapAnswer", title: "Which Letter?", instructions: "Tap the letter T.", difficulty: 2, isCheck: true, content: { promptText: "Which letter is T?", choices: ["T", "M", "S"], correctIndex: 0, hint: "T has one line across the top and one line straight down the middle." } },
    ],
  },
  {
    code: "literacy.letter.recognize.P",
    domain: "LITERACY",
    title: "Recognize the letter P",
    description: "Spot uppercase and lowercase P among other letters, then match the two forms together.",
    prerequisites: [],
    activities: [
      { code: "literacy.letter.recognize.P.hunt.upper", engine: "hunt", title: "Capital P Hunt", instructions: "Tap every capital P!", difficulty: 1, content: { promptText: "Find every capital P!", targetVisual: "P", items: [{ label: "P", isMatch: true }, { label: "T", isMatch: false }, { label: "S", isMatch: false }, { label: "P", isMatch: true }, { label: "M", isMatch: false }, { label: "P", isMatch: true }] } },
      { code: "literacy.letter.recognize.P.hunt.lower", engine: "hunt", title: "Lowercase p Hunt", instructions: "Tap every lowercase p!", difficulty: 2, content: { promptText: "Find every lowercase p!", targetVisual: "p", items: [{ label: "p", isMatch: true }, { label: "q", isMatch: false }, { label: "b", isMatch: false }, { label: "p", isMatch: true }, { label: "d", isMatch: false }, { label: "p", isMatch: true }] } },
      { code: "literacy.letter.recognize.P.match", engine: "matchPairs", title: "Big P, Little p", instructions: "Tap a capital letter, then tap its lowercase partner.", difficulty: 2, content: { pairs: [{ left: "P", right: "p" }, { left: "T", right: "t" }, { left: "S", right: "s" }] } },
      { code: "literacy.letter.recognize.P.trace", engine: "trace", title: "Trace the P", instructions: "Trace the letter P with your finger.", difficulty: 1, content: { target: "P" } },
      { code: "literacy.letter.recognize.P.check", engine: "tapAnswer", title: "Which Letter?", instructions: "Tap the letter P.", difficulty: 2, isCheck: true, content: { promptText: "Which letter is P?", choices: ["P", "T", "S"], correctIndex: 0, hint: "P has one straight line down, with a bump at the top." } },
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
