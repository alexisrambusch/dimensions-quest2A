"use client";

import { useState } from "react";
import clsx from "clsx";
import { PRIMARY_BUTTON, CARD } from "../ui";
import { buildBoard, pickPrompt, type BoardCell, type FactPrompt, type RollCoverMode, BOARD_SIZE } from "@/lib/practice/rollAndCover";

function startGame(mode: RollCoverMode): { board: BoardCell[]; prompt: FactPrompt | null } {
  const board = buildBoard(mode);
  return { board, prompt: pickPrompt(mode, board) };
}

export function RollAndCoverClient() {
  const [mode, setMode] = useState<RollCoverMode>("multiply");
  const [{ board, prompt }, setState] = useState(() => startGame("multiply"));
  const [wrongId, setWrongId] = useState<number | null>(null);

  const covered = board.filter((c) => c.covered).length;
  const won = covered === BOARD_SIZE;

  function switchMode(next: RollCoverMode) {
    setMode(next);
    setState(startGame(next));
    setWrongId(null);
  }

  function tapCell(cell: BoardCell) {
    if (cell.covered || won || !prompt) return;
    if (cell.value !== prompt.answer) {
      setWrongId(cell.id);
      window.setTimeout(() => setWrongId((id) => (id === cell.id ? null : id)), 350);
      return;
    }
    const nextBoard = board.map((c) => (c.id === cell.id ? { ...c, covered: true } : c));
    setState({ board: nextBoard, prompt: pickPrompt(mode, nextBoard) });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className={`${CARD} flex flex-col gap-3`}>
        <div className="flex gap-2">
          {(["multiply", "divide"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={clsx(
                "rounded-full px-4 py-1.5 text-sm font-bold border-2 touch-manipulation",
                m === mode ? "bg-violet-600 border-violet-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-violet-300",
              )}
            >
              {m === "multiply" ? "Multiply ×2 ×5 ×10" : "Divide ÷2 ÷5 ÷10"}
            </button>
          ))}
        </div>
        <p className="text-sm font-semibold text-slate-500">
          Covered: <span className="text-violet-700">{covered}</span> / {BOARD_SIZE}
        </p>
      </div>

      <div className={`${CARD} flex flex-col items-center gap-4`}>
        {won ? (
          <>
            <p className="text-2xl font-black text-emerald-600 text-center">Board cleared! 🎉</p>
            <button type="button" className={clsx(PRIMARY_BUTTON, "!min-h-11 !py-2 !px-8")} onClick={() => switchMode(mode)}>
              Play again
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-500">Solve it, then tap the matching number on the board.</p>
            <div className="text-3xl font-black text-slate-800 tabular-nums">{prompt?.text} = ?</div>
          </>
        )}

        <div className="grid grid-cols-6 gap-1.5">
          {board.map((cell) => (
            <button
              key={cell.id}
              type="button"
              onClick={() => tapCell(cell)}
              disabled={cell.covered}
              aria-label={cell.covered ? "Covered" : `Cover ${cell.value}`}
              className={clsx(
                "h-9 w-9 sm:h-10 sm:w-10 rounded-md text-xs sm:text-sm font-bold flex items-center justify-center touch-manipulation transition-colors",
                cell.covered && "bg-violet-600 text-white",
                !cell.covered && wrongId === cell.id && "bg-rose-200 text-rose-700",
                !cell.covered && wrongId !== cell.id && "bg-white border-2 border-slate-200 text-slate-700 hover:border-violet-300",
              )}
            >
              {cell.covered ? "✓" : cell.value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
