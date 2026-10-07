"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import type { PreschoolDayForClient } from "@/lib/actions/preschool";
import { completePreschoolActivity } from "@/lib/actions/preschool";
import type { PracticeRewardResult } from "@/lib/actions/practiceRewards";
import { QuestionRenderer } from "../lesson/QuestionRenderer";
import { SelScenarioCard } from "./SelScenarioCard";
import { TraceCard } from "./TraceCard";
import { ExperimentCard } from "./ExperimentCard";
import { ReadAloudCard } from "./ReadAloudCard";
import { JournalCard } from "./JournalCard";
import { ParentActivityCard } from "./ParentActivityCard";
import { MovementBreakCard } from "./MovementBreakCard";
import { MorningRoutineCard } from "./MorningRoutineCard";
import { PracticeRewardToast } from "../practice/PracticeRewardToast";
import { CARD, PRIMARY_BUTTON, SECONDARY_BUTTON } from "../ui";
import { ConfettiBurst } from "../ConfettiBurst";
import { playCorrect, playWrong, playCoin } from "@/lib/sound";
import type {
  ExperimentContent,
  JournalContent,
  MorningRoutineContent,
  MovementBreakContent,
  ParentActivityContent,
  ReadAloudContent,
  SelScenarioContent,
  TraceContent,
} from "@/lib/preschool/types";

const DOMAIN_LABEL: Record<string, string> = {
  MORNING: "Morning",
  LITERACY: "Literacy",
  MATH: "Math",
  SCIENCE: "Science",
  SOCIAL_STUDIES: "Social & Emotional",
  WRITING: "Writing",
  GAME: "Game",
  READ_ALOUD: "Read-Aloud",
  CREATIVE: "Creative",
  MOVEMENT: "Movement",
  EXTENSION: "Extension",
};

interface Props {
  day: PreschoolDayForClient;
  studentId: string;
  studentName: string;
}

export function DayRunner({ day, studentId, studentName }: Props) {
  const router = useRouter();
  const [activities, setActivities] = useState(day.activities);
  const [index, setIndex] = useState(() => {
    const firstIncomplete = day.activities.findIndex((a) => !a.completed);
    return firstIncomplete === -1 ? day.activities.length : firstIncomplete;
  });
  const [reward, setReward] = useState<PracticeRewardResult | null>(null);
  const [questionFeedback, setQuestionFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const current = index < activities.length ? activities[index] : null;
  const allDone = index >= activities.length;

  function toReward(result: { xpAwarded: number; coinsAwarded: number; leveledUp: boolean; newLevel: number; newBadges: PracticeRewardResult["newBadges"] }): PracticeRewardResult {
    return { xpAwarded: result.xpAwarded, coinsAwarded: result.coinsAwarded, leveledUp: result.leveledUp, newLevel: result.newLevel, newBadges: result.newBadges };
  }

  async function complete(response?: unknown) {
    if (!current || submitting) return;
    setSubmitting(true);
    const result = await completePreschoolActivity(studentId, current.id, response);
    setActivities((prev) => prev.map((a) => (a.id === current.id ? { ...a, completed: true } : a)));

    if (result.coinsAwarded > 0) playCoin();

    if (current.type === "QUESTION") {
      if (result.correct) playCorrect();
      else playWrong();
      setQuestionFeedback({ correct: !!result.correct, explanation: result.explanation ?? "" });
      if (result.xpAwarded > 0) setReward(toReward(result));
    } else {
      playCorrect();
      if (result.xpAwarded > 0) setReward(toReward(result));
      advance();
    }
    setSubmitting(false);
  }

  function advance() {
    setQuestionFeedback(null);
    setReward(null);
    setIndex((i) => i + 1);
  }

  if (allDone) {
    return (
      <div className={`${CARD} max-w-lg mx-auto flex flex-col items-center gap-4 text-center relative`}>
        <ConfettiBurst />
        <p className="text-xs font-bold uppercase tracking-wide text-blue-400">
          Week {day.weekNumber} · {day.weekTheme}
        </p>
        <h1 className="text-2xl font-black text-emerald-600">Day Complete! 🎉</h1>
        <p className="text-slate-600">Great work today, {studentName}! You finished every activity.</p>
        <button type="button" className={PRIMARY_BUTTON} onClick={() => router.push("/preschool")}>
          Back to the Week
        </button>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className={`${CARD} max-w-lg mx-auto flex flex-col gap-5`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-400">{DOMAIN_LABEL[current.domain] ?? current.domain}</p>
        <div className="flex gap-1">
          {activities.map((a, i) => (
            <span
              key={a.id}
              className={clsx("h-2.5 w-2.5 rounded-full", i < index ? "bg-emerald-400" : i === index ? "bg-blue-400" : "bg-slate-200")}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-black text-slate-800">{current.title}</h2>
        <p className="text-slate-500 text-sm mt-1">{current.instructions}</p>
      </div>

      {current.type === "QUESTION" && !questionFeedback && (
        <QuestionRenderer prompt={current.questionPrompt} onSubmit={(response) => complete(response)} disabled={submitting} />
      )}
      {current.type === "QUESTION" && questionFeedback && (
        <div
          className={clsx(
            "animate-pop-in rounded-xl p-4 text-center",
            questionFeedback.correct ? "bg-emerald-50 border border-emerald-200" : "bg-sky-50 border border-sky-200",
          )}
        >
          <p className={clsx("font-bold text-lg", questionFeedback.correct ? "text-emerald-700" : "text-sky-800")}>
            {questionFeedback.correct ? "Great work! ⭐" : "Let's see:"}
          </p>
          <p className="text-slate-600 mt-1">{questionFeedback.explanation}</p>
          {reward && <PracticeRewardToast reward={reward} />}
          <button type="button" className={clsx(PRIMARY_BUTTON, "mt-3")} onClick={advance}>
            Next
          </button>
        </div>
      )}

      {current.type === "SEL_SCENARIO" && <SelScenarioCard content={current.content as SelScenarioContent} onDone={(choice) => complete(choice)} />}
      {current.type === "TRACE" && <TraceCard content={current.content as TraceContent} studentName={studentName} onDone={() => complete()} />}
      {current.type === "EXPERIMENT" && (
        <ExperimentCard content={current.content as ExperimentContent} onDone={(prediction, observation) => complete({ prediction, observation })} />
      )}
      {current.type === "READ_ALOUD" && <ReadAloudCard content={current.content as ReadAloudContent} onDone={() => complete()} />}
      {current.type === "JOURNAL" && <JournalCard content={current.content as JournalContent} onDone={(drawing) => complete(drawing)} />}
      {current.type === "PARENT_ACTIVITY" && <ParentActivityCard content={current.content as ParentActivityContent} onDone={() => complete()} />}
      {current.type === "MOVEMENT_BREAK" && <MovementBreakCard content={current.content as MovementBreakContent} onDone={() => complete()} />}
      {current.type === "MORNING_ROUTINE" && (
        <MorningRoutineCard content={current.content as MorningRoutineContent} onDone={(mood, weather) => complete({ mood, weather })} />
      )}

      {current.optional && !(current.type === "QUESTION" && questionFeedback) && (
        <button type="button" className={clsx(SECONDARY_BUTTON, "self-center !py-2 text-sm")} onClick={advance}>
          Skip this one
        </button>
      )}
    </div>
  );
}
