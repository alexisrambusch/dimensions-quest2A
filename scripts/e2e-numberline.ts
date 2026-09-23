import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", timeout: 15000 });
  const page = await browser.newPage({ viewport: { width: 500, height: 900 } });
  page.setDefaultTimeout(8000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
  });

  await page.goto("http://localhost:3000/profiles", { waitUntil: "domcontentloaded" });
  await page.getByText("Explorer", { exact: true }).click();
  await page.waitForURL("**/map", { timeout: 10000 });

  await page.goto("http://localhost:3000/lesson/ch1-l3", { waitUntil: "domcontentloaded" });
  const beginBtn = page.getByRole("button", { name: "Begin Mission", exact: true });
  if (await beginBtn.isVisible().catch(() => false)) {
    await beginBtn.click();
  }
  await page.waitForTimeout(1000);
  await page
    .getByText("Loading...")
    .waitFor({ state: "hidden", timeout: 6000 })
    .catch(() => {});
  await page.screenshot({ path: "/tmp/e2e-numberline-discover.png" });

  // Answer discover question then get into Your Turn to hopefully see numberline skill too
  // (skill selection is randomized, so just click through a couple to try to see it).
  async function clickThroughIfPresent() {
    const track = page.locator(".relative.h-16.cursor-pointer");
    if (await track.isVisible().catch(() => false)) {
      const box = await track.boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        await page.screenshot({ path: "/tmp/e2e-numberline-marked.png" });
      }
      return true;
    }
    return false;
  }

  let found = await clickThroughIfPresent();
  for (let i = 0; i < 6 && !found; i++) {
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);
    await page
      .getByText("Loading...")
      .waitFor({ state: "hidden", timeout: 6000 })
      .catch(() => {});
    found = await clickThroughIfPresent();
  }
  console.log("Number line question found on Discover:", found);

  console.log("Console/page errors captured:", errors.length);
  for (const e of errors) console.log("  -", e);

  await browser.close();
  process.exitCode = errors.length > 0 ? 1 : 0;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
