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

  // ch7-l2 is configured for the matching game (×5 facts). Force phase directly via URL.
  await page.goto("http://localhost:3000/lesson/ch7-l2", { waitUntil: "domcontentloaded" });
  const beginBtn = page.getByRole("button", { name: "Begin Mission", exact: true });
  if (await beginBtn.isVisible().catch(() => false)) await beginBtn.click();
  await page.waitForTimeout(800);
  await page.getByText("Loading...").waitFor({ state: "hidden", timeout: 6000 }).catch(() => {});

  // Quickly answer Discover + Your Turn + Challenge using generic numeric fill (value doesn't matter, we just need to progress).
  async function answerGeneric() {
    const numberInputs = page.locator('input[type="number"]');
    if (await numberInputs.count()) {
      const count = await numberInputs.count();
      for (let i = 0; i < count; i++) await numberInputs.nth(i).fill("10");
    } else {
      const yesNo = page.getByRole("button", { name: /Yes, that's right|No, that's a mistake/ }).first();
      const digitBtn = page.locator("button").filter({ hasText: /^\d+$/ }).first();
      if (await yesNo.isVisible().catch(() => false)) {
        await yesNo.click();
      } else if (await digitBtn.isVisible().catch(() => false)) {
        await digitBtn.click();
      }
    }
    const checkBtn = page.getByRole("button", { name: "Check my answer", exact: true });
    if (await checkBtn.isEnabled().catch(() => false)) {
      await checkBtn.click();
      await page.waitForTimeout(500);
    }
  }

  for (let i = 0; i < 30; i++) {
    const gameHeading = page.getByText("Fact Blast!");
    if (await gameHeading.isVisible().catch(() => false)) {
      console.log(`Reached Fact Blast after ${i} answers`);
      break;
    }
    const nextBtn = page.getByRole("button", { name: "Next", exact: true });
    const tryAgainBtn = page.getByRole("button", { name: "Try again", exact: true });
    const discoverContinueBtn = page.getByRole("button", { name: "Got it — let's practice!", exact: true });
    if (await discoverContinueBtn.isVisible().catch(() => false)) {
      await discoverContinueBtn.click();
      await page.waitForTimeout(500);
      await answerGeneric();
    } else if (await nextBtn.isVisible().catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(500);
      const nowGame = await page.getByText("Fact Blast!").isVisible().catch(() => false);
      if (nowGame) {
        console.log(`Reached Fact Blast after ${i + 1} answers (post-Next)`);
        break;
      }
      await answerGeneric();
    } else if (await tryAgainBtn.isVisible().catch(() => false)) {
      await tryAgainBtn.click();
      await page.waitForTimeout(300);
      await answerGeneric();
    } else {
      await answerGeneric();
    }
  }

  await page.waitForTimeout(800);
  await page.screenshot({ path: "/tmp/e2e-matchgame-board.png" });

  console.log("Playing the matching game (matching each equation to its answer)...");
  // Read equation and answer card texts, compute correct pairing, click through.
  const equationButtons = page.locator("div.grid > div:first-child button");
  const answerButtons = page.locator("div.grid > div:last-child button");
  const eqCount = await equationButtons.count();
  console.log("Equation card count:", eqCount);

  for (let round = 0; round < eqCount; round++) {
    // Find first not-yet-matched equation button (not disabled).
    const eqTexts = await equationButtons.allTextContents();
    let eqIndex = -1;
    for (let i = 0; i < eqTexts.length; i++) {
      const disabled = await equationButtons.nth(i).isDisabled();
      if (!disabled) {
        eqIndex = i;
        break;
      }
    }
    if (eqIndex === -1) break;
    const eqText = eqTexts[eqIndex].trim(); // e.g. "5 × 3"
    const match = eqText.match(/(\d+)\s*×\s*(\d+)/);
    const product = match ? Number(match[1]) * Number(match[2]) : NaN;
    await equationButtons.nth(eqIndex).click();

    const ansTexts = await answerButtons.allTextContents();
    let ansIndex = -1;
    for (let i = 0; i < ansTexts.length; i++) {
      const disabled = await answerButtons.nth(i).isDisabled();
      if (!disabled && Number(ansTexts[i].trim()) === product) {
        ansIndex = i;
        break;
      }
    }
    if (ansIndex === -1) {
      console.error("Could not find matching answer for", eqText, "product", product);
      break;
    }
    await answerButtons.nth(ansIndex).click();
    await page.waitForTimeout(150);
  }

  await page.waitForTimeout(500);
  await page.screenshot({ path: "/tmp/e2e-matchgame-done.png" });

  const continueBtn = page.getByRole("button", { name: "All matched! Continue", exact: true });
  const allMatched = await continueBtn.isVisible().catch(() => false);
  console.log("All matched, continue button visible:", allMatched);
  if (allMatched) {
    await continueBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: "/tmp/e2e-matchgame-after.png" });
  }

  console.log("Console/page errors captured:", errors.length);
  for (const e of errors) console.log("  -", e);

  await browser.close();
  process.exitCode = errors.length > 0 || !allMatched ? 1 : 0;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
