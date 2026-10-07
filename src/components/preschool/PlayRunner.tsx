"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { getNextPreschoolActivity, recordPreschoolAttempt, type PreschoolActivityForClient, type PreschoolAttemptResult } from "@/lib/actions/preschool";
import { HuntGame } from "./games/HuntGame";
import { StickerCountGame } from "./games/StickerCountGame";
import { DragSortGame } from "./games/DragSortGame";
import { MatchPairsGame } from "./games/MatchPairsGame";
import { TraceGame } from "./games/TraceGame";
import { TapAnswerGame } from "./games/TapAnswerGame";
import { PracticeRewardToast } from "../practice/PracticeRewardToast";
import { CARD, PRIMARY_BUTTON } from "../ui";
import { ConfettiBurst } from "../ConfettiBurst";
import { playCoin } from "@/lib/sound";

interface Props {
  studentId: string;
  studentName: string;
}

const DOMAIN_LABEL: Record<string, string> = {
  LITERACY: "Letters & Words",
  PHONICS: "Letter Sounds",
  PHONOLOGICAL_AWARENESS: "Listening",
  READING: "Reading",
  WRITING: "Writing",
  MATH: "Numbers",
  SCIENCE: "Science",
  SOCIAL_STUDIES: "My World",
  SEL: "Feelings",
};

export function PlayRunner({ studentId, studentName }: Props) {
  const [activity, setActivity] = useState<PreschoolActivityForClient | null | undefined>(undefined);
  const [reward, setReward] = useState<PreschoolAttemptResult | null>(null);
  const [masteryBanner, setMasteryBanner] = useState<string | null>(null);

  async function loadNext() {
    setReward(null);
    setMasteryBanner(null);
    const next = await getNextPreschoolActivity(studentId);
    setActivity(next);
  }

  useEffect(() => {
    loadNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function finish(correct: boolean | null, response?: unknown) {
    if (!activity) return;
    const result = await recordPreschoolAttempt(studentId, activity.id, correct, response);
    if (result.coinsAwarded > 0) playCoin();
    if (result.masteryLeveledUp && result.masteryLevel) {
      setMasteryBanner(`${result.skillTitle}: now ${result.masteryLevel.toLowerCase().replace("_", " ")}!`);
    }
    setReward(result);
  }

  if (activity === undefined) {
    return (
      <div className={`${CARD} max-w-lg mx-auto text-center`}>
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (activity === null) {
    return (
      <div className={`${CARD} max-w-lg mx-auto text-center flex flex-col items-center gap-4 relative`}>
        <ConfettiBurst />
        <h1 className="text-2xl font-black text-emerald-600">You&apos;ve mastered everything here, {studentName}! 🎉</h1>
        <p className="text-slate-600">More skills are on the way — check back soon!</p>
      </div>
    );
  }

  if (reward) {
    return (
      <div className={`${CARD} max-w-lg mx-auto flex flex-col items-center gap-4 text-center relative`}>
        {reward.leveledUp && <ConfettiBurst />}
        <p className="text-xl font-black text-emerald-600">Nice work! 🌟</p>
        <PracticeRewardToast reward={{ xpAwarded: reward.xpAwarded, coinsAwarded: reward.coinsAwarded, leveledUp: reward.leveledUp, newLevel: reward.newLevel, newBadges: reward.newBadges }} />
        {masteryBanner && <p className="rounded-full bg-amber-100 text-amber-700 text-sm font-bold px-4 py-1.5 animate-pop-in">{masteryBanner}</p>}
        <button type="button" className={PRIMARY_BUTTON} onClick={loadNext}>
          Keep playing!
        </button>
      </div>
    );
  }

  return (
    <div className={`${CARD} max-w-lg mx-auto flex flex-col gap-5`}>
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-400">{DOMAIN_LABEL[activity.domain] ?? activity.domain}</p>
        <h2 className={clsx("text-xl font-black text-slate-800")}>{activity.title}</h2>
        <p className="text-slate-500 text-sm mt-1">{activity.instructions}</p>
      </div>

      {activity.engine === "hunt" && <HuntGame content={activity.content} onDone={() => finish(null)} />}
      {activity.engine === "stickerCount" && <StickerCountGame content={activity.content} onDone={() => finish(null)} />}
      {activity.engine === "dragSort" && <DragSortGame content={activity.content} onDone={() => finish(null)} />}
      {activity.engine === "matchPairs" && <MatchPairsGame content={activity.content} onDone={() => finish(null)} />}
      {activity.engine === "trace" && <TraceGame content={activity.content} studentName={studentName} onDone={() => finish(null)} />}
      {activity.engine === "tapAnswer" && <TapAnswerGame content={activity.content} onDone={(correct) => finish(correct)} />}
    </div>
  );
}
