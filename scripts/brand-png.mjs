// Renders PNG brand assets (logo PNGs, apple-icon, share image) from the SVGs that
// make-logo.py writes. Run after it:  node scripts/brand-png.mjs
// Uses the globally installed @playwright/cli package and the local Chrome install.
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

// Playwright comes from the global @playwright/cli install, not this project.
const requireGlobal = createRequire(import.meta.url);
const { chromium } = requireGlobal("C:/Program Files/nodejs/node_modules/@playwright/cli/node_modules/playwright");

const STORE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const brand = (f) => pathToFileURL(path.join(STORE, "public/brand", f)).href;
const img = (f) => pathToFileURL(path.join(STORE, "public/images/kits", f)).href;
// The share image's headline uses Fredoka, loaded from Google Fonts at render time only.
const FREDOKA_CSS = "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&display=block";

const pages = [
  // [output, width, height, transparent, html body]
  ["public/brand/tinkupop-mark-512.png", 512, 512, true, `<img src="${brand("tinkupop-mark.svg")}" style="width:512px;height:512px">`],
  ["public/brand/tinkupop-mark-1024.png", 1024, 1024, true, `<img src="${brand("tinkupop-mark.svg")}" style="width:1024px;height:1024px">`],
  ["public/brand/tinkupop-logo.png", 1600, 400, true, `<div style="height:400px;display:flex;align-items:center;justify-content:center"><img src="${brand("tinkupop-logo.svg")}" style="height:320px"></div>`],
  ["public/brand/tinkupop-logo-dark.png", 1600, 400, true, `<div style="height:400px;display:flex;align-items:center;justify-content:center"><img src="${brand("tinkupop-logo-dark.svg")}" style="height:320px"></div>`],
  // iOS home-screen icon: opaque, iOS rounds the corners itself.
  ["src/app/apple-icon.png", 180, 180, false, `<div style="width:180px;height:180px;background:#f4f7ff;display:flex;align-items:center;justify-content:center"><img src="${brand("tinkupop-mark.svg")}" style="width:150px;height:150px"></div>`],
  // Share card for WhatsApp, Facebook, X, LinkedIn.
  ["src/app/opengraph-image.png", 1200, 630, false, `
    <style>
      @import url("${FREDOKA_CSS}");
      .card { width:1200px;height:630px;position:relative;overflow:hidden;font-family:Fredoka,sans-serif;
        background:#f4f7ff radial-gradient(#dde4f6 1.6px, transparent 1.6px) 0 0/30px 30px; }
      .glow { position:absolute;border-radius:50%;filter:blur(70px); }
      .photo { position:absolute;background:#fff;padding:12px;border-radius:36px;
        box-shadow: inset 5px 5px 12px rgba(255,255,255,.75), 0 30px 50px -20px rgba(58,72,150,.35); }
      .photo img { display:block;width:100%;height:100%;object-fit:cover;border-radius:26px; }
      h1 { margin:0;font-size:76px;line-height:1.02;font-weight:700;color:#1b1f3b;letter-spacing:-1px; }
      .mk { background:linear-gradient(transparent 58%, rgba(255,200,61,.6) 58%);border-radius:10px;padding:0 6px; }
      p { margin:22px 0 0;font-size:30px;font-weight:500;color:#565d7f; }
    </style>
    <div class="card">
      <div class="glow" style="width:520px;height:520px;background:rgba(255,200,61,.35);right:-80px;top:-60px"></div>
      <div class="glow" style="width:380px;height:380px;background:rgba(255,92,154,.18);right:260px;bottom:-120px"></div>
      <div style="position:absolute;left:64px;top:56px"><img src="${brand("tinkupop-logo.svg")}" style="height:84px"></div>
      <div style="position:absolute;left:64px;top:205px;width:600px">
        <h1>Turn Your Child Into a <span class="mk">Young Entrepreneur</span></h1>
        <p>Hands-on business kits for ages 8 to 16</p>
      </div>
      <div class="photo" style="width:470px;height:350px;right:120px;top:60px;transform:rotate(3deg)"><img src="${img("microgreens-realistic.jpg")}"></div>
      <div class="photo" style="width:250px;height:188px;right:30px;top:398px;transform:rotate(-6deg)"><img src="${img("escape-box-realistic.jpg")}"></div>
    </div>`],
];

(async () => {
  const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  for (const [out, w, h, transparent, body] of pages) {
    const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
    const file = path.join(os.tmpdir(), "tinkupop-render.html");
    fs.writeFileSync(file, `<!doctype html><html><body style="margin:0;background:${transparent ? "transparent" : "#fff"}">${body}</body></html>`);
    await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(STORE, out), omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h } });
    console.log("wrote", out);
    await page.context().close();
  }
  await browser.close();
})();
