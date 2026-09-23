"use server";

import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const UNLOCK_COOKIE = "parent_unlocked";
const UNLOCK_MAX_AGE = 60 * 60 * 2; // 2 hours — long enough for one dashboard visit, short enough to re-lock itself
const HOUSEHOLD_PARENT_EMAIL = "alexisrambusch@gmail.com";

function hashPin(pin: string): string {
  return createHash("sha256").update(pin).digest("hex");
}

async function getHouseholdParent() {
  return prisma.parent.upsert({
    where: { email: HOUSEHOLD_PARENT_EMAIL },
    update: {},
    create: { email: HOUSEHOLD_PARENT_EMAIL, name: "Parent" },
  });
}

export async function getParentPinStatus(): Promise<{ hasPin: boolean }> {
  const parent = await getHouseholdParent();
  return { hasPin: !!parent.pinHash };
}

export async function isParentUnlocked(): Promise<boolean> {
  const parent = await getHouseholdParent();
  // No PIN configured yet: land on setup rather than skipping the gate
  // entirely, so a first visit always establishes a PIN before the
  // dashboard's data is reachable.
  if (!parent.pinHash) return false;
  const store = await cookies();
  return store.get(UNLOCK_COOKIE)?.value === parent.pinHash.slice(0, 16);
}

function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

/** First-time setup: choose a 4-digit PIN and unlock immediately. */
export async function setParentPin(pin: string): Promise<{ ok: boolean; error?: string }> {
  if (!isValidPin(pin)) return { ok: false, error: "PIN must be exactly 4 digits." };
  const parent = await getHouseholdParent();
  const pinHash = hashPin(pin);
  await prisma.parent.update({ where: { id: parent.id }, data: { pinHash } });
  const store = await cookies();
  store.set(UNLOCK_COOKIE, pinHash.slice(0, 16), { httpOnly: true, sameSite: "lax", path: "/", maxAge: UNLOCK_MAX_AGE });
  return { ok: true };
}

export async function verifyParentPin(pin: string): Promise<{ ok: boolean; error?: string }> {
  const parent = await getHouseholdParent();
  if (!parent.pinHash) return { ok: true };
  if (hashPin(pin) !== parent.pinHash) return { ok: false, error: "That's not the right PIN." };
  const store = await cookies();
  store.set(UNLOCK_COOKIE, parent.pinHash.slice(0, 16), { httpOnly: true, sameSite: "lax", path: "/", maxAge: UNLOCK_MAX_AGE });
  return { ok: true };
}

export async function lockParentDashboard(): Promise<void> {
  const store = await cookies();
  store.delete(UNLOCK_COOKIE);
}
