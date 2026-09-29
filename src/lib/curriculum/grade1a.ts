import type { GradeDef } from "./types";
import { g1ch1 } from "./chapters1a/ch1";

// Dimensions Math 1A — built for the household's second child. Chapter 1 is
// the pilot; chapters 2-9 (Number Bonds, Addition, Subtraction, Numbers to
// 20, Addition/Subtraction to 20, Shapes, Ordinal Numbers) follow the same
// pattern and get added incrementally.
export const grade1a: GradeDef = {
  name: "Grade 1",
  sequence: "Dimensions Math 1A",
  chapters: [g1ch1],
};
