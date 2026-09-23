import { chromium } from "playwright";

const TARGETS = ["ch2-testA", "ch3-testB", "ch4-testA", "ch5-testB", "ch6-testA"];

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

  async function answerGeneric() {
    const buildBtn = page.getByRole("button", { name: /That's my number!|Build \d+ to continue/ });
    if (await buildBtn.isVisible().catch(() => false)) {
      const promptText = await page.locator("p").filter({ hasText: /Build \d+ using/ }).first().innerText();
      const match = promptText.match(/Build (\d+)/);
      const target = match ? Number(match[1]) : 0;
      const h = Math.floor(target / 100), t = Math.floor((target % 100) / 10), o = target % 10;
      const plusButtons = page.getByRole("button", { name: /^Add a/ });
      for (let i = 0; i < h; i++) await plusButtons.nth(0).click();
      for (let i = 0; i < t; i++) await plusButtons.nth(1).click();
      for (let i = 0; i < o; i++) await plusButtons.nth(2).click();
      await page.getByRole("button", { name: "That's my number!", exact: true }).click();
    } else {
      const rulerTrack = page.locator(".relative.h-10.bg-amber-50");
      const numberInputs = page.locator('input[type="number"]');
      if (await rulerTrack.isVisible().catch(() => false)) {
        const box = await rulerTrack.boundingBox();
        if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        const estimateInput = page.locator('input[type="number"]').first();
        if (await estimateInput.count()) await estimateInput.fill("5");
      } else if (await numberInputs.count()) {
        const count = await numberInputs.count();
        for (let i = 0; i < count; i++) await numberInputs.nth(i).fill("5");
      } else {
        const yesNo = page.getByRole("button", { name: /Yes, that's right|No, that's a mistake/ }).first();
        const compareLengthOpt = page.locator("button.rounded-2xl.border-2.p-4").first();
        if (await yesNo.isVisible().catch(() => false)) {
          await yesNo.click();
        } else if (await compareLengthOpt.isVisible().catch(() => false)) {
          await compareLengthOpt.click();
        } else {
          await page
            .locator("button")
            .filter({ hasText: /^[<>=]$|centimeters|meters|inches|feet|grams|kilograms|ounces|pounds|less than|more than/ })
            .first()
            .click();
        }
      }
    }
    const checkBtn = page.getByRole("button", { name: "Check my answer", exact: true });
    if (await checkBtn.isEnabled().catch(() => false)) {
      await checkBtn.click();
      await page.waitForTimeout(400);
    }
  }

  let allOk = true;
  for (const code of TARGETS) {
    console.log(`Testing ${code}...`);
    await page.goto(`http://localhost:3000/assessment/${code}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);
    const startBtn = page.getByRole("button", { name: "Start the Test", exact: true });
    if (!(await startBtn.isVisible().catch(() => false))) {
      console.error(`  FAIL: intro screen did not render for ${code}`);
      allOk = false;
      continue;
    }
    await startBtn.click();
    await page.waitForTimeout(400);

    let reachedResults = false;
    for (let i = 0; i < 14; i++) {
      const resultsHeading = page.getByRole("heading", { name: /You got \d+ of \d+/ });
      if (await resultsHeading.isVisible().catch(() => false)) {
        reachedResults = true;
        break;
      }
      if (code === "ch4-testA") {
        const promptText = await page
          .locator("p.text-xl.font-semibold")
          .first()
          .innerText()
          .catch(() => "<none>");
        console.log(`    [debug iter ${i}] prompt: ${promptText}`);
      }
      await answerGeneric();
    }
    await page.waitForTimeout(300);
    const finalCheck = await page.getByRole("heading", { name: /You got \d+ of \d+/ }).isVisible().catch(() => false);
    console.log(`  ${code}: reached results = ${finalCheck}`);
    if (!finalCheck) allOk = false;
    await page.screenshot({ path: `/tmp/e2e-assess-${code}.png` });
  }

  console.log("Console/page errors captured:", errors.length);
  for (const e of errors) console.log("  -", e);

  await browser.close();
  process.exitCode = errors.length > 0 || !allOk ? 1 : 0;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
