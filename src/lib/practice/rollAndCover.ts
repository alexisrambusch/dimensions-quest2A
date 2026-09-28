import { randInt, pick } from "./rand";

export type RollCoverMode = "multiply" | "divide";

export interface BoardCell {
  id: number;
  value: number;
  factA: number;
  factB: number;
  covered: boolean;
}

export interface FactPrompt {
  text: string;
  answer: number;
}

const FAMILY = [2, 5, 10] as const;
export const BOARD_SIZE = 36;

/** Builds a 6x6 board of answers (products for multiply, quotients for divide) —
 * every cell is generated from a real ×2/×5/×10 fact, so it's always solvable. */
export function buildBoard(mode: RollCoverMode): BoardCell[] {
  return Array.from({ length: BOARD_SIZE }, (_, id) => {
    if (mode === "multiply") {
      const factor = pick(FAMILY);
      const other = randInt(1, 10);
      return { id, value: factor * other, factA: factor, factB: other, covered: false };
    }
    const divisor = pick(FAMILY);
    const quotient = randInt(1, 10);
    return { id, value: quotient, factA: divisor * quotient, factB: divisor, covered: false };
  });
}

export function factPromptFor(mode: RollCoverMode, cell: BoardCell): FactPrompt {
  if (mode === "multiply") {
    const [x, y] = Math.random() < 0.5 ? [cell.factA, cell.factB] : [cell.factB, cell.factA];
    return { text: `${x} × ${y}`, answer: cell.value };
  }
  return { text: `${cell.factA} ÷ ${cell.factB}`, answer: cell.value };
}

export function pickPrompt(mode: RollCoverMode, board: BoardCell[]): FactPrompt | null {
  const uncovered = board.filter((c) => !c.covered);
  if (uncovered.length === 0) return null;
  return factPromptFor(mode, pick(uncovered));
}
