"use client";

import { useState } from "react";
import clsx from "clsx";
import { PRIMARY_BUTTON, CARD } from "../ui";
import { generateMentalMath, MENTAL_MATH_CATEGORIES, type MentalMathCategory, type MentalMathProblem } from "@/lib/practice/mentalMath";

export function MentalMathClient() {
  const [category, setCategory] = useState<MentalMathCategory>("addSub10");
  const [problem, setProblem] = useState<MentalMathProblem>(() => generateMentalMath("addSub10"));
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);

  function pickCategory(c: MentalMathCategory) {
    setCategory(c);
    setProblem(generateMentalMath(c));
    setValue("");
    setFeedback("idle");
  }

  function submit() {
    if (feedback !== "idle") {
      setProblem(generateMentalMath(category));
      setValue("");
      setFeedback("idle");
      return;
    }
    if (value === "") return;
    const isCorrect = Number(value) === problem.answer;
    setTotal((t) => t + 1);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setStreak((s) => {
        const next = s + 1;
        setBest((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
    setFeedback(isCorrect ? "correct" : "wrong");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className={`${CARD} flex flex-col gap-3`}>
        <p className="text-sm font-semibold text-slate-600">Pick a set:</p>
        <div className="flex flex-wrap gap-2">
          {MENTAL_MATH_CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => pickCategory(c.key)}
              className={clsx(
                "rounded-full px-3 py-1.5 text-sm font-bold border-2 touch-manipulation",
                c.key === category ? "bg-violet-600 border-violet-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-violet-300",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`${CARD} flex flex-col items-center gap-5`}>
        <div className="flex gap-6 text-sm font-semibold text-slate-500">
          <span>
            Streak: <span className="text-violet-700">{streak}</span>
          </span>
          <span>
            Best: <span className="text-violet-700">{best}</span>
          </span>
          <span>
            Score: <span className="text-violet-700">{correct}/{total}</span>
          </span>
        </div>

        <div className="text-4xl font-black text-slate-800 tabular-nums">{problem.prompt} = ?</div>

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

        {feedback === "wrong" && <p className="text-sm font-semibold text-rose-600">Not quite — the answer was {problem.answer}.</p>}
        {feedback === "correct" && <p className="text-sm font-semibold text-emerald-600">Nice work!</p>}

        <button type="button" className={clsx(PRIMARY_BUTTON, "!min-h-11 !py-2 !px-8")} onClick={submit}>
          {feedback === "idle" ? "Check" : "Next"}
        </button>
      </div>
    </div>
  );
}
