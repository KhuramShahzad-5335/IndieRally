import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, cp, rm } from "node:fs/promises";
import path from "node:path";
import { setTimeout } from "node:timers/promises";

const root = process.cwd();
const sandbox = await mkdtemp(path.join(root, ".smoke-"));
const origin = "http://127.0.0.1:3199";
const password = "workflow-local-only";
let server;
let session = "";
async function get(route, status = 200) {
  const response = await fetch(origin + route, { headers: { cookie: session } });
  assert.equal(response.status, status, route);
  return response.text();
}
async function post(route, fields, index = 0) {
  const html = await get(route);
  const actions = [...html.matchAll(/name="(\$ACTION_(?:REF|ID)_[^"]+)"(?: value="([^"]*)")?/g)];
  const action = actions[index];
  assert.ok(action, "Server action marker");
  const payload = new FormData();
  payload.set(action[1], action[2] || "");
  if (action[1].startsWith("$ACTION_REF_")) {
    const prefix = "$ACTION_" + action[1].slice(12) + ":";
    for (const match of html.matchAll(/name="(\$ACTION_[^"]+)" value="([^"]*)"/g)) {
      if (match[1].startsWith(prefix)) payload.set(match[1], match[2].replaceAll("&quot;", '"').replaceAll("&amp;", "&"));
    }
  }
  for (const [key, value] of Object.entries(fields)) payload.set(key, value);
  const response = await fetch(origin + route, { method: "POST", body: payload, headers: { cookie: session, origin }, redirect: "manual" });
  const cookie = response.headers.get("set-cookie")?.split(";")[0];
  if (cookie) session = cookie;
  assert.equal(response.status, 303, (await response.text()).slice(0, 300));
  return response.headers.get("location");
}
try {
  // Isolate all writes from the developer's catalog.
  const isolated = path.join(sandbox, ".next");
  await cp(path.join(root, ".next"), isolated, { recursive: true, filter: source => !source.startsWith(sandbox) && !source.includes(path.sep + "cache") });
  server = spawn(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", "3199"], {
    cwd: sandbox, env: { ...process.env, MONGODB_URI: "", ADMIN_PASSWORD: password, SESSION_SECRET: "isolated-smoke-key-at-least-32-characters" }, stdio: "ignore",
  });
  for (let attempt = 0; ; attempt++) {
    try { await get("/"); break; } catch (error) { if (attempt === 30) throw error; await setTimeout(500); }
  }
  const fields = { name: "Workflow Test", maker: "Test Team", website: "https://example.com/", tagline: "A sample that verifies the moderation pipeline", category: "Design", pricing: "Free", description: "A temporary listing to verify the complete moderation loop." };
  const tracking = await post("/submit", fields);
  assert.match(tracking, /^\/status\/[a-f0-9]{48}$/);
  assert.match(await get(tracking), /In review/);
  await get("/products/workflow-test", 404);
  await post("/admin", { password });
  await post("/admin", { decision: "changes", note: "Please add more detail." }, 1);
  assert.match(await get(tracking), /Please add more detail/);
  await post(tracking, { ...fields, description: "This revised listing provides detail for the moderation test." });
  await post("/admin", { decision: "published" }, 1);
  assert.match(await get(tracking), /Scheduled/);
  await get("/products/workflow-test", 404);
  assert.doesNotMatch(await get("/sitemap.xml"), /products\/workflow-test/);
  console.log("Submission, revision, scheduling and pre-launch visibility verified.");
} finally {
  if (server && server.exitCode === null && server.signalCode === null) {
    const exited = new Promise(resolve => server.once("exit", resolve));
    server.kill();
    await exited;
  }
  await rm(sandbox, { recursive: true, force: true });
}
