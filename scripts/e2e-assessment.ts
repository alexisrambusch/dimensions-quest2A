import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", timeout: 15000 });
  const page = await browser.newPage({ viewport: { width: 500, height: 1000 } });
  page.setDefaultTimeout(8000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
  });

  await page.goto("http://localhost:3000/profiles", { waitUntil: "domcontentloaded" });
  await page.getByText("Explorer", { exact: true }).click();
  await page.waitForURL("**/map", { timeout: 10000 });
  await page.screenshot({ path: "/tmp/e2e-assess-1-map.png" });

  console.log("Opening Chapter 1 Test A directly");
  await page.goto("http://localhost:3000/assessment/ch1-testA", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "/tmp/e2e-assess-2-intro.png" });

  await page.getByRole("button", { name: "Start the Test", exact: true }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: "/tmp/e2e-assess-3-q1.png" });

  async function answerGeneric() {
    const buildBtn = page.getByRole("button", { name: /That's my number!|Build \d+ to continue/ });
    if (await buildBtn.isVisible().catch(() => false)) {
      const promptText = await page.locator("p").filter({ hasText: /Build \d+ using/ }).first().innerText();
      const match = promptText.match(/Build (\d+)/);
      const target = match ? Number(match[1]) : 0;
      const h = Math.floor(target / 100);
      const t = Math.floor((target % 100) / 10);
      const o = target % 10;
      const plusButtons = page.getByRole("button", { name: /^Add a/ });
      for (let i = 0; i < h; i++) await plusButtons.nth(0).click();
      for (let i = 0; i < t; i++) await plusButtons.nth(1).click();
      for (let i = 0; i < o; i++) await plusButtons.nth(2).click();
      await page.getByRole("button", { name: "That's my number!", exact: true }).click();
    } else {
      const numberLineTrack = page.locator(".relative.h-16.cursor-pointer");
      const numberInputs = page.locator('input[type="number"]');
      const sortChoiceBtns = page.getByText(/Tap numbers from least to greatest/);
      if (await numberLineTrack.isVisible().catch(() => false)) {
        const box = await numberLineTrack.boundingBox();
        if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      } else if (await sortChoiceBtns.isVisible().catch(() => false)) {
        // Sort-order: click the remaining number chips in whatever order they appear.
        const chips = page.locator("button.min-h-14.min-w-14.bg-white");
        const count = await chips.count();
        for (let i = 0; i < count; i++) {
          await chips.first().click();
        }
      } else if (await numberInputs.count()) {
        const count = await numberInputs.count();
        for (let i = 0; i < count; i++) await numberInputs.nth(i).fill("5");
      } else {
        await page
          .locator("button")
          .filter({ hasText: /^[<>=]$|centimeters|meters|grams|kilograms|Yes|No/ })
          .first()
          .click();
      }
    }
    await page.getByRole("button", { name: "Check my answer", exact: true }).click();
    await page.waitForTimeout(500);
  }

  for (let i = 0; i < 6; i++) {
    const resultsHeading = page.getByRole("heading", { name: /You got \d+ of \d+/ });
    if (await resultsHeading.isVisible().catch(() => false)) break;
    const promptText = await page
      .locator("p.text-xl, p.font-semibold")
      .first()
      .innerText()
      .catch(() => "<no prompt found>");
    console.log(`  [q${i}] prompt: ${promptText}`);
    await page.screenshot({ path: `/tmp/e2e-assess-debug-q${i}.png` });
    await answerGeneric();
  }

  await page.waitForTimeout(500);
  await page.screenshot({ path: "/tmp/e2e-assess-4-results.png", fullPage: true });

  const resultsVisible = await page.getByRole("heading", { name: /You got \d+ of \d+/ }).isVisible().catch(() => false);
  console.log("Reached results screen:", resultsVisible);

  console.log("Checking mission map shows best score badge");
  await page.getByRole("button", { name: "Back to the Map", exact: true }).click();
  await page.waitForURL("**/map", { timeout: 10000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "/tmp/e2e-assess-5-map-after.png" });

  console.log("Console/page errors captured:", errors.length);
  for (const e of errors) console.log("  -", e);

  await browser.close();
  process.exitCode = errors.length > 0 || !resultsVisible ? 1 : 0;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
