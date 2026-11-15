import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";

const origin = "http://127.0.0.1:3198";
// Read-only checks against the bundled local catalog, never the live database.
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3198"], {
  env: { ...process.env, MONGODB_URI: "", SITE_URL: origin }, stdio: "ignore",
});
async function page(route) {
  const response = await fetch(origin + route);
  assert.equal(response.status, 200, route);
  return response.text();
}
try {
  for (let attempt = 0; ; attempt++) {
    try { await page("/"); break; } catch (error) { if (attempt === 40) throw error; await setTimeout(500); }
  }
  for (const route of ["/about", "/contact", "/pricing", "/directories", "/blog", "/privacy", "/categories/design", "/products/framepad"]) {
    const html = await page(route);
    assert.match(html, /name="description" content="[^"]+"/, route);
    assert.match(html, /property="og:title" content="[^"]+"/, route);
    assert.match(html, /name="twitter:card" content="summary_large_image"/, route);
    assert.ok(html.includes(`rel="canonical" href="${origin}${route}"`), route);
  }
  for (const route of ["/login", "/signup", "/forgot-password", "/reset-password"]) {
    assert.match(await page(route), /name="robots" content="[^"]*noindex/, route);
  }
  assert.match(await page("/?q=visual"), /name="robots" content="[^"]*noindex/);
  assert.doesNotMatch(await page("/?utm_source=test"), /name="robots" content="[^"]*noindex/);
  const blog = await page("/blog/launch-checklist");
  assert.match(blog, /BlogPosting/);
  assert.match(blog, /property="article:published_time"/);
  const sitemap = await page("/sitemap.xml");
  assert.doesNotMatch(sitemap, /<loc>[^<]*\/(admin|login|signup|profile|dashboard|reset-password|status)(\/|<)/);
  const image = await fetch(origin + "/opengraph-image");
  assert.equal(image.status, 200);
  assert.match(image.headers.get("content-type"), /image\/png/);
  assert.ok((await image.arrayBuffer()).byteLength > 1000);
  console.log("Public metadata, canonical URLs, noindex, structured data, sitemap and social image verified.");
} finally {
  if (server.exitCode === null && server.signalCode === null) {
    const exited = new Promise(resolve => server.once("exit", resolve));
    server.kill();
    await exited;
  }
}
