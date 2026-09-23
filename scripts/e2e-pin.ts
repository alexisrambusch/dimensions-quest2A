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

  console.log("1. First visit to /parent — should show PIN setup (no PIN yet)");
  await page.goto("http://localhost:3000/parent", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: "/tmp/e2e-pin-1-setup.png" });
  const setupHeading = await page.getByText("Set up a parent PIN").isVisible().catch(() => false);
  console.log("   Setup screen shown:", setupHeading);

  console.log("2. Set PIN to 1234");
  const inputs = page.locator('input[type="password"]');
  await inputs.nth(0).fill("1234");
  await inputs.nth(1).fill("1234");
  await page.getByRole("button", { name: "Set PIN", exact: true }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: "/tmp/e2e-pin-2-dashboard.png" });
  const dashboardShown = await page.getByText("Parent Dashboard").isVisible().catch(() => false);
  console.log("   Dashboard shown after setting PIN (auto-unlocked):", dashboardShown);

  console.log("3. Lock the dashboard");
  await page.getByRole("button", { name: "🔒 Lock", exact: true }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: "/tmp/e2e-pin-3-locked.png" });
  const pinPromptShown = await page.getByText("Parent PIN").isVisible().catch(() => false);
  console.log("   PIN entry prompt shown after lock:", pinPromptShown);

  console.log("4. Try wrong PIN");
  await page.locator('input[type="password"]').fill("0000");
  await page.getByRole("button", { name: "Unlock", exact: true }).click();
  await page.waitForTimeout(400);
  const wrongPinError = await page.getByText("That's not the right PIN.").isVisible().catch(() => false);
  console.log("   Wrong-PIN error shown:", wrongPinError);
  await page.screenshot({ path: "/tmp/e2e-pin-4-wrong.png" });

  console.log("5. Try correct PIN");
  await page.locator('input[type="password"]').fill("1234");
  await page.getByRole("button", { name: "Unlock", exact: true }).click();
  await page.waitForTimeout(600);
  const dashboardShown2 = await page.getByText("Parent Dashboard").isVisible().catch(() => false);
  console.log("   Dashboard shown after correct PIN:", dashboardShown2);
  await page.screenshot({ path: "/tmp/e2e-pin-5-unlocked.png" });

  console.log("Console/page errors captured:", errors.length);
  for (const e of errors) console.log("  -", e);

  const allGood = setupHeading && dashboardShown && pinPromptShown && wrongPinError && dashboardShown2;
  await browser.close();
  process.exitCode = errors.length > 0 || !allGood ? 1 : 0;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
