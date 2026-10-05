"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Thin wrapper around the browser's built-in SpeechSynthesis API, so questions and
 * instructions can be read aloud to students who can't yet read fluently. No network
 * calls or API keys — it's entirely on-device, so it works offline too.
 */
export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  // Stop any in-progress speech when this button leaves the screen (e.g. the student
  // moves on to the next question before the previous one finished reading).
  useEffect(() => {
    if (!supported) return;
    return () => window.speechSynthesis.cancel();
  }, [supported]);

  const speak = useCallback(
    (text: string) => {
      if (!supported || !text) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.05;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [supported],
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return { speak, stop, speaking, supported };
}
