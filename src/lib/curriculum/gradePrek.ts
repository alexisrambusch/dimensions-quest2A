import type { GradeDef } from "./types";
import { pkch1 } from "./chaptersPrek/ch1";

// PreK Explorers — an original early-childhood track for a 4-year-old,
// covering the same ground as well-loved preschool programs (counting,
// numeral recognition, comparing quantities, and later letters, shapes,
// colors, and sorting) with activities built from scratch for this app
// rather than reproducing any other curriculum's content. Every question
// answers by tapping a big button — no free-text typing — since that's the
// right interaction for a child who may not yet read or type reliably.
export const gradePrek: GradeDef = {
  name: "PreK",
  sequence: "PreK Explorers",
  chapters: [pkch1],
};
