"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { openMysteryOrb, type ShopState, type ShopCreatureEntry } from "@/lib/actions/shop";
import { HABITAT_ORDER, HABITAT_LABELS, HABITAT_ICONS, type CreatureHabitat } from "@/lib/gamification/creatures";
import { CARD, PRIMARY_BUTTON } from "./ui";
import { ConfettiBurst } from "./ConfettiBurst";
import { playPop, playLevelUp } from "@/lib/sound";

const RARITY_CARD_STYLE: Record<string, string> = {
  COMMON: "border-slate-300 bg-slate-50",
  UNCOMMON: "border-emerald-300 bg-emerald-50",
  RARE: "border-violet-300 bg-violet-50",
  LEGENDARY: "border-amber-400 bg-amber-50",
};

const RARITY_LABEL: Record<string, string> = {
  COMMON: "Common",
  UNCOMMON: "Uncommon",
  RARE: "Rare",
  LEGENDARY: "Legendary ✨",
};

const RARITY_TEXT_STYLE: Record<string, string> = {
  COMMON: "text-slate-500",
  UNCOMMON: "text-emerald-600",
  RARE: "text-violet-600",
  LEGENDARY: "text-amber-600",
};

/** Real photo when one's available, falling back to the emoji icon (also used while the photo loads or if it 404s). */
function CreatureArt({ icon, imagePath, alt, className }: { icon: string; imagePath: string | null; alt: string; className?: string }) {
  const [errored, setErrored] = useState(false);
  if (!imagePath || errored) return <span className={className}>{icon}</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- local /public photos of varying sizes, not worth next/image's overhead here
    <img src={imagePath} alt={alt} className={clsx(className, "object-cover rounded-md")} onError={() => setErrored(true)} />
  );
}

export function ShopClient({ studentId, initial }: { studentId: string; initial: ShopState }) {
  const [state, setState] = useState(initial);
  const [pulling, setPulling] = useState(false);
  const [reveal, setReveal] = useState<{ creature: ShopCreatureEntry; context: "new" | "duplicate" | "view" } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [habitatFilter, setHabitatFilter] = useState<CreatureHabitat | "ALL">("ALL");

  async function handleOpen() {
    setPulling(true);
    setError(null);
    try {
      const res = await openMysteryOrb(studentId);
      if ("error" in res) {
        setError(res.error);
        return;
      }
      setState((s) => ({
        ...s,
        coins: res.coinsRemaining,
        creatures: s.creatures.map((c) => (c.code === res.creature.code ? { ...c, owned: true, count: c.count + 1 } : c)),
      }));
      if (res.creature.rarity === "LEGENDARY") playLevelUp();
      else playPop();
      setReveal({
        creature: { ...res.creature, owned: true, count: 1 },
        context: res.isNew ? "new" : "duplicate",
      });
    } catch {
      setError("Something went wrong opening that orb — please try again.");
    } finally {
      setPulling(false);
    }
  }

  const canAfford = state.coins >= state.orbCost;
  const ownedTotal = state.creatures.filter((c) => c.owned).length;
  const habitats = HABITAT_ORDER.filter((h) => habitatFilter === "ALL" || h === habitatFilter);

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

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-800">
            Your Collection <span className="text-sm font-semibold text-slate-400">({ownedTotal}/{state.creatures.length})</span>
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setHabitatFilter("ALL")}
            className={clsx(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold border-2 touch-manipulation",
              habitatFilter === "ALL" ? "bg-violet-600 border-violet-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-violet-300",
            )}
          >
            All regions
          </button>
          {HABITAT_ORDER.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHabitatFilter(h)}
              className={clsx(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold border-2 touch-manipulation whitespace-nowrap",
                habitatFilter === h ? "bg-violet-600 border-violet-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-violet-300",
              )}
            >
              {HABITAT_ICONS[h]} {HABITAT_LABELS[h]}
            </button>
          ))}
        </div>

        {habitats.map((h) => {
          const inHabitat = state.creatures.filter((c) => c.habitat === h);
          const ownedInHabitat = inHabitat.filter((c) => c.owned).length;
          return (
            <div key={h} className="flex flex-col gap-2">
              <p className="text-sm font-bold text-slate-600">
                {HABITAT_ICONS[h]} {HABITAT_LABELS[h]}{" "}
                <span className="font-semibold text-slate-400">({ownedInHabitat}/{inHabitat.length})</span>
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {inHabitat.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    disabled={!c.owned}
                    onClick={() => c.owned && setReveal({ creature: c, context: "view" })}
                    className={clsx(
                      "rounded-xl border-2 p-3 flex flex-col items-center gap-1 text-center touch-manipulation",
                      c.owned
                        ? `${RARITY_CARD_STYLE[c.rarity]} active:scale-90 hover:-translate-y-0.5 transition-transform shadow-sm`
                        : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed",
                    )}
                  >
                    {c.owned ? (
                      <CreatureArt icon={c.icon} imagePath={c.imagePath} alt={c.name} className="text-3xl h-10 w-10 flex items-center justify-center" />
                    ) : (
                      <span className="text-3xl">❓</span>
                    )}
                    <p className="text-xs font-bold text-slate-700">{c.owned ? c.name : "???"}</p>
                    {c.owned && c.count > 1 && <p className="text-[10px] text-slate-400">×{c.count}</p>}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {reveal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setReveal(null)}
        >
          <div
            className={`${CARD} animate-bounce-in relative max-w-xs w-full flex flex-col items-center gap-3 text-center`}
            onClick={(e) => e.stopPropagation()}
          >
            {reveal.context !== "view" && reveal.creature.rarity === "LEGENDARY" && <ConfettiBurst />}
            {reveal.context !== "view" && (
              <p className="text-xs font-bold uppercase tracking-wide text-violet-400">
                {reveal.context === "new" ? "New Creature!" : "Another one joined the group!"}
              </p>
            )}
            <CreatureArt icon={reveal.creature.icon} imagePath={reveal.creature.imagePath} alt={reveal.creature.name} className="text-6xl h-24 w-24 flex items-center justify-center" />
            <p className="text-xl font-black text-slate-800">{reveal.creature.name}</p>
            <p className={clsx("text-xs font-bold", RARITY_TEXT_STYLE[reveal.creature.rarity])}>
              {RARITY_LABEL[reveal.creature.rarity]}
            </p>
            <p className="text-xs font-semibold text-slate-400">
              {HABITAT_ICONS[reveal.creature.habitat]} {HABITAT_LABELS[reveal.creature.habitat]}
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

      <Link href="/map" className="text-sm font-semibold text-slate-500 hover:text-violet-700 text-center">
        ← Back to quest map
      </Link>
    </div>
  );
}
