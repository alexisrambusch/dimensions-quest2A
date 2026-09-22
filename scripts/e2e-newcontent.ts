import { chromium } from "playwright";

const BASE = "http://localhost:3000";

async function main() {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", timeout: 15000 });
  const page = await browser.newPage({ viewport: { width: 500, height: 900 } });
  page.setDefaultTimeout(8000);
  page.setDefaultNavigationTimeout(15000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
  });

  await page.goto(BASE + "/profiles", { waitUntil: "domcontentloaded" });
  await page.getByText("Explorer", { exact: true }).click();
  await page.waitForURL("**/map", { timeout: 10000 });

  async function visitLessonAndScreenshot(code: string, label: string) {
    console.log(`Visiting lesson ${code} (${label})`);
    await page.goto(`${BASE}/lesson/${code}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);
    const beginBtn = page.getByRole("button", { name: "Begin Mission", exact: true });
    if (await beginBtn.isVisible().catch(() => false)) {
      await beginBtn.click();
      await page.waitForTimeout(1200);
    }
    await page
      .getByText("Loading...")
      .waitFor({ state: "hidden", timeout: 6000 })
      .catch(() => {});
    await page.screenshot({ path: `/tmp/e2e-new-${label}.png` });
  }

  await visitLessonAndScreenshot("ch6-l2", "arrays"); // true rows x cols grid
  await visitLessonAndScreenshot("ch4-l3", "inches"); // customary length
  await visitLessonAndScreenshot("ch4-l4", "compare-lengths");
  await visitLessonAndScreenshot("ch5-l3", "pounds"); // customary weight

  console.log("Console/page errors captured:", errors.length);
  for (const e of errors) console.log("  -", e);

  await browser.close();
  process.exitCode = errors.length > 0 ? 1 : 0;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
