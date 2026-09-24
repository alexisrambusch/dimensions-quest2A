"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { openMysteryOrb, type ShopState, type ShopCreatureEntry } from "@/lib/actions/shop";
import { CARD, PRIMARY_BUTTON } from "./ui";

const RARITY_CARD_STYLE: Record<string, string> = {
  COMMON: "border-slate-300 bg-slate-50",
  RARE: "border-blue-300 bg-blue-50",
  LEGENDARY: "border-amber-400 bg-amber-50",
};

const RARITY_LABEL: Record<string, string> = {
  COMMON: "Common",
  RARE: "Rare",
  LEGENDARY: "Legendary ✨",
};

const RARITY_TEXT_STYLE: Record<string, string> = {
  COMMON: "text-slate-500",
  RARE: "text-blue-600",
  LEGENDARY: "text-amber-600",
};

export function ShopClient({ studentId, initial }: { studentId: string; initial: ShopState }) {
  const [state, setState] = useState(initial);
  const [pulling, setPulling] = useState(false);
  const [reveal, setReveal] = useState<{ creature: ShopCreatureEntry; context: "new" | "duplicate" | "view" } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleOpen() {
    setPulling(true);
    setError(null);
    const res = await openMysteryOrb(studentId);
    setPulling(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setState((s) => ({
      ...s,
      coins: res.coinsRemaining,
      creatures: s.creatures.map((c) => (c.code === res.creature.code ? { ...c, owned: true, count: c.count + 1 } : c)),
    }));
    setReveal({
      creature: { ...res.creature, owned: true, count: 1 },
      context: res.isNew ? "new" : "duplicate",
    });
  }

  const canAfford = state.coins >= state.orbCost;

  return (
    <div className="flex flex-col gap-6">
      <div className={`${CARD} flex flex-col items-center gap-3 text-center`}>
        <p className="text-sm text-slate-500">Your coins</p>
        <p className="text-3xl font-black text-amber-600">{state.coins} 🪙</p>
        <button className={PRIMARY_BUTTON} onClick={handleOpen} disabled={!canAfford || pulling}>
          {pulling ? "Opening..." : `Open Mystery Orb (${state.orbCost} 🪙)`}
        </button>
        {!canAfford && <p className="text-xs text-slate-400">Earn more coins by leveling up!</p>}
        {error && <p className="text-xs text-rose-500 font-semibold">{error}</p>}
      </div>

      <div>
        <h2 className="text-lg font-black text-slate-800 mb-3">Your Collection</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {state.creatures.map((c) => (
            <button
              key={c.code}
              type="button"
              disabled={!c.owned}
              onClick={() => c.owned && setReveal({ creature: c, context: "view" })}
              className={clsx(
                "rounded-xl border-2 p-3 flex flex-col items-center gap-1 text-center touch-manipulation",
                c.owned ? `${RARITY_CARD_STYLE[c.rarity]} active:scale-95 transition-transform` : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed",
              )}
            >
              <span className="text-3xl">{c.owned ? c.icon : "❓"}</span>
              <p className="text-xs font-bold text-slate-700">{c.owned ? c.name : "???"}</p>
              {c.owned && c.count > 1 && <p className="text-[10px] text-slate-400">×{c.count}</p>}
            </button>
          ))}
        </div>
      </div>

      {reveal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setReveal(null)}
        >
          <div
            className={`${CARD} max-w-xs w-full flex flex-col items-center gap-3 text-center`}
            onClick={(e) => e.stopPropagation()}
          >
            {reveal.context !== "view" && (
              <p className="text-xs font-bold uppercase tracking-wide text-blue-400">
                {reveal.context === "new" ? "New Creature!" : "Another one joined the group!"}
              </p>
            )}
            <span className="text-6xl">{reveal.creature.icon}</span>
            <p className="text-xl font-black text-slate-800">{reveal.creature.name}</p>
            <p className={clsx("text-xs font-bold", RARITY_TEXT_STYLE[reveal.creature.rarity])}>
              {RARITY_LABEL[reveal.creature.rarity]}
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-bold">Fun fact: </span>
              {reveal.creature.description}
            </p>
            <button className={PRIMARY_BUTTON} onClick={() => setReveal(null)}>
              Nice!
            </button>
          </div>
        </div>
      )}

      <Link href="/map" className="text-sm font-semibold text-slate-500 hover:text-blue-700 text-center">
        ← Back to quest map
      </Link>
    </div>
  );
}
