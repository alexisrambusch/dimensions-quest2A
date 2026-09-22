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

  console.log("1. Visit / -> should redirect to /profiles");
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  console.log("   URL:", page.url());

  console.log("2. Select the seeded 'Explorer' profile");
  await page.getByText("Explorer", { exact: true }).click();
  await page.waitForURL("**/map", { timeout: 10000 });
  console.log("   URL:", page.url());
  await page.screenshot({ path: "/tmp/e2e-1-map.png" });

  console.log("3. Open Chapter 1, Lesson 1");
  await page.getByText("Counting and Building Numbers").click();
  await page.waitForURL("**/lesson/**", { timeout: 10000 });
  await page.screenshot({ path: "/tmp/e2e-2-briefing.png" });

  console.log("4. Begin Mission (-> Discover phase)");
  await page.getByRole("button", { name: "Begin Mission", exact: true }).click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "/tmp/e2e-3-discover.png" });

  console.log("5. Build the target place-value number in Discover");
  // Click + on hundreds/tens/ones enough times to match; read target from page text.
  // (Must be digit-anchored: the concept card's "Building Numbers with Blocks"
  // heading also renders earlier in the DOM and would otherwise match first.)
  const targetText = await page.locator("p").filter({ hasText: /Build \d+ using/ }).first().innerText();
  console.log("   Prompt:", targetText);
  const match = targetText.match(/Build (\d+)/);
  const target = match ? Number(match[1]) : 0;
  const h = Math.floor(target / 100);
  const t = Math.floor((target % 100) / 10);
  const o = target % 10;
  const plusButtons = page.getByRole("button", { name: /^Add a/ });
  for (let i = 0; i < h; i++) await plusButtons.nth(0).click();
  for (let i = 0; i < t; i++) await plusButtons.nth(1).click();
  for (let i = 0; i < o; i++) await plusButtons.nth(2).click();
  await page.getByRole("button", { name: "That's my number!", exact: true }).click();
  await page.getByRole("button", { name: "Check my answer", exact: true }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: "/tmp/e2e-4-discover-feedback.png" });

  console.log("6. Continue into Your Turn");
  await page.getByRole("button", { name: "Got it — let's practice!", exact: true }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: "/tmp/e2e-5-yourturn.png" });

  console.log("7. Request a hint on the first Your Turn question");
  await page.getByRole("button", { name: /I'd like a hint/ }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: "/tmp/e2e-6-hint.png" });

  async function answerCurrentQuestion(): Promise<void> {
    await page
      .getByText("Loading...")
      .waitFor({ state: "hidden", timeout: 6000 })
      .catch(() => {});
    const buildBtn = page.getByRole("button", { name: /That's my number!|Build \d+ to continue/ });
    if (await buildBtn.isVisible().catch(() => false)) {
      const promptText = await page.locator("p").filter({ hasText: /Build \d+/ }).first().innerText();
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
      const numberInput = page.locator('input[type="number"]').first();
      if (await numberInput.count()) {
        await numberInput.fill("1");
      } else {
        await page.locator("button").filter({ hasText: /^[<>=]$|centimeters|meters|grams|kilograms|Yes|No/ }).first().click();
      }
    }
    await page.getByRole("button", { name: "Check my answer", exact: true }).click();
    await page.waitForTimeout(600);
  }

  await answerCurrentQuestion();
  await page.screenshot({ path: "/tmp/e2e-7-feedback.png" });

  console.log("8. Click Next / Try again as needed to advance through the rest of the lesson");
  for (let i = 0; i < 20; i++) {
    const nextBtn = page.getByRole("button", { name: "Next", exact: true });
    const tryAgainBtn = page.getByRole("button", { name: "Try again", exact: true });
    const mapBtn = page.getByRole("button", { name: "Back to the Map", exact: true });
    const nextVisible = await nextBtn.isVisible().catch((e) => `ERR:${e}`);
    const tryAgainVisible = await tryAgainBtn.isVisible().catch((e) => `ERR:${e}`);
    const mapVisible = await mapBtn.isVisible().catch((e) => `ERR:${e}`);
    console.log(`   [iter ${i}] next=${nextVisible} tryAgain=${tryAgainVisible} map=${mapVisible}`);
    if (mapVisible === true) {
      console.log("   Reached lesson COMPLETE screen.");
      await page.screenshot({ path: "/tmp/e2e-8-complete.png" });
      break;
    }
    if (nextVisible === true) {
      await nextBtn.click();
      await page.waitForTimeout(500);
      if (await page.getByRole("button", { name: "Back to the Map", exact: true }).isVisible().catch(() => false)) {
        console.log("   Reached lesson COMPLETE screen.");
        await page.screenshot({ path: "/tmp/e2e-8-complete.png" });
        break;
      }
      await answerCurrentQuestion();
    } else if (tryAgainVisible === true) {
      await tryAgainBtn.click();
      await page.waitForTimeout(300);
      await answerCurrentQuestion();
    } else {
      await page.screenshot({ path: `/tmp/e2e-debug-iter${i}.png` });
      await answerCurrentQuestion();
    }
  }

  console.log("9. Reload the lesson page mid-flight to verify resume-in-place works");
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "/tmp/e2e-9-resume.png" });

  console.log("Done. Console/page errors captured:", errors.length);
  for (const e of errors) console.log("  -", e);

  await browser.close();
  process.exitCode = errors.length > 0 ? 1 : 0;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
