import test from "node:test";
import assert from "node:assert/strict";
import { parseInput, search, slugify } from "../lib/domain.ts";
import { seed } from "../lib/seed.ts";

function form() {
  const data = new FormData();
  for (const [key, value] of Object.entries({ name: " Framepad ", tagline: "A visual workspace", description: "A tool for designing and sharing work.", website: "https://example.com/#about", category: "Design", pricing: "Free", maker: "Studio North" })) data.set(key, value);
  return data;
}
test("input is trimmed and the website fragment is removed", () => {
  assert.equal(parseInput(form()).name, "Framepad");
  assert.equal(parseInput(form()).website, "https://example.com/");
});
test("non-HTTPS, credential-bearing, and malformed URLs are rejected", () => {
  for (const value of ["http://example.com", "https://user:password@example.com", "invalid website"]) {
    const data = form();
    data.set("website", value);
    assert.throws(() => parseInput(data), /valid HTTPS/);
  }
});
test("unknown categories are rejected", () => {
  const data = form(); data.set("category", "Unknown");
  assert.throws(() => parseInput(data), /valid category/);
});
test("search filters unpublished items and matches words across fields", () => {
  const unpublished = { ...seed[0], slug: "secret", status: "pending" as const };
  assert.deepEqual(search([...seed, unpublished], "visual north", "Design").map(item => item.slug), ["framepad"]);
});
test("top sort counts recorded votes and slug generation supports accents", () => {
  assert.equal(search(seed, "", "", "top")[0].slug, "framepad");
  assert.equal(slugify("Déjà Vu!"), "deja-vu");
});

test("weekly rounds reset on Monday at midnight UTC", async () => {
  const { startOfRound, nextRound, canVote } = await import("../lib/rounds.ts");
  const sunday = Date.parse("2026-11-15T23:59:59.999Z");
  const monday = sunday + 1;
  assert.equal(nextRound(sunday), "2026-11-16T00:00:00.000Z");
  assert.equal(startOfRound(monday), monday);
  const item = { ...seed[0], publishedAt: "2026-11-09T00:00:00.000Z" };
  assert.equal(canVote(item, sunday), true);
  assert.equal(canVote(item, monday), false);
});
