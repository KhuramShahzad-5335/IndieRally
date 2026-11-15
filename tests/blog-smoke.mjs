import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHmac } from "node:crypto";
import { setTimeout } from "node:timers/promises";
import { MongoClient } from "mongodb";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.MONGODB_URI) throw new Error("Configure MongoDB to run the isolated blog integration test.");
const name = "indierally_blog_test_" + Date.now();
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(name);
const origin = "http://127.0.0.1:3195";
const secret = "isolated-blog-test-secret-at-least-32-characters";
const password = "isolated-blog-admin";
const expiry = String(Date.now() + 3600000);
const cookie = "ld-admin=" + expiry + "." + createHmac("sha256", secret).update(expiry + ":" + password).digest("hex");
let server;
const get = (route, admin = false) => fetch(origin + route, { headers: { cookie: admin ? cookie : "" }, redirect: "manual" });
const html = async (route, admin = false) => (await get(route, admin)).text();
const decode = text => text.replaceAll("&quot;", '"').replaceAll("&amp;", "&").replaceAll("&#x27;", "'");
async function save(route, fields, admin = true, markup) {
  const source = markup ?? await html(route, true);
  const form = [...source.matchAll(/<form\b[^>]*>([\s\S]*?)<\/form>/g)].map(match => match[1]).find(body => body.includes("Save article"));
  assert.ok(form);
  const data = new FormData();
  for (const input of form.matchAll(/<input\b[^>]*>/g)) {
    const name = input[0].match(/name="([^"]+)"/)?.[1];
    if (name?.startsWith("$ACTION_")) data.set(decode(name), decode(input[0].match(/value="([^"]*)"/)?.[1] ?? ""));
  }
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return fetch(origin + route, { method: "POST", headers: { origin, cookie: admin ? cookie : "" }, body: data, redirect: "manual" });
}
const fields = { slug: "integration-guide", title: "A private integration guide", description: "A complete test guide that verifies our editorial publishing workflow.", author: "Test Editorial", category: "Launch guides", image: "/editorial/launch-checklist.jpg", imageAlt: "Notes on a desk for the test guide", body: "## A useful section\n\n" + "This is an isolated article used to verify publication and privacy. ".repeat(4), status: "draft" };
try {
  await client.connect();
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3195"], { env: { ...process.env, MONGODB_DB: name, SITE_URL: origin, ADMIN_PASSWORD: password, SESSION_SECRET: secret, BLOB_READ_WRITE_TOKEN: "test-invalid-token-never-used-for-real-uploads", BLOG_BLOB_BASE_URL: "" }, stdio: "ignore" });
  for (let attempt = 0; ; attempt++) {
    try { assert.equal((await get("/blog")).status, 200); break; } catch (error) { if (attempt === 50) throw error; await setTimeout(500); }
  }
  assert.equal((await get("/admin/blog")).headers.get("location"), "/admin");
  const newForm = await html("/admin/blog/new", true);
  await save("/admin/blog/new", fields, false, newForm);
  assert.equal(await db.collection("blogPosts").countDocuments(), 0);
  assert.equal((await save("/admin/blog/new", fields)).status, 303);
  assert.equal((await get("/blog/" + fields.slug)).status, 404);
  assert.doesNotMatch(await html("/blog"), /private integration guide/);
  assert.doesNotMatch(await html("/sitemap.xml"), /integration-guide/);
  const editRoute = "/admin/blog/" + fields.slug;
  const stale = await html(editRoute, true);
  assert.equal((await save(editRoute, { ...fields, status: "published" })).status, 303);
  assert.equal((await get("/blog/" + fields.slug)).status, 200);
  assert.match(await html("/sitemap.xml"), /integration-guide/);
  assert.match(await html("/blog/" + fields.slug), /BlogPosting/);
  await save(editRoute, { ...fields, title: "Stale overwrite attempt" }, true, stale);
  assert.equal((await db.collection("blogPosts").findOne({ slug: fields.slug })).title, fields.title);
  assert.equal((await save(editRoute, fields)).status, 303);
  assert.equal((await get("/blog/" + fields.slug)).status, 404);
  assert.doesNotMatch(await html("/sitemap.xml"), /integration-guide/);
  // A stored draft must suppress the public bundled fallback too.
  const existing = await html("/admin/blog/launch-checklist", true);
  assert.equal((await save("/admin/blog/launch-checklist", { ...fields, slug: "launch-checklist" }, true, existing)).status, 303);
  assert.equal((await get("/blog/launch-checklist")).status, 404);
  const upload = (admin, uploadOrigin, file) => { const data = new FormData(); data.set("image", file); return fetch(origin + "/api/admin/images", { method: "POST", headers: { origin: uploadOrigin, cookie: admin ? cookie : "" }, body: data }); };
  const badImage = new File(["<svg>not a jpeg</svg>"], "bad.jpg", { type: "image/jpeg" });
  assert.equal((await upload(false, origin, badImage)).status, 401);
  assert.equal((await upload(true, "https://untrusted.example", badImage)).status, 403);
  assert.equal((await upload(true, origin, badImage)).status, 400);
  const tooLarge = new File([new Uint8Array(3 * 1024 * 1024 + 1)], "large.jpg", { type: "image/jpeg" });
  assert.equal((await upload(true, origin, tooLarge)).status, 400);
  console.log("Blog draft privacy, publication, unpublication, sitemap, stale edit protection, admin access and upload guards passed. No real Blob uploads performed.");
} finally {
  if (server && server.exitCode === null && server.signalCode === null) { const ended = new Promise(resolve => server.once("exit", resolve)); server.kill(); await ended; }
  if (!/^indierally_blog_test_\d+$/.test(name)) throw new Error("Unsafe test database cleanup.");
  await db.dropDatabase(); await client.close();
}
