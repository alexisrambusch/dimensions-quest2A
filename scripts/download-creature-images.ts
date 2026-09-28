// One-shot content pipeline: downloads a real photo per shop creature from
// Wikipedia (CC-licensed / public-domain lead images) into public/creatures/,
// then updates src/lib/gamification/creatureImages.json so creatures.ts picks
// them up automatically. Safe to re-run — it skips codes already downloaded
// unless FORCE=1 is set, and never fails the whole run over one bad title.
//
// Requires outbound network access to en.wikipedia.org and upload.wikimedia.org
// (blocked by default in some Claude Code Remote environments — widen the
// environment's Network access setting first if fetches come back as errors).
// Wikimedia rate-limits the shared egress IP some of these environments use —
// this script honors `retry-after` and backs off automatically, so a full run
// can take a while; progress is saved after every creature, so it's safe to
// stop and resume.
//
// Node's built-in fetch does NOT read HTTPS_PROXY/HTTP_PROXY by default (curl
// does, which is why the proxy can look "working" while this script still
// fails) — it needs NODE_USE_ENV_PROXY=1 set before the process starts, which
// `npm run creatures:images` already does.
//
// Usage: npm run creatures:images

import { writeFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { CREATURES } from "../src/lib/gamification/creatures";

const OUT_DIR = path.join(process.cwd(), "public", "creatures");
const MAP_PATH = path.join(process.cwd(), "src", "lib", "gamification", "creatureImages.json");
const FORCE = process.env.FORCE === "1";
const USER_AGENT = "DimensionsQuest/1.0 (educational shop art for a personal family project)";
const MAX_RETRIES = 4;
const PACE_MS = 500; // baseline delay between creatures, to stay a good citizen even without a 429

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetches a URL, honoring a 429's `retry-after` header (capped) with a few retries before giving up. */
async function fetchWithRetry(url: string, init?: RequestInit): Promise<Response> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(url, init);
    if (res.status !== 429) return res;
    if (attempt === MAX_RETRIES) return res;
    const retryAfter = Number(res.headers.get("retry-after"));
    const waitMs = Math.min(Number.isFinite(retryAfter) ? retryAfter * 1000 : 5000, 90_000);
    console.log(`  ...rate-limited, waiting ${Math.round(waitMs / 1000)}s before retrying`);
    await sleep(waitMs);
  }
  throw new Error("unreachable");
}

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
  rattlesnake: ["Sidewinder_(snake)", "Crotalus_cerastes", "Sidewinder"],
  beaver: ["Beaver", "North_American_beaver"],
  river_otter: ["North_American_river_otter"],
  black_bear: ["American_black_bear"],
  hippo: ["Hippopotamus"],
  rhino: ["Rhinoceros"],
  polar_bear: ["Polar_bear"],
  yak: ["Yak", "Domestic_yak", "Wild_yak"],
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
  const res = await fetchWithRetry(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
    headers: { "User-Agent": USER_AGENT },
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
  const map: Record<string, string> = JSON.parse(await readFile(MAP_PATH, "utf8").catch(() => "{}"));

  let downloaded = 0;
  let skipped = 0;
  const failed: string[] = [];

  for (const c of CREATURES) {
    if (map[c.code] && !FORCE) {
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
      await sleep(PACE_MS);
      continue;
    }

    try {
      const imgRes = await fetchWithRetry(imageUrl, { headers: { "User-Agent": USER_AGENT } });
      if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      const ext = extFromUrl(imageUrl);
      const filename = `${c.code}.${ext}`;
      await writeFile(path.join(OUT_DIR, filename), buf);
      map[c.code] = `/creatures/${filename}`;
      // Persist after every success so a long, throttled run can be stopped and resumed freely.
      await writeFile(MAP_PATH, JSON.stringify(map, null, 2) + "\n");
      downloaded++;
      console.log(`✓ ${c.code} -> ${filename} (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (err) {
      failed.push(`${c.code} (${c.name}) — ${err instanceof Error ? err.message : "download failed"}`);
    }

    await sleep(PACE_MS);
  }

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
