"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";
import type { RenderedPrompt } from "@/lib/math-engine/types";
import { EqualGroupsVisual } from "../manipulatives/EqualGroupsVisual";
import { ArrayGrid } from "../manipulatives/ArrayGrid";
import { PlaceValueBuilder } from "../manipulatives/PlaceValueBuilder";
import { NumberBond } from "../manipulatives/NumberBond";
import { BarModelMultiplication, BarModelDivision, BarModelPartWhole, BarModelCompare } from "../manipulatives/BarModel";
import { RulerMeasure } from "../manipulatives/RulerMeasure";
import { SortNumbers } from "../manipulatives/SortNumbers";
import { NumberLine } from "../manipulatives/NumberLine";
import { TenFrame } from "../manipulatives/TenFrame";
import { icon } from "../manipulatives/icons";
import { SpeakButton } from "../SpeakButton";
import { CHOICE_BUTTON_IDLE, CHOICE_BUTTON_SELECTED, PRIMARY_BUTTON } from "../ui";

interface Props {
  prompt: RenderedPrompt;
  onSubmit: (response: unknown) => void;
  disabled?: boolean;
}

function NumericBlank({ value, onChange }: { value: number | undefined; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      inputMode="numeric"
      value={value ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      placeholder="?"
      autoFocus
      className="w-24 text-center text-3xl font-black rounded-xl border-2 border-slate-300 focus:border-blue-500 outline-none py-2"
    />
  );
}

function ChoiceGrid({ choices, value, onChange }: { choices: string[]; value: string | undefined; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-3 flex-wrap justify-center">
      {choices.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={clsx(value === c ? CHOICE_BUTTON_SELECTED : CHOICE_BUTTON_IDLE)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

export function QuestionRenderer({ prompt, onSubmit, disabled }: Props) {
  const [response, setResponse] = useState<unknown>(undefined);
  const d = prompt.data as Record<string, any>;

  function submit() {
    if (response === undefined || response === null || response === "") return;
    onSubmit(response);
  }

  let body: ReactNode = null;
  let readyToSubmit = response !== undefined && response !== null && response !== "";

  switch (prompt.view) {
    case "equalGroups":
      body = (
        <div className="flex flex-col items-center gap-4">
          <EqualGroupsVisual groups={d.groups} perGroup={d.perGroup} />
          <NumericBlank value={response as number | undefined} onChange={setResponse} />
        </div>
      );
      break;

    case "tenFrame":
      body = (
        <div className="flex flex-col items-center gap-4">
          <TenFrame count={d.count} />
          <NumericBlank value={response as number | undefined} onChange={setResponse} />
        </div>
      );
      break;

    case "textChoice":
      body = <ChoiceGrid choices={d.choices as string[]} value={response as string | undefined} onChange={setResponse} />;
      break;

    case "quantityNumeralChoice":
      body = (
        <div className="flex flex-col items-center gap-5">
          <TenFrame count={d.count} />
          <div className="flex gap-3 flex-wrap justify-center">
            {(d.choices as string[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setResponse(c)}
                className={clsx(
                  "h-16 w-16 rounded-2xl text-3xl font-black shadow-md active:scale-90 transition-transform touch-manipulation border-2",
                  response === c ? "bg-blue-100 text-blue-800 border-blue-500" : "bg-white text-slate-800 border-slate-200 hover:border-blue-300",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      );
      break;

    case "quantityCompare":
      body = (
        <div className="flex gap-4 flex-wrap justify-center">
          {(["A", "B"] as const).map((side) => (
            <button
              key={side}
              type="button"
              onClick={() => setResponse(side)}
              className={clsx(
                "rounded-2xl p-2 border-2 transition-transform active:scale-95 touch-manipulation",
                response === side ? "border-blue-500 bg-blue-50" : "border-transparent hover:border-blue-200",
              )}
            >
              <TenFrame count={side === "A" ? d.countA : d.countB} />
            </button>
          ))}
        </div>
      );
      break;

    case "arrayGrid":
      body = (
        <div className="flex flex-col items-center gap-4">
          <ArrayGrid rows={d.rows} cols={d.cols} />
          <NumericBlank value={response as number | undefined} onChange={setResponse} />
        </div>
      );
      break;

    case "placeValueBuilder":
      body = <PlaceValueBuilder target={d.target} onBuilt={setResponse} />;
      break;

    case "placeValueChart":
      body = (
        <div className="flex flex-col items-center gap-3">
          <div className="text-3xl font-black text-blue-700">{d.target}</div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <NumericBlank
              value={(response as any)?.hundreds}
              onChange={(v) => setResponse((r: any) => ({ ...(r ?? {}), hundreds: v }))}
            />
            <span>hundreds +</span>
            <NumericBlank
              value={(response as any)?.tens}
              onChange={(v) => setResponse((r: any) => ({ ...(r ?? {}), tens: v }))}
            />
            <span>tens +</span>
            <NumericBlank
              value={(response as any)?.ones}
              onChange={(v) => setResponse((r: any) => ({ ...(r ?? {}), ones: v }))}
            />
            <span>ones</span>
          </div>
        </div>
      );
      readyToSubmit = !!response && ["hundreds", "tens", "ones"].every((k) => (response as any)[k] !== undefined);
      break;

    case "compareNumbers":
      body = (
        <div className="flex items-center gap-4 text-3xl font-black text-slate-800">
          <span>{d.a}</span>
          <ChoiceGrid choices={d.choices} value={response as string | undefined} onChange={setResponse} />
          <span>{d.b}</span>
        </div>
      );
      break;

    case "numberLine":
      body = (
        <NumberLine min={d.min} max={d.max} step={d.step} value={response as number | undefined} onChange={setResponse} />
      );
      break;

    case "sortNumbers":
      body = <SortNumbers values={d.values} direction={d.direction} onChange={setResponse} />;
      readyToSubmit = Array.isArray(response) && response.length === d.values.length;
      break;

    case "compareGroups":
      body = (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6 items-end">
            <EqualGroupsVisual groups={1} perGroup={d.countA} itemIcon={d.itemIcon} />
            <EqualGroupsVisual groups={1} perGroup={d.countB} itemIcon={d.itemIcon} />
          </div>
          <ChoiceGrid choices={d.choices} value={response as string | undefined} onChange={setResponse} />
        </div>
      );
      break;

    case "numberSequence":
      body = (
        <div className="flex items-center gap-3 flex-wrap justify-center text-2xl font-black text-slate-800">
          {(d.shown as (number | null)[]).map((v, i) =>
            v === null ? (
              <NumericBlank key={i} value={response as number | undefined} onChange={setResponse} />
            ) : (
              <span key={i} className="min-w-14 text-center">
                {v}
              </span>
            ),
          )}
        </div>
      );
      break;

    case "numberBond":
      body = <NumberBond whole={d.whole} known={d.known} hidden={d.hidden} value={response as number | undefined} onChange={setResponse} />;
      break;

    case "regroupingColumns": {
      // `missing` (default "result") lets a generator ask for any one slot — the
      // sum/difference itself, or a missing addend/minuend/subtrahend — while
      // reusing the same three-number equation layout.
      const missing = (d.missing as "a" | "b" | "result" | undefined) ?? "result";
      body = (
        <div className="flex items-center gap-3 text-3xl font-black text-slate-800">
          {missing === "a" ? <NumericBlank value={response as number | undefined} onChange={setResponse} /> : <span>{d.a}</span>}
          <span>{d.op}</span>
          {missing === "b" ? <NumericBlank value={response as number | undefined} onChange={setResponse} /> : <span>{d.b}</span>}
          <span>=</span>
          {missing === "result" ? <NumericBlank value={response as number | undefined} onChange={setResponse} /> : <span>{d.result}</span>}
        </div>
      );
      break;
    }

    case "equation":
      body = (
        <div className="flex items-center gap-3 text-3xl font-black text-slate-800">
          <span>{d.left}</span>
          <span>{d.op === "x" ? "×" : "÷"}</span>
          <span>{d.right}</span>
          <span>=</span>
          <NumericBlank value={response as number | undefined} onChange={setResponse} />
        </div>
      );
      break;

    case "factFamilyDivide":
      body = (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-xl bg-amber-50 border-2 border-amber-200 px-4 py-2 text-lg font-semibold text-amber-800">
            {d.knownA} × {d.knownB} = {d.product}
          </div>
          <div className="flex items-center gap-3 text-3xl font-black text-slate-800">
            <span>{d.product}</span>
            <span>÷</span>
            <span>{d.divisor}</span>
            <span>=</span>
            <NumericBlank value={response as number | undefined} onChange={setResponse} />
          </div>
        </div>
      );
      break;

    case "barModelMultiplication":
      body = (
        <div className="flex flex-col items-center gap-4">
          <BarModelMultiplication groups={d.groups} perGroup={d.perGroup} unit={d.unit} />
          <NumericBlank value={response as number | undefined} onChange={setResponse} />
        </div>
      );
      break;

    case "barModelDivision":
      body = (
        <div className="flex flex-col items-center gap-4">
          <BarModelDivision total={d.total} groups={d.groups} perGroup={d.perGroup} mode={d.mode} />
          <NumericBlank value={response as number | undefined} onChange={setResponse} />
        </div>
      );
      break;

    case "barModelPartWhole":
      body = (
        <div className="flex flex-col items-center gap-4">
          <BarModelPartWhole whole={d.whole} known={d.known} part1={d.part1} part2={d.part2} hiddenLabel="" />
          <NumericBlank value={response as number | undefined} onChange={setResponse} />
        </div>
      );
      break;

    case "barModelCompare":
      body = (
        <div className="flex flex-col items-center gap-4">
          <BarModelCompare larger={d.larger} smaller={d.smaller} />
          <NumericBlank value={response as number | undefined} onChange={setResponse} />
        </div>
      );
      break;

    case "compareLengths":
      body = (
        <div className="flex gap-6 justify-center">
          {(d.options as Array<{ name: string; icon: string; length: number }>).map((opt) => (
            <button
              key={opt.name}
              type="button"
              onClick={() => setResponse(opt.name)}
              className={clsx(
                "flex flex-col items-center gap-2 rounded-2xl border-2 p-4",
                response === opt.name ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white",
              )}
            >
              <span className="text-4xl">{icon(opt.icon)}</span>
              <span className="font-semibold text-slate-700 capitalize">{opt.name}</span>
            </button>
          ))}
        </div>
      );
      break;

    case "chooseUnit":
      body = <ChoiceGrid choices={d.choices} value={response as string | undefined} onChange={setResponse} />;
      break;

    case "weightEstimate":
      body = <ChoiceGrid choices={d.choices} value={response as string | undefined} onChange={setResponse} />;
      break;

    case "rulerMeasure":
      body = (
        <RulerMeasure
          object={d.object}
          icon={d.icon}
          actualLength={d.actualLength}
          maxLength={d.maxLength}
          unit={d.unit}
          unitLabel={d.unitLabel}
          onChange={setResponse}
        />
      );
      readyToSubmit = !!response && typeof response === "object";
      break;

    case "numericAnswer":
      body = <NumericBlank value={response as number | undefined} onChange={setResponse} />;
      break;

    case "findMistake":
      body = (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setResponse(true)}
              className={clsx(response === true ? CHOICE_BUTTON_SELECTED : CHOICE_BUTTON_IDLE)}
            >
              Yes, that's right
            </button>
            <button
              type="button"
              onClick={() => setResponse(false)}
              className={clsx(response === false ? CHOICE_BUTTON_SELECTED : CHOICE_BUTTON_IDLE)}
            >
              No, that's a mistake
            </button>
          </div>
        </div>
      );
      readyToSubmit = response === true || response === false;
      break;

    default:
      body = <p className="text-slate-400">Unsupported question view: {prompt.view}</p>;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-2 max-w-md">
        <p className="text-xl font-semibold text-slate-800 text-center flex-1">{prompt.text}</p>
        <SpeakButton text={prompt.text} />
      </div>
      {body}
      <button type="button" disabled={disabled || !readyToSubmit} onClick={submit} className={PRIMARY_BUTTON}>
        Check my answer
      </button>
    </div>
  );
}
