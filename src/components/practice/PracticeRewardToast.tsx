"use client";

import { ConfettiBurst } from "../ConfettiBurst";
import type { PracticeRewardResult } from "@/lib/actions/practiceRewards";

/** Small XP/coin toast for standalone Practice & Games activities, mirroring LessonRunner's reward feedback. */
export function PracticeRewardToast({ reward }: { reward: PracticeRewardResult }) {
  return (
    <div className="animate-pop-in relative text-center">
      {reward.leveledUp && <ConfettiBurst />}
      <p className="text-xs text-blue-500 font-semibold">
        +{reward.xpAwarded} XP{reward.coinsAwarded > 0 ? ` · +${reward.coinsAwarded} 🪙` : ""}
      </p>
      {reward.leveledUp && (
        <p className="animate-wiggle text-sm font-bold text-amber-700 mt-1">🎉 Level Up! You&apos;re now Level {reward.newLevel}!</p>
      )}
    </div>
  );
}
