import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomUUID, createHash, createHmac, scryptSync } from "node:crypto";
import { writeFile, readFile, unlink, mkdir } from "node:fs/promises";
import path from "node:path";
import { setTimeout } from "node:timers/promises";
import { MongoClient } from "mongodb";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.MONGODB_URI) throw new Error("MongoDB is required for this isolated integration test.");
const dbName = "indierally_inquiry_test_" + Date.now();
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(dbName);
const origin = "http://127.0.0.1:3196";
const secret = "test-only-inquiry-secret-at-least-32-characters";
const adminPassword = "test-only-admin";
const ownerPassword = "test-only-inquiry-owner-password";
const outbox = path.resolve(".data", "inquiry-test-" + randomUUID() + ".jsonl");
await mkdir(path.dirname(outbox), { recursive: true });
let server;
const sha = value => createHash("sha256").update(value).digest("hex");
const token = randomUUID(), otherToken = randomUUID();
// Sessions use the application's validated 64-character token format.
const ownerToken = sha(token), outsiderToken = sha(otherToken);
const ownerId = randomUUID(), outsiderId = randomUUID();
const ownerCookie = "ld-account=" + ownerToken, outsiderCookie = "ld-account=" + outsiderToken;
const expiry = String(Date.now() + 3600000);
const adminCookie = "ld-admin=" + expiry + "." + createHmac("sha256", secret).update(expiry + ":" + adminPassword).digest("hex");
const request = (route, cookie = "") => fetch(origin + route, { headers: { cookie }, redirect: "manual" });
const html = async (route, cookie = "") => (await request(route, cookie)).text();
const decode = value => value.replaceAll("&quot;", '"').replaceAll("&amp;", "&").replaceAll("&#x27;", "'");
async function action(route, cookie, button, fields, stolenMarkup) {
  const markup = stolenMarkup ?? await html(route, cookie);
  const form = [...markup.matchAll(/<form\b[^>]*>([\s\S]*?)<\/form>/g)].map(match => match[1]).find(body => body.includes(button));
  assert.ok(form, "Form found: " + button);
  const data = new FormData();
  for (const input of form.matchAll(/<input\b[^>]*>/g)) {
    const name = input[0].match(/name="([^"]+)"/)?.[1];
    if (name?.startsWith("$ACTION_") || input[0].includes('type="hidden"')) data.set(decode(name), decode(input[0].match(/value="([^"]*)"/)?.[1] ?? ""));
  }
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return fetch(origin + route, { method: "POST", headers: { cookie, origin }, body: data, redirect: "manual" });
}
try {
  await client.connect();
  await db.collection("accounts").insertMany([{ _id: ownerId, name: "Owner", email: "owner@example.invalid", salt: "test-salt", passwordHash: scryptSync(ownerPassword, "test-salt", 64).toString("hex") }, { _id: outsiderId, name: "Outsider", email: "outsider@example.invalid" }]);
  await db.collection("sessions").insertMany([{ _id: sha(ownerToken), ownerId, expiresAt: new Date(Date.now() + 3600000) }, { _id: sha(outsiderToken), ownerId: outsiderId, expiresAt: new Date(Date.now() + 3600000) }]);
  server = spawn(process.execPath, ["--require", path.resolve("tests/inquiry-mail-stub.cjs"), "node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3196"], {
    env: { ...process.env, MONGODB_DB: dbName, SITE_URL: origin, SESSION_SECRET: secret, ADMIN_PASSWORD: adminPassword, RESET_GMAIL_USER: "", RESET_GMAIL_APP_PASSWORD: "", RESET_EMAIL_API_KEY: "test-only", RESET_EMAIL_FROM: "test@example.invalid", INQUIRY_TEST_OUTBOX: outbox }, stdio: "ignore",
  });
  for (let attempt = 0; ; attempt++) {
    try { assert.equal((await request("/contact")).status, 200); break; } catch (error) { if (attempt === 50) throw error; await setTimeout(500); }
  }
  const fields = { name: "Inquiry Owner", email: "owner@example.invalid", topic: "general", message: "A private test inquiry for our new launch.", fax: "" };
  const created = await action("/contact", ownerCookie, "Send message", fields);
  assert.equal(created.status, 303);
  const route = created.headers.get("location");
  const item = await db.collection("inquiries").findOne({ ownerId });
  assert.ok(item);
  assert.equal((await request(route, outsiderCookie)).status, 404);
  assert.equal((await request(route)).headers.get("location"), "/login?inquiry=" + item._id);
  assert.ok((await html("/login?inquiry=" + item._id)).includes('name="inquiry"'));
  const signedIn = await action("/login?inquiry=" + item._id, "", "Sign in", { email: "owner@example.invalid", password: ownerPassword });
  assert.equal(signedIn.status, 303);
  assert.equal(signedIn.headers.get("location"), route);
  assert.match(await html("/inquiries", ownerCookie), /private test inquiry/);
  assert.doesNotMatch(await html("/inquiries", outsiderCookie), /private test inquiry/);
  assert.match(await html("/inquiries", adminCookie), /private test inquiry/);
  const ownMarkup = await html(route, ownerCookie);
  assert.match(ownMarkup, /private test inquiry/);
  await action(route, outsiderCookie, "Send reply", { message: "Unauthorized attempt" }, ownMarkup);
  await action(route, outsiderCookie, "Permanently delete", { confirm: "on" }, ownMarkup);
  assert.equal((await db.collection("inquiries").findOne({ _id: item._id })).messages.length, 0);
  assert.equal((await action(route, ownerCookie, "Send reply", { message: "More detail from the owner." })).status, 303);
  await writeFile(outbox + ".fail", "fail");
  await action(route, adminCookie, "Save reply &amp; send email", { message: "Here is the answer from our team." });
  let saved = await db.collection("inquiries").findOne({ _id: item._id });
  assert.equal(saved.messages.at(-1).delivery, "failed");
  await unlink(outbox + ".fail");
  await action(route, adminCookie, "Retry email", { confirm: "on" });
  saved = await db.collection("inquiries").findOne({ _id: item._id });
  assert.equal(saved.messages.length, 2);
  assert.equal(saved.messages.at(-1).delivery, "sent");
  const sent = (await readFile(outbox, "utf8")).trim().split("\n").map(line => JSON.parse(line));
  assert.equal(sent.at(-1).to[0], fields.email);
  assert.ok(sent.at(-1).text.includes(origin + route));
  await action(route, adminCookie, "Close inquiry", { status: "closed" });
  assert.equal((await db.collection("inquiries").findOne({ _id: item._id })).status, "closed");
  assert.doesNotMatch(await html(route, ownerCookie), /<textarea/);
  await action(route, ownerCookie, "Reopen inquiry", { status: "open" });
  await action(route, ownerCookie, "Permanently delete", {});
  assert.ok(await db.collection("inquiries").findOne({ _id: item._id }));
  await action(route, ownerCookie, "Permanently delete", { confirm: "on" });
  assert.equal(await db.collection("inquiries").findOne({ _id: item._id }), null);
  const guestCreated = await action("/contact", "", "Send message", { ...fields, email: "guest@example.invalid" });
  const guestRoute = guestCreated.headers.get("location");
  assert.match(guestRoute, /\?token=[a-f0-9]{64}$/);
  assert.equal((await request(guestRoute)).status, 200);
  assert.equal((await request(guestRoute.split("?")[0])).status, 307);
  assert.equal((await request(guestRoute.replace(/token=.*/, "token=" + "0".repeat(64)))).status, 404);
  await action(guestRoute, "", "Send reply", { message: "Guest follow-up." });
  await action(guestRoute, adminCookie, "Save reply &amp; send email", { message: "Answer for the guest." });
  const guestMail = JSON.parse((await readFile(outbox, "utf8")).trim().split("\n").at(-1));
  assert.ok(guestMail.text.includes(origin + guestRoute));
  await action(guestRoute, adminCookie, "Permanently delete", { confirm: "on" });
  assert.equal((await request(guestRoute)).status, 404);
  console.log("Inquiry creation, privacy, owner/guest access, replies, simulated email failure/retry, close/reopen and both deletion roles passed. No real emails sent.");
} finally {
  if (server && server.exitCode === null && server.signalCode === null) {
    const ended = new Promise(resolve => server.once("exit", resolve)); server.kill(); await ended;
  }
  // Only the random database created by this test is eligible for cleanup.
  if (!/^indierally_inquiry_test_\d+$/.test(dbName)) throw new Error("Unsafe test database cleanup.");
  await db.dropDatabase();
  await client.close();
  for (const file of [outbox, outbox + ".fail"]) await unlink(file).catch(error => { if (error.code !== "ENOENT") throw error; });
}
