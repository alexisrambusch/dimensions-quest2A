"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import type { MatchingGameBoard } from "@/lib/actions/matchingGame";
import { PRIMARY_BUTTON } from "../ui";

interface Props {
  board: MatchingGameBoard;
  onComplete: (results: Array<{ a: number; factor: number; mistakes: number }>) => void;
}

export function MatchingGame({ board, onComplete }: Props) {
  const byId = useMemo(() => new Map(board.pairs.map((p) => [p.pairId, p])), [board.pairs]);
  const [selectedEquation, setSelectedEquation] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<{ equation: string | null; answer: string | null }>({ equation: null, answer: null });
  const [mistakes, setMistakes] = useState<Record<string, number>>({});

  const allMatched = matched.size === board.pairs.length;

  function pickEquation(pairId: string) {
    if (matched.has(pairId)) return;
    setSelectedEquation(pairId);
    setWrongFlash({ equation: null, answer: null });
  }

  function pickAnswer(answerPairId: string) {
    if (matched.has(answerPairId) || !selectedEquation) return;
    if (answerPairId === selectedEquation) {
      setMatched((m) => new Set(m).add(selectedEquation));
      setSelectedEquation(null);
    } else {
      setMistakes((m) => ({ ...m, [selectedEquation]: (m[selectedEquation] ?? 0) + 1 }));
      setWrongFlash({ equation: selectedEquation, answer: answerPairId });
      setTimeout(() => setWrongFlash({ equation: null, answer: null }), 400);
    }
  }

  function finish() {
    const results = board.pairs.map((p) => ({ a: p.a, factor: p.factor, mistakes: mistakes[p.pairId] ?? 0 }));
    onComplete(results);
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-sm text-slate-500 text-center">Tap an equation, then tap its answer. No rush — just have fun!</p>
      <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
        <div className="flex flex-col gap-2">
          {board.equationOrder.map((pairId) => {
            const p = byId.get(pairId)!;
            const isMatched = matched.has(pairId);
            const isSelected = selectedEquation === pairId;
            const isWrong = wrongFlash.equation === pairId;
            return (
              <button
                key={pairId}
                type="button"
                disabled={isMatched}
                onClick={() => pickEquation(pairId)}
                className={clsx(
                  "rounded-xl border-2 px-3 py-3 text-lg font-bold transition-colors",
                  isMatched && "bg-emerald-50 border-emerald-300 text-emerald-500 opacity-60",
                  !isMatched && isWrong && "bg-rose-50 border-rose-400 text-rose-700",
                  !isMatched && !isWrong && isSelected && "bg-blue-100 border-blue-500 text-blue-800",
                  !isMatched && !isWrong && !isSelected && "bg-white border-slate-200 text-slate-800 hover:border-blue-300",
                )}
              >
                {p.factor} × {p.a}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {board.answerOrder.map((pairId) => {
            const p = byId.get(pairId)!;
            const isMatched = matched.has(pairId);
            const isWrong = wrongFlash.answer === pairId;
            return (
              <button
                key={pairId}
                type="button"
                disabled={isMatched}
                onClick={() => pickAnswer(pairId)}
                className={clsx(
                  "rounded-xl border-2 px-3 py-3 text-lg font-bold transition-colors",
                  isMatched && "bg-emerald-50 border-emerald-300 text-emerald-500 opacity-60",
                  !isMatched && isWrong && "bg-rose-50 border-rose-400 text-rose-700",
                  !isMatched && !isWrong && "bg-white border-slate-200 text-slate-800 hover:border-blue-300",
                )}
              >
                {p.product}
              </button>
            );
          })}
        </div>
      </div>
      {allMatched && (
        <button type="button" className={PRIMARY_BUTTON} onClick={finish}>
          All matched! Continue
        </button>
      )}
    </div>
  );
}
