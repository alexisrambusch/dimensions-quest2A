import type { SkillDef } from "../skillTypes";

// Numbers 1-5: count by doing (sticker placement) before recognizing a
// numeral's shape, and recognize a numeral's shape before being asked to
// match it to a quantity. A tapAnswer confirmation check is the LAST
// activity in each skill, not the first — it only ever shows up after the
// teaching games above it, and the mastery engine won't serve it at all
// until the skill is already at PRACTICING.

export const numberSkills: SkillDef[] = [
  {
    code: "math.count.subitize.1to3",
    domain: "MATH",
    title: "Count groups of 1 to 3",
    description: "Place stickers one at a time to build a group of a given size.",
    prerequisites: [],
    activities: [
      { code: "math.count.subitize.1to3.sticker.1", engine: "stickerCount", title: "Fill the Pond", instructions: "Tap lily pads to put 2 frogs in the pond.", difficulty: 1, content: { targetCount: 2, sceneLabel: "the pond", trayCount: 4 } },
      { code: "math.count.subitize.1to3.sticker.2", engine: "stickerCount", title: "Decorate the Sky", instructions: "Tap to put 3 stars in the sky.", difficulty: 2, content: { targetCount: 3, sceneLabel: "the night sky", trayCount: 5 } },
      { code: "math.count.subitize.1to3.sticker.3", engine: "stickerCount", title: "Build a Tower", instructions: "Tap to stack 1 block.", difficulty: 1, content: { targetCount: 1, sceneLabel: "the tower", trayCount: 3 } },
    ],
  },
  {
    code: "math.count.subitize.4to5",
    domain: "MATH",
    title: "Count groups of 4 to 5",
    description: "Place stickers one at a time to build a bigger group.",
    prerequisites: ["math.count.subitize.1to3"],
    activities: [
      { code: "math.count.subitize.4to5.sticker.1", engine: "stickerCount", title: "Feed the Puppies", instructions: "Tap to give 4 treats to the puppies.", difficulty: 1, content: { targetCount: 4, sceneLabel: "the puppies", trayCount: 6 } },
      { code: "math.count.subitize.4to5.sticker.2", engine: "stickerCount", title: "Plant the Garden", instructions: "Tap to plant 5 flowers.", difficulty: 2, content: { targetCount: 5, sceneLabel: "the garden", trayCount: 7 } },
    ],
  },
  {
    code: "math.numeral.recognize.1to5",
    domain: "MATH",
    title: "Recognize the numbers 1-5",
    description: "Spot a numeral's shape, then match it to how many it means.",
    prerequisites: ["math.count.subitize.1to3"],
    activities: [
      { code: "math.numeral.recognize.1to5.hunt.3", engine: "hunt", title: "Number Hunt: 3", instructions: "Tap every 3 you can find!", difficulty: 1, content: { promptText: "Find every number 3!", items: [{ label: "3", isMatch: true }, { label: "1", isMatch: false }, { label: "3", isMatch: true }, { label: "2", isMatch: false }, { label: "3", isMatch: true }, { label: "5", isMatch: false }] } },
      { code: "math.numeral.recognize.1to5.hunt.5", engine: "hunt", title: "Number Hunt: 5", instructions: "Tap every 5 you can find!", difficulty: 2, content: { promptText: "Find every number 5!", items: [{ label: "5", isMatch: true }, { label: "2", isMatch: false }, { label: "4", isMatch: false }, { label: "5", isMatch: true }, { label: "1", isMatch: false }, { label: "5", isMatch: true }] } },
      { code: "math.numeral.recognize.1to5.match", engine: "matchPairs", title: "Match the Number", instructions: "Tap a number, then tap the dots that match.", difficulty: 2, content: { pairs: [{ left: "1", right: "●" }, { left: "2", right: "●●" }, { left: "3", right: "●●●" }] } },
      { code: "math.numeral.recognize.1to5.check", engine: "tapAnswer", title: "Which Number?", instructions: "Tap the number 4.", difficulty: 2, isCheck: true, content: { promptText: "Which number is 4?", choices: ["2", "4", "7"], correctIndex: 1, hint: "4 has two short lines that cross, then one line down the side." } },
    ],
  },
];
