import type { GradeDef } from "./types";
import { g1ch1 } from "./chapters1a/ch1";
import { g1ch2 } from "./chapters1a/ch2";
import { g1ch3 } from "./chapters1a/ch3";

// Dimensions Math 1A — built for the household's second child. Chapters 4-9
// (Subtraction, Numbers to 20, Addition/Subtraction to 20, Shapes, Ordinal
// Numbers) follow the same pattern and get added incrementally.
export const grade1a: GradeDef = {
  name: "Grade 1",
  sequence: "Dimensions Math 1A",
  chapters: [g1ch1, g1ch2, g1ch3],
};
