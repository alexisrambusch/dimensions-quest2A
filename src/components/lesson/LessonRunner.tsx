"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  nextQuestionForLesson,
  submitAttempt,
  requestHint,
  setLessonPhase,
  startSession,
  endSession,
  type QuestionForClient,
  type AttemptResult,
} from "@/lib/actions/lesson";
import { QuestionRenderer } from "./QuestionRenderer";
import { MatchingGame } from "./MatchingGame";
import { startMatchingGame, completeMatchingGame, type MatchingGameBoard } from "@/lib/actions/matchingGame";
import { getMatchingGameFactor } from "@/lib/curriculum/matchingGames";
import { CARD, PRIMARY_BUTTON, SECONDARY_BUTTON } from "../ui";
import clsx from "clsx";
import type { LessonPhase } from "@/generated/prisma/enums";

interface SkillInfo {
  id: string;
  code: string;
  title: string;
  description: string;
  stage: string;
  masteryState: string;
}
interface ConceptInfo {
  title: string;
  bigIdea: string;
  skills: SkillInfo[];
}
export interface LessonRuntime {
  lesson: {
    id: string;
    code: string;
    title: string;
    type: string;
    objective: string;
    missionBriefing: string;
    chapterTitle: string;
    worldName: string;
  };
  concepts: ConceptInfo[];
  phase: string;
  completed: boolean;
}

type Stage = "BRIEFING" | "DISCOVER" | "YOUR_TURN" | "CHALLENGE" | "GAME" | "MASTERY_CHECK" | "COMPLETE";

const STAGE_ORDER: Stage[] = ["BRIEFING", "DISCOVER", "YOUR_TURN", "CHALLENGE", "GAME", "MASTERY_CHECK", "COMPLETE"];

const STAGE_CONFIG: Partial<Record<Stage, { label: string; blurb: string; count: number; graded: boolean }>> = {
  DISCOVER: { label: "Discover", blurb: "Let's explore the idea together first.", count: 1, graded: false },
  YOUR_TURN: { label: "Your Turn", blurb: "Let's practice together — hints are always here if you want them.", count: 2, graded: true },
  CHALLENGE: { label: "Challenge", blurb: "Try these on your own!", count: 3, graded: true },
  GAME: { label: "Speed Round", blurb: "Quick round — no pressure, just have fun!", count: 4, graded: true },
  MASTERY_CHECK: { label: "Mastery Check", blurb: "Show what you've learned in this mission.", count: 3, graded: true },
};

function initialStage(phase: string): Stage {
  if (phase === "EXPLORE") return "DISCOVER";
  if (STAGE_ORDER.includes(phase as Stage)) return phase as Stage;
  return "BRIEFING";
}

