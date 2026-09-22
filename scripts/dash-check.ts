import { chromium } from "playwright";
async function main() {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const page = await browser.newPage({ viewport: { width: 500, height: 1100 } });
  page.setDefaultTimeout(8000);
  await page.goto("http://localhost:3000/profiles", { waitUntil: "domcontentloaded" });
  await page.getByText("Explorer", { exact: true }).click();
  await page.waitForURL("**/map", { timeout: 10000 });
  await page.goto("http://localhost:3000/parent", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: "/tmp/e2e-parent.png", fullPage: true });
  await browser.close();
}
main();
