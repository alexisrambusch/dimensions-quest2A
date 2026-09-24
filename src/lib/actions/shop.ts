"use server";

import { prisma } from "@/lib/prisma";
import { CREATURES, RARITY_WEIGHTS, type CreatureDef, type CreatureRarity } from "@/lib/gamification/creatures";
import { ORB_COST } from "@/lib/gamification/shopConfig";

export interface ShopCreatureEntry {
  code: string;
  name: string;
  description: string;
  icon: string;
  rarity: CreatureRarity;
  owned: boolean;
  count: number;
}

export interface ShopState {
  coins: number;
  orbCost: number;
  creatures: ShopCreatureEntry[];
}

/** Coins available and the full creature roster, with this student's owned counts merged in. */
export async function getShopState(studentId: string): Promise<ShopState> {
  const student = await prisma.student.findUniqueOrThrow({ where: { id: studentId }, select: { coins: true } });
  const owned = await prisma.studentCreature.findMany({ where: { studentId }, include: { creature: true } });
  const ownedByCode = new Map(owned.map((o) => [o.creature.code, o.count]));

  return {
    coins: student.coins,
    orbCost: ORB_COST,
    creatures: CREATURES.map((c) => ({
      code: c.code,
      name: c.name,
      description: c.description,
      icon: c.icon,
      rarity: c.rarity,
      owned: ownedByCode.has(c.code),
      count: ownedByCode.get(c.code) ?? 0,
    })),
  };
}

function pickRandomCreature(): CreatureDef {
  const totalWeight = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let roll = Math.random() * totalWeight;
  let rarity: CreatureRarity = "COMMON";
  for (const [r, weight] of Object.entries(RARITY_WEIGHTS) as Array<[CreatureRarity, number]>) {
    if (roll < weight) {
      rarity = r;
      break;
    }
    roll -= weight;
  }
  const pool = CREATURES.filter((c) => c.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

export interface OpenOrbResult {
  creature: { code: string; name: string; description: string; icon: string; rarity: CreatureRarity };
  isNew: boolean;
  coinsRemaining: number;
}

/** Spend a mystery orb: weighted-random pick from the roster, minted as a new collection row or an incremented duplicate. */
export async function openMysteryOrb(studentId: string): Promise<OpenOrbResult | { error: string }> {
  const student = await prisma.student.findUniqueOrThrow({ where: { id: studentId }, select: { coins: true } });
  if (student.coins < ORB_COST) return { error: "Not enough coins yet — keep leveling up!" };

  const picked = pickRandomCreature();
  const creatureRow = await prisma.creature.findUniqueOrThrow({ where: { code: picked.code } });

  const existing = await prisma.studentCreature.findUnique({
    where: { studentId_creatureId: { studentId, creatureId: creatureRow.id } },
  });

  if (existing) {
    await prisma.studentCreature.update({ where: { id: existing.id }, data: { count: { increment: 1 } } });
  } else {
    await prisma.studentCreature.create({ data: { studentId, creatureId: creatureRow.id } });
  }

  const updated = await prisma.student.update({
    where: { id: studentId },
    data: { coins: { decrement: ORB_COST } },
    select: { coins: true },
  });

  return {
    creature: {
      code: picked.code,
      name: picked.name,
      description: picked.description,
      icon: picked.icon,
      rarity: picked.rarity,
    },
    isNew: !existing,
    coinsRemaining: updated.coins,
  };
}