export function LessonRunner({
  runtime,
  studentId,
  studentName,
}: {
  runtime: LessonRuntime;
  studentId: string;
  studentName: string;
}) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>(initialStage(runtime.phase));
  const alreadyCompleted = useRef(runtime.completed).current;
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<QuestionForClient | null>(null);
  const [askedCodes, setAskedCodes] = useState<string[]>([]);
  const [answeredInStage, setAnsweredInStage] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [hintTexts, setHintTexts] = useState<string[]>([]);
  const [hintLoading, setHintLoading] = useState(false);
  const [feedback, setFeedback] = useState<AttemptResult | null>(null);
  const [attemptsOnQuestion, setAttemptsOnQuestion] = useState(0);
  const [lessonXp, setLessonXp] = useState(0);
  const [badges, setBadges] = useState<Array<{ code: string; title: string; icon: string }>>([]);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [matchingBoard, setMatchingBoard] = useState<MatchingGameBoard | null>(null);
  const servedAtRef = useRef<number>(Date.now());
  const matchingFactor = getMatchingGameFactor(runtime.lesson.code);

  const loadQuestion = useCallback(
    async (exclude: string[]) => {
      setLoadingQuestion(true);
      setFeedback(null);
      setHintLevel(0);
      setHintTexts([]);
      setAttemptsOnQuestion(0);
      const q = await nextQuestionForLesson(studentId, runtime.lesson.code, exclude);
      servedAtRef.current = Date.now();
      setQuestion(q);
      setLoadingQuestion(false);
    },
    [studentId, runtime.lesson.code],
  );

  async function loadMatchingGame() {
    setLoadingQuestion(true);
    const board = await startMatchingGame(matchingFactor!);
    setMatchingBoard(board);
    setLoadingQuestion(false);
  }

  useEffect(() => {
    startSession(studentId, runtime.lesson.id).then(setSessionId);
    // Resuming mid-lesson: the initial stage may already be past BRIEFING
    // (from a prior session), so the question loop needs a kickstart here —
    // otherwise a returning student lands on a permanent "Loading..." screen.
    if (stage === "GAME" && matchingFactor !== undefined) {
      loadMatchingGame();
    } else if (stage !== "BRIEFING" && stage !== "COMPLETE") {
      loadQuestion([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, runtime.lesson.id]);

  async function beginStage(next: Stage) {
    setStage(next);
    setAnsweredInStage(0);
    await setLessonPhase(studentId, runtime.lesson.id, next as LessonPhase);
    if (next === "GAME" && matchingFactor !== undefined) {
      await loadMatchingGame();
    } else if (next !== "BRIEFING" && next !== "COMPLETE") {
      await loadQuestion(askedCodes);
    }
    if (next === "COMPLETE" && sessionId) {
      await endSession(sessionId);
    }
  }

  async function handleMatchingComplete(results: Array<{ a: number; factor: number; mistakes: number }>) {
    const res = await completeMatchingGame(studentId, results);
    setLessonXp((x) => x + res.xpAwarded);
    if (res.newBadges.length) setBadges((b) => [...b, ...res.newBadges]);
    const idx = STAGE_ORDER.indexOf("GAME");
    await beginStage(STAGE_ORDER[idx + 1]);
  }

  async function handleHint() {
    if (!question || hintLevel >= 4 || hintLoading) return;
    setHintLoading(true);
    const level = hintLevel + 1;
    const result = await requestHint({
      studentId,
      studentName,
      generatorId: question.generatorId,
      seed: question.seed,
      difficulty: question.difficulty,
      paramsJson: question.paramsJson,
      promptText: question.prompt.text,
      level,
      skillCode: question.skillCode,
    });
    setHintLevel(level);
    setHintTexts((prev) => [...prev, result.text]);
    setHintLoading(false);
  }

  async function handleSubmit(response: unknown) {
    if (!question) return;
    const responseTimeMs = Date.now() - servedAtRef.current;
    const result = await submitAttempt({
      studentId,
      sessionId: sessionId ?? undefined,
      questionId: question.questionId,
      questionCode: question.questionCode,
      generatorId: question.generatorId,
      seed: question.seed,
      difficulty: question.difficulty,
      paramsJson: question.paramsJson,
      skillId: question.skillId,
      response,
      responseTimeMs,
      hintLevelUsed: hintLevel,
    });
    setLessonXp((x) => x + result.xpAwarded);
    if (result.newBadges.length) setBadges((b) => [...b, ...result.newBadges]);
    setAttemptsOnQuestion((n) => n + 1);
    setFeedback(result);
  }

  function canRetry() {
    return !feedback?.correct && attemptsOnQuestion < 3 && hintLevel < 4;
  }

  async function handleNext() {
    const config = STAGE_CONFIG[stage];
    const nextAnswered = answeredInStage + 1;
    setAnsweredInStage(nextAnswered);
    const nextAsked = question ? [...askedCodes, question.questionCode] : askedCodes;
    setAskedCodes(nextAsked);

    if (config && nextAnswered >= config.count) {
      const idx = STAGE_ORDER.indexOf(stage);
      await beginStage(STAGE_ORDER[idx + 1]);
    } else {
      await loadQuestion(nextAsked);
    }
  }

  async function handleTryAgain() {
    setFeedback(null);
    servedAtRef.current = Date.now();
  }

  // ---- Screens ----

  if (stage === "BRIEFING") {
    return (
      <div className={`${CARD} max-w-lg mx-auto text-center flex flex-col gap-4`}>
        <p className="text-xs font-bold uppercase tracking-wide text-violet-400">
          {runtime.lesson.worldName} · {runtime.lesson.chapterTitle}
        </p>
        <h1 className="text-2xl font-black text-slate-800">{runtime.lesson.title}</h1>
        <p className="text-slate-600">{runtime.lesson.missionBriefing}</p>
        <button className={PRIMARY_BUTTON} onClick={() => beginStage("DISCOVER")}>
          Begin Mission
        </button>
      </div>
    );
  }

  if (stage === "COMPLETE") {
    return (
      <div className={`${CARD} max-w-lg mx-auto text-center flex flex-col gap-4`}>
        <h1 className="text-3xl font-black text-emerald-600">
          {alreadyCompleted && lessonXp === 0 ? "Mission already complete! ⭐" : "Mission Complete! 🎉"}
        </h1>
        <p className="text-slate-600">
          {lessonXp > 0 ? `You earned ${lessonXp} XP in this mission.` : "Great job finishing this one already — head back to keep exploring the map."}
        </p>
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center">
            {badges.map((b) => (
              <div key={b.code} className="flex flex-col items-center gap-1 text-sm font-semibold text-amber-700">
                <span className="text-3xl">🏅</span>
                {b.title}
              </div>
            ))}
          </div>
        )}
        <button className={PRIMARY_BUTTON} onClick={() => router.push("/map")}>
          Back to the Map
        </button>
      </div>
    );
  }

  const config = STAGE_CONFIG[stage]!;

  if (stage === "DISCOVER") {
    return (
      <div className={`${CARD} max-w-lg mx-auto flex flex-col gap-6`}>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-violet-400">{config.label}</p>
          <p className="text-slate-600 mt-1">{config.blurb}</p>
        </div>
        {runtime.concepts.map((c) => (
          <div key={c.title} className="rounded-xl bg-violet-50 border border-violet-100 p-4">
            <p className="font-bold text-violet-800">{c.title}</p>
            <p className="text-slate-600 text-sm mt-1">{c.bigIdea}</p>
          </div>
        ))}
        {loadingQuestion || !question ? (
          <p className="text-center text-slate-400">Loading...</p>
        ) : (
          <>
            <QuestionRenderer
              key={question.seed}
              prompt={question.prompt}
              onSubmit={async (response) => {
                await handleSubmit(response);
              }}
            />
            {feedback && (
              <div className="rounded-xl bg-sky-50 border border-sky-200 p-4 text-center">
                <p className="font-semibold text-sky-800">{feedback.explanation}</p>
                <button className={clsx(PRIMARY_BUTTON, "mt-3")} onClick={handleNext}>
                  Got it — let's practice!
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  if (stage === "GAME" && matchingFactor !== undefined) {
    return (
      <div className={`${CARD} max-w-lg mx-auto flex flex-col gap-5`}>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-violet-400">Fact Blast!</p>
          <p className="text-slate-500 text-sm">Match every ×{matchingFactor} equation to its answer.</p>
        </div>
        {loadingQuestion || !matchingBoard ? (
          <p className="text-center text-slate-400 py-8">Loading...</p>
        ) : (
          <MatchingGame board={matchingBoard} onComplete={handleMatchingComplete} />
        )}
      </div>
    );
  }

  // YOUR_TURN, CHALLENGE, GAME, MASTERY_CHECK share the graded question loop.
  return (
    <div className={`${CARD} max-w-lg mx-auto flex flex-col gap-5`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-violet-400">{config.label}</p>
          <p className="text-slate-500 text-sm">{config.blurb}</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: config.count }, (_, i) => (
            <span key={i} className={clsx("h-2.5 w-2.5 rounded-full", i < answeredInStage ? "bg-emerald-400" : "bg-slate-200")} />
          ))}
        </div>
      </div>

      {loadingQuestion || !question ? (
        <p className="text-center text-slate-400 py-8">Loading...</p>
      ) : (
        <>
          {hintTexts.length > 0 && (
            <div className="flex flex-col gap-2">
              {hintTexts.map((t, i) => (
                <div key={i} className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-800">
                  <span className="font-bold">Hint {i + 1}: </span>
                  {t}
                </div>
              ))}
            </div>
          )}

          {!feedback ? (
            <>
              <QuestionRenderer key={question.seed} prompt={question.prompt} onSubmit={handleSubmit} disabled={hintLoading} />
              {stage !== "GAME" && (
                <button
                  type="button"
                  onClick={handleHint}
                  disabled={hintLevel >= 4 || hintLoading}
                  className={clsx(SECONDARY_BUTTON, "self-center !py-2 text-sm")}
                >
                  {hintLevel === 0 ? "💡 I'd like a hint" : hintLevel < 4 ? "💡 Another hint" : "No more hints"}
                </button>
              )}
            </>
          ) : !feedback.correct && canRetry() ? (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-center text-rose-700 font-semibold flex flex-col items-center gap-2">
              Not quite — want to try again, or use a hint?
              <div className="flex gap-2">
                <button className={clsx(SECONDARY_BUTTON, "!py-2 text-sm")} onClick={handleTryAgain}>
                  Try again
                </button>
                {stage !== "GAME" && (
                  <button
                    type="button"
                    onClick={async () => {
                      await handleHint();
                      handleTryAgain();
                    }}
                    disabled={hintLevel >= 4 || hintLoading}
                    className={clsx(SECONDARY_BUTTON, "!py-2 text-sm")}
                  >
                    💡 Get a hint
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div
              className={clsx(
                "rounded-xl p-4 text-center",
                feedback.correct ? "bg-emerald-50 border border-emerald-200" : "bg-sky-50 border border-sky-200",
              )}
            >
              <p className={clsx("font-bold text-lg", feedback.correct ? "text-emerald-700" : "text-sky-800")}>
                {feedback.correct ? "Great work! ⭐" : "Let's see how it works:"}
              </p>
              <p className="text-slate-600 mt-1">{feedback.explanation}</p>
              {feedback.reteachSuggested && feedback.misconceptionDescription && (
                <div className="mt-3 rounded-lg bg-violet-100 border border-violet-300 p-3 text-left text-sm text-violet-800">
                  <p className="font-bold">Let&apos;s look at this together:</p>
                  <p>{feedback.misconceptionDescription}</p>
                </div>
              )}
              <p className="text-xs text-violet-500 font-semibold mt-2">+{feedback.xpAwarded} XP</p>
              <button className={clsx(PRIMARY_BUTTON, "mt-3")} onClick={handleNext}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
