"use client";

import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isMuted, toggleMuted, playClick } from "@/lib/sound";

const MUTE_EVENT = "dq-sound-mute-changed";

function subscribe(callback: () => void) {
  window.addEventListener(MUTE_EVENT, callback);
  return () => window.removeEventListener(MUTE_EVENT, callback);
}

function getServerSnapshot() {
  return false;
}

/** A small persistent mute toggle for the app's sound effects. */
export function SoundToggle() {
  const muted = useSyncExternalStore(subscribe, isMuted, getServerSnapshot);

  function toggle() {
    const next = toggleMuted();
    window.dispatchEvent(new Event(MUTE_EVENT));
    if (!next) playClick();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? "Turn sound on" : "Turn sound off"}
      aria-pressed={muted}
      className="fixed top-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur text-blue-600 shadow-md border border-blue-100 active:scale-95 transition-transform touch-manipulation"
    >
      {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
}
