export interface StaircaseCell {
  col: number;
  row: number;
  a: number;
  b: number;
  answer: number;
}

export type StaircaseRange = 10 | 20;
export type StaircaseOp = "add" | "sub";

/** Builds the full set of addition or subtraction facts within 10 or 20, laid out as a
 * staggered "staircase" grid (like Dimensions Math's fact-family worksheets) so every
 * combination is covered exactly once and related facts line up in columns. */
export function buildStaircase(range: StaircaseRange, op: StaircaseOp): { cells: StaircaseCell[]; cols: number; rows: number } {
  const cells: StaircaseCell[] = [];
  let cols = 0;
  let rows = 0;

  if (range === 10) {
    for (let c = 1; c <= 9; c++) {
      const col = c;
      cols = Math.max(cols, col);
      let row = 0;
      for (let r = 1; r <= 10 - c; r++) {
        row++;
        rows = Math.max(rows, row);
        if (op === "add") {
          cells.push({ col, row, a: c, b: r, answer: c + r });
        } else {
          const minuend = c + r;
          cells.push({ col, row, a: minuend, b: c, answer: minuend - c });
        }
      }
    }
  } else {
    for (let b = 2; b <= 9; b++) {
      const col = b - 1;
      cols = Math.max(cols, col);
      let row = 0;
      for (let a = 11 - b; a <= 9; a++) {
        row++;
        rows = Math.max(rows, row);
        if (op === "add") {
          cells.push({ col, row, a, b, answer: a + b });
        } else {
          const minuend = a + b;
          cells.push({ col, row, a: minuend, b, answer: minuend - b });
        }
      }
    }
  }

  return { cells, cols, rows };
}
