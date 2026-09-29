"use client";

import { useState } from "react";
import clsx from "clsx";
import { PRIMARY_BUTTON, SECONDARY_BUTTON, CARD } from "../ui";
import { generateArrowProblem, type ArrowProblem } from "@/lib/practice/arrowGame";
import { MiniHundredChart } from "./MiniHundredChart";

export function ArrowGameClient() {
  const [problem, setProblem] = useState<ArrowProblem>(() => generateArrowProblem());
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [showChart, setShowChart] = useState(false);
  const [streak, setStreak] = useState(0);

  const answer = problem.mode === "findEnd" ? problem.end : problem.start;

  function next() {
    setProblem(generateArrowProblem());
    setValue("");
    setFeedback("idle");
    setShowChart(false);
  }

  function submit() {
    if (feedback !== "idle") {
      next();
      return;
    }
    if (value === "") return;
    const isCorrect = Number(value) === answer;
    setFeedback(isCorrect ? "correct" : "wrong");
    setStreak((s) => (isCorrect ? s + 1 : 0));
  }

  const highlights: Record<number, string> = {
    [problem.start]: "bg-violet-600 text-white",
    [problem.end]: "bg-emerald-500 text-white",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className={`${CARD} flex flex-col items-center gap-5`}>
        <p className="text-sm font-semibold text-slate-500">
          Streak: <span className="text-violet-700">{streak}</span>
        </p>

        <div className="text-3xl font-black text-slate-800 flex flex-wrap items-center justify-center gap-2 tabular-nums">
          {problem.mode === "findEnd" ? (
            <>
              <span>{problem.start}</span>
              <span className="text-2xl">{problem.arrows.join(" ")}</span>
              <span>= ?</span>
            </>
          ) : (
            <>
              <span>?</span>
              <span className="text-2xl">{problem.arrows.join(" ")}</span>
              <span>= {problem.end}</span>
            </>
          )}
        </div>

        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          disabled={feedback !== "idle"}
          autoFocus
          className={clsx(
            "w-28 text-center text-2xl font-black rounded-xl border-2 outline-none py-2",
            feedback === "correct" && "border-emerald-500 bg-emerald-50 text-emerald-800",
            feedback === "wrong" && "border-rose-500 bg-rose-50 text-rose-800",
            feedback === "idle" && "border-slate-300 focus:border-violet-500",
          )}
        />

        {feedback === "wrong" && <p className="text-sm font-semibold text-rose-600">Not quite — the answer was {answer}.</p>}
        {feedback === "correct" && <p className="text-sm font-semibold text-emerald-600">Nailed it!</p>}

        <div className="flex gap-3">
          <button type="button" className={clsx(PRIMARY_BUTTON, "!min-h-11 !py-2 !px-8")} onClick={submit}>
            {feedback === "idle" ? "Check" : "Next"}
          </button>
          <button type="button" className={clsx(SECONDARY_BUTTON, "!min-h-11 !py-2 !px-4 text-sm")} onClick={() => setShowChart((s) => !s)}>
            {showChart ? "Hide chart" : "Show chart"}
          </button>
        </div>
      </div>

      {showChart && (
        <div className={CARD}>
          <p className="text-xs text-slate-500 text-center mb-2">Blue = start, green = end.</p>
          <MiniHundredChart highlights={highlights} />
        </div>
      )}
    </div>
  );
}
