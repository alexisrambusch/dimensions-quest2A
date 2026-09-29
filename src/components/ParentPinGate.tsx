"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { setParentPin, verifyParentPin } from "@/lib/actions/parentAuth";
import { CARD, PRIMARY_BUTTON } from "./ui";

export function ParentPinGate({ hasPin }: { hasPin: boolean }) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSetup(e: FormEvent) {
    e.preventDefault();
    if (pin !== confirmPin) {
      setError("Those two PINs don't match.");
      return;
    }
    setBusy(true);
    const res = await setParentPin(pin);
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Something went wrong.");
      return;
    }
    router.refresh();
  }

  async function handleUnlock(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await verifyParentPin(pin);
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Something went wrong.");
      setPin("");
      return;
    }
    router.refresh();
  }

  if (!hasPin) {
    return (
      <div className={`${CARD} max-w-sm mx-auto flex flex-col gap-4`}>
        <div>
          <h1 className="text-xl font-black text-slate-800">Set up a parent PIN</h1>
          <p className="text-sm text-slate-500 mt-1">
            This keeps the progress dashboard just for grown-ups. Pick any 4 digits.
          </p>
        </div>
        <form onSubmit={handleSetup} className="flex flex-col gap-3">
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="New PIN"
            className="text-center text-2xl tracking-[0.5em] rounded-xl border-2 border-slate-300 focus:border-violet-500 outline-none py-3"
          />
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
            placeholder="Confirm PIN"
            className="text-center text-2xl tracking-[0.5em] rounded-xl border-2 border-slate-300 focus:border-violet-500 outline-none py-3"
          />
          {error && <p className="text-sm text-rose-600 text-center">{error}</p>}
          <button type="submit" disabled={pin.length !== 4 || busy} className={PRIMARY_BUTTON}>
            Set PIN
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={`${CARD} max-w-sm mx-auto flex flex-col gap-4`}>
      <div>
        <h1 className="text-xl font-black text-slate-800">Parent PIN</h1>
        <p className="text-sm text-slate-500 mt-1">Enter your PIN to see the progress dashboard.</p>
      </div>
      <form onSubmit={handleUnlock} className="flex flex-col gap-3">
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          autoFocus
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          placeholder="PIN"
          className="text-center text-2xl tracking-[0.5em] rounded-xl border-2 border-slate-300 focus:border-violet-500 outline-none py-3"
        />
        {error && <p className="text-sm text-rose-600 text-center">{error}</p>}
        <button type="submit" disabled={pin.length !== 4 || busy} className={PRIMARY_BUTTON}>
          Unlock
        </button>
      </form>
    </div>
  );
}
