import type { PrismaClient } from "@/generated/prisma/client";

export interface MisconceptionSignal {
  pattern: string;
  description: string;
  evidence: Record<string, unknown>;
}

/**
 * Rule-based detection of specific, well-known error patterns (never guessed
 * by an LLM) — e.g. treating multiplication as addition, or dividing by the
 * wrong operand from a similar-looking fact family.
 */
export function detectMisconception(
  meta: Record<string, unknown> | undefined,
  response: unknown,
): MisconceptionSignal | null {
  if (!meta || typeof response !== "number") return null;
  const op = meta.op as string | undefined;
  const a = meta.a as number | undefined;
  const b = meta.b as number | undefined;
  if (a === undefined || b === undefined) return null;

  if (op === "x") {
    const correct = a * b;
    const additionGuess = a + b;
    if (response === additionGuess && additionGuess !== correct) {
      return {
        pattern: "MULT_AS_ADDITION",
        description: `Answered ${a} × ${b} as ${response}, which is ${a} + ${b} — treating multiplication as addition.`,
        evidence: { a, b, response, correct },
      };
    }
  }

  if (op === "d") {
    const candidates = [2, 5, 10].filter((c) => c !== b && a % c === 0);
    for (const c of candidates) {
      if (response === a / c) {
        return {
          pattern: "DIVISION_OPERAND_CONFUSION",
          description: `Answered ${a} ÷ ${b} as ${response}, which is ${a} ÷ ${c} — may be dividing by the wrong number.`,
          evidence: { a, b, confusedWith: c, response },
        };
      }
    }
  }

  return null;
}

/**
 * Log a signal, and only surface it as an active, reteach-triggering
 * misconception once the same pattern shows up more than once for the same
 * skill — a single slip isn't a misconception.
 */
export async function recordMisconceptionSignal(
  prisma: PrismaClient,
  studentId: string,
  skillCode: string,
  signal: MisconceptionSignal,
): Promise<{ shouldReteach: boolean }> {
  const existing = await prisma.misconception.findFirst({
    where: { studentId, skillCode, pattern: signal.pattern, status: "ACTIVE" },
    orderBy: { detectedAt: "desc" },
  });

  if (!existing) {
    await prisma.misconception.create({
      data: {
        studentId,
        skillCode,
        pattern: signal.pattern,
        evidenceJson: JSON.stringify([signal.evidence]),
      },
    });
    return { shouldReteach: false };
  }

  const priorEvidence: unknown[] = JSON.parse(existing.evidenceJson);
  const nextEvidence = [...priorEvidence, signal.evidence].slice(-5);
  await prisma.misconception.update({
    where: { id: existing.id },
    data: { evidenceJson: JSON.stringify(nextEvidence) },
  });

  return { shouldReteach: nextEvidence.length >= 2 };
}

export async function getActiveMisconceptions(prisma: PrismaClient, studentId: string, skillCode?: string) {
  return prisma.misconception.findMany({
    where: { studentId, status: "ACTIVE", ...(skillCode ? { skillCode } : {}) },
    orderBy: { detectedAt: "desc" },
  });
}

export async function resolveMisconception(prisma: PrismaClient, id: string): Promise<void> {
  await prisma.misconception.update({ where: { id }, data: { status: "RESOLVED", resolvedAt: new Date() } });
}
