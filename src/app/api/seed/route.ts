import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seedDatabase";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * One-time database setup for deployments where a local shell with the
 * production DATABASE_URL isn't available (e.g. seeding straight from the
 * Vercel-hosted app). Protected by a secret so it can't be triggered by
 * anyone who finds the URL — visit /api/seed?secret=<SEED_SECRET> once.
 * Safe to call more than once; every write is an upsert.
 */
export async function GET(request: Request) {
  const configuredSecret = process.env.SEED_SECRET;
  if (!configuredSecret) {
    return NextResponse.json(
      { ok: false, error: "SEED_SECRET is not set in this deployment's environment variables." },
      { status: 500 },
    );
  }

  const providedSecret = new URL(request.url).searchParams.get("secret") ?? "";
  if (!providedSecret || !safeEqual(providedSecret, configuredSecret)) {
    return NextResponse.json({ ok: false, error: "Missing or incorrect secret." }, { status: 401 });
  }

  try {
    const log = await seedDatabase(prisma);
    return NextResponse.json({ ok: true, log });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
