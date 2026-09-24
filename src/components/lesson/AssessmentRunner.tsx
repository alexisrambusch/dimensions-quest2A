"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  startAssessment,
  submitAssessment,
  type AssessmentRuntime,
  type AssessmentQuestionForClient,
  type AssessmentResult,
} from "@/lib/actions/assessment";
import { QuestionRenderer } from "./QuestionRenderer";
import { CARD, PRIMARY_BUTTON, SECONDARY_BUTTON } from "../ui";

interface Props {
  assessmentCode: string;
  studentId: string;
  title: string;
  description: string;
  style: "TEST_A" | "TEST_B";
  questionCount: number;
}

type Stage = "INTRO" | "RUNNING" | "GRADING" | "RESULTS";

interface Answer {
  questionCode: string;
  generatorId: string;
  seed: string;
  difficulty: number;
  paramsJson: string;
  response: unknown;
}

export function AssessmentRunner({ assessmentCode, studentId, title, description, style, questionCount }: Props) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("INTRO");
  const [runtime, setRuntime] = useState<AssessmentRuntime | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  async function begin() {
    setStage("RUNNING");
    const rt = await startAssessment(assessmentCode, studentId);
    setRuntime(rt);
    setIndex(0);
    setAnswers([]);
  }

  async function handleSubmit(response: unknown) {
    if (!runtime) return;
    const q = runtime.questions[index];
    const nextAnswers = [
      ...answers,
      { questionCode: q.questionCode, generatorId: q.generatorId, seed: q.seed, difficulty: q.difficulty, paramsJson: q.paramsJson, response },
    ];
    setAnswers(nextAnswers);

    if (index + 1 < runtime.questions.length) {
      setIndex(index + 1);
    } else {
      setStage("GRADING");
      const res = await submitAssessment(studentId, runtime.attemptId, nextAnswers);
      setResult(res);
      setStage("RESULTS");
    }
  }

  if (stage === "INTRO") {
    return (
      <div className={`${CARD} max-w-lg mx-auto flex flex-col gap-4 text-center`}>
        <p className="text-xs font-bold uppercase tracking-wide text-blue-400">{style === "TEST_A" ? "Test A" : "Test B"}</p>
        <h1 className="text-2xl font-black text-slate-800">{title}</h1>
        <p className="text-slate-600">{description}</p>
        <p className="text-sm text-slate-400">{questionCount} questions · no hints this time — show what you know!</p>
        <button className={PRIMARY_BUTTON} onClick={begin}>
          Start the Test
        </button>
      </div>
    );
  }

  if (stage === "RUNNING" && runtime) {
    const q: AssessmentQuestionForClient = runtime.questions[index];
    return (
      <div className={`${CARD} max-w-lg mx-auto flex flex-col gap-5`}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-400">{title}</p>
          <div className="flex gap-1">
            {runtime.questions.map((_, i) => (
              <span key={i} className={clsx("h-2.5 w-2.5 rounded-full", i < index ? "bg-emerald-400" : i === index ? "bg-blue-400" : "bg-slate-200")} />
            ))}
          </div>
        </div>
        <QuestionRenderer key={q.seed} prompt={q.prompt} onSubmit={handleSubmit} />
      </div>
    );
  }

  if (stage === "GRADING") {
    return (
      <div className={`${CARD} max-w-lg mx-auto text-center`}>
        <p className="text-slate-400">Grading your test...</p>
      </div>
    );
  }

  if (stage === "RESULTS" && result) {
    const pct = Math.round((result.correct / result.total) * 100);
    return (
      <div className={`${CARD} max-w-lg mx-auto flex flex-col gap-4`}>
        <h1 className="text-2xl font-black text-center text-slate-800">
          You got {result.correct} of {result.total} ({pct}%)!
        </h1>
        {pct >= 80 && <p className="text-center text-emerald-600 font-semibold">Excellent work! 🌟</p>}
        {result.newBadges.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center">
            {result.newBadges.map((b) => (
              <div key={b.code} className="flex flex-col items-center gap-1 text-sm font-semibold text-amber-700">
                <span className="text-3xl">🏅</span>
                {b.title}
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-2">
          {result.perQuestion.map((pq, i) => (
            <div
              key={i}
              className={clsx(
                "rounded-lg px-3 py-2 text-sm border",
                pq.correct ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800",
              )}
            >
              <span className="font-bold">{pq.correct ? "✓" : "✗"}</span> {pq.explanation}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-blue-500 font-semibold">+{result.xpAwarded} XP</p>
        <button className={PRIMARY_BUTTON} onClick={() => router.push("/map")}>
          Back to the Map
        </button>
        <button className={clsx(SECONDARY_BUTTON, "!py-2 text-sm")} onClick={begin}>
          Try Again
        </button>
      </div>
    );
  }

  return null;
}
