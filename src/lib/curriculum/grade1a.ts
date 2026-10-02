import type { GradeDef } from "./types";
import { g1ch1 } from "./chapters1a/ch1";
import { g1ch2 } from "./chapters1a/ch2";
import { g1ch3 } from "./chapters1a/ch3";
import { g1ch4 } from "./chapters1a/ch4";
import { g1ch5 } from "./chapters1a/ch5";

// Dimensions Math 1A — built for the household's second child. Chapters 6-9
// (Addition/Subtraction to 20, Shapes, Ordinal Numbers) follow the same
// pattern and get added incrementally.
export const grade1a: GradeDef = {
  name: "Grade 1",
  sequence: "Dimensions Math 1A",
  chapters: [g1ch1, g1ch2, g1ch3, g1ch4, g1ch5],
};
