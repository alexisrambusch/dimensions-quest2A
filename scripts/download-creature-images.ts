// One-shot content pipeline: downloads a real photo per shop creature from
// Wikipedia (CC-licensed / public-domain lead images) into public/creatures/,
// then updates src/lib/gamification/creatureImages.json so creatures.ts picks
// them up automatically. Safe to re-run — it skips codes already downloaded
// unless FORCE=1 is set, and never fails the whole run over one bad title.
//
// Requires outbound network access to en.wikipedia.org and upload.wikimedia.org
// (blocked by default in some Claude Code Remote environments — widen the
// environment's Network access setting first if fetches come back as errors).
//
// Usage: npx tsx scripts/download-creature-images.ts

import { writeFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { CREATURES } from "../src/lib/gamification/creatures";

const OUT_DIR = path.join(process.cwd(), "public", "creatures");
const MAP_PATH = path.join(process.cwd(), "src", "lib", "gamification", "creatureImages.json");
const FORCE = process.env.FORCE === "1";

// Wikipedia article title(s) to try, in order, for codes where the obvious
// guess (name with spaces -> underscores) isn't the real article title.
const WIKI_TITLES: Record<string, string[]> = {
  squirrel: ["Squirrel", "Eastern_gray_squirrel"],
  gray_wolf: ["Wolf"],
  zebra: ["Zebra", "Plains_zebra"],
  elephant: ["African_elephant", "African_bush_elephant"],
  dolphin: ["Dolphin", "Common_bottlenose_dolphin"],
  camel: ["Dromedary"],
  desert_tortoise: ["Desert_tortoise"],
  roadrunner: ["Greater_roadrunner"],
  rattlesnake: ["Sidewinder", "Sidewinder_(snake)"],
  beaver: ["Beaver", "North_American_beaver"],
  river_otter: ["North_American_river_otter"],
  black_bear: ["American_black_bear"],
  hippo: ["Hippopotamus"],
  rhino: ["Rhinoceros"],
};

function titleCandidates(code: string, name: string): string[] {
  if (WIKI_TITLES[code]) return WIKI_TITLES[code];
  return [name.replace(/ /g, "_")];
}

interface Summary {
  thumbnail?: { source: string };
  originalimage?: { source: string };
}

async function fetchThumbnail(title: string): Promise<string | null> {
  const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
    headers: { "User-Agent": "DimensionsQuest/1.0 (educational shop art; contact: local project)" },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as Summary;
  return data.thumbnail?.source ?? data.originalimage?.source ?? null;
}

function extFromUrl(url: string): string {
  const match = /\.(jpg|jpeg|png|webp)(?:$|\?)/i.exec(url);
  return match ? match[1].toLowerCase() : "jpg";
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const existingMap: Record<string, string> = JSON.parse(await readFile(MAP_PATH, "utf8").catch(() => "{}"));

  let downloaded = 0;
  let skipped = 0;
  const failed: string[] = [];

  for (const c of CREATURES) {
    if (existingMap[c.code] && !FORCE) {
      skipped++;
      continue;
    }

    let imageUrl: string | null = null;
    for (const title of titleCandidates(c.code, c.name)) {
      try {
        imageUrl = await fetchThumbnail(title);
        if (imageUrl) break;
      } catch {
        // try next candidate
      }
    }

    if (!imageUrl) {
      failed.push(`${c.code} (${c.name})`);
      continue;
    }

    try {
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      const ext = extFromUrl(imageUrl);
      const filename = `${c.code}.${ext}`;
      await writeFile(path.join(OUT_DIR, filename), buf);
      existingMap[c.code] = `/creatures/${filename}`;
      downloaded++;
      console.log(`✓ ${c.code} -> ${filename} (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (err) {
      failed.push(`${c.code} (${c.name}) — ${err instanceof Error ? err.message : "download failed"}`);
    }
  }

  await writeFile(MAP_PATH, JSON.stringify(existingMap, null, 2) + "\n");

  console.log(`\nDone. Downloaded ${downloaded}, skipped ${skipped} (already had an image), failed ${failed.length}.`);
  if (failed.length > 0) {
    console.log("\nFailed lookups (kept using the emoji fallback):");
    for (const f of failed) console.log(`  - ${f}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
