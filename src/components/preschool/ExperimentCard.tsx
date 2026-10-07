"use client";

import { useState } from "react";
import clsx from "clsx";
import { PRIMARY_BUTTON, SECONDARY_BUTTON, CHOICE_BUTTON_IDLE, CHOICE_BUTTON_SELECTED } from "../ui";
import { SpeakButton } from "../SpeakButton";
import type { ExperimentContent } from "@/lib/preschool/types";

type Step = "ASK" | "PREDICT" | "TEST" | "OBSERVE" | "RECORD";
const STEP_ORDER: Step[] = ["ASK", "PREDICT", "TEST", "OBSERVE", "RECORD"];
const STEP_LABEL: Record<Step, string> = { ASK: "Ask", PREDICT: "Predict", TEST: "Test It", OBSERVE: "Observe", RECORD: "What We Learned" };

/** A tiny hands-on science experiment: Ask -> Predict -> Test -> Observe -> Record, all ungraded and child-paced. */
export function ExperimentCard({ content, onDone }: { content: ExperimentContent; onDone: (prediction: string, observation: string) => void }) {
  const [step, setStep] = useState<Step>("ASK");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [observation, setObservation] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(content.testTimerSeconds ?? 0);
  const [timerRunning, setTimerRunning] = useState(false);

  function startTimer() {
    setTimerRunning(true);
    const total = content.testTimerSeconds ?? 0;
    setSecondsLeft(total);
    const start = Date.now();
    const tick = () => {
      const remaining = Math.max(0, total - Math.floor((Date.now() - start) / 1000));
      setSecondsLeft(remaining);
      if (remaining > 0) requestAnimationFrame(tick);
      else setTimerRunning(false);
    };
    requestAnimationFrame(tick);
  }

  const stepIndex = STEP_ORDER.indexOf(step);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm">
      <div className="flex gap-1.5">
        {STEP_ORDER.map((s, i) => (
          <span key={s} className={clsx("h-2 w-2 rounded-full", i <= stepIndex ? "bg-blue-500" : "bg-slate-200")} />
        ))}
      </div>
      <p className="text-xs font-bold uppercase tracking-wide text-blue-400">{STEP_LABEL[step]}</p>

      {step === "ASK" && (
        <>
          <div className="flex items-start gap-2">
            <p className="text-lg font-semibold text-slate-800 text-center flex-1">{content.ask}</p>
            <SpeakButton text={content.ask} />
          </div>
          <button type="button" className={PRIMARY_BUTTON} onClick={() => setStep("PREDICT")}>
            Let&apos;s find out!
          </button>
        </>
      )}

      {step === "PREDICT" && (
        <>
          <p className="text-slate-600 text-center">Make a guess before we try it.</p>
          <div className="flex flex-col gap-2 w-full">
            {content.predictChoices.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setPrediction(c)}
                className={clsx(prediction === c ? CHOICE_BUTTON_SELECTED : CHOICE_BUTTON_IDLE, "w-full !min-h-12 text-base")}
              >
                {c}
              </button>
            ))}
          </div>
          <button type="button" disabled={!prediction} className={PRIMARY_BUTTON} onClick={() => setStep("TEST")}>
            Next
          </button>
        </>
      )}

      {step === "TEST" && (
        <>
          <p className="text-slate-700 text-center font-semibold">{content.testInstructions}</p>
          {content.testTimerSeconds ? (
            <>
              <div className="text-4xl font-black text-blue-600 tabular-nums">{secondsLeft}s</div>
              <button type="button" className={SECONDARY_BUTTON} onClick={startTimer} disabled={timerRunning}>
                {timerRunning ? "Going..." : "Start"}
              </button>
            </>
          ) : null}
          <button type="button" className={PRIMARY_BUTTON} onClick={() => setStep("OBSERVE")}>
            I tried it!
          </button>
        </>
      )}

      {step === "OBSERVE" && (
        <>
          <p className="text-slate-600 text-center">What did you notice?</p>
          <div className="flex flex-col gap-2 w-full">
            {content.observeChoices.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setObservation(c)}
                className={clsx(observation === c ? CHOICE_BUTTON_SELECTED : CHOICE_BUTTON_IDLE, "w-full !min-h-12 text-base")}
              >
                {c}
              </button>
            ))}
          </div>
          <button type="button" disabled={!observation} className={PRIMARY_BUTTON} onClick={() => setStep("RECORD")}>
            Next
          </button>
        </>
      )}

      {step === "RECORD" && (
        <>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
            <p className="text-emerald-800 font-semibold">{content.recordSummary}</p>
          </div>
          <button type="button" className={PRIMARY_BUTTON} onClick={() => onDone(prediction ?? "", observation ?? "")}>
            Done!
          </button>
        </>
      )}
    </div>
  );
}
