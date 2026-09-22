import type { GradeDef } from "./types";
import { ch1 } from "./chapters/ch1";
import { ch2 } from "./chapters/ch2";
import { ch3 } from "./chapters/ch3";
import { ch4 } from "./chapters/ch4";
import { ch5 } from "./chapters/ch5";
import { ch6 } from "./chapters/ch6";
import { ch7 } from "./chapters/ch7";

export const grade2a: GradeDef = {
  name: "Grade 2",
  sequence: "Dimensions Math 2A",
  chapters: [ch1, ch2, ch3, ch4, ch5, ch6, ch7],
};
