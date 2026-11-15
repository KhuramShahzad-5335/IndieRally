import test from "node:test";
import assert from "node:assert/strict";
import { blogSections, parseBlog, validBlogImage } from "../lib/blog-domain.ts";
import { seedPosts } from "../lib/blog-seed.ts";

function form() {
  const data = new FormData();
  for (const [key, value] of Object.entries(seedPosts[3])) data.set(key, value);
  return data;
}
test("all bundled articles have valid editable content and unique URLs", () => {
  assert.equal(new Set(seedPosts.map(post => post.slug)).size, seedPosts.length);
  for (const post of seedPosts) {
    const data = new FormData();
    for (const [key, value] of Object.entries(post)) data.set(key, value);
    assert.equal(parseBlog(data).slug, post.slug);
    assert.ok(blogSections(post.body).length >= 3);
  }
});
test("article image URLs reject scripts, credentials and unrelated origins", () => {
  for (const value of ["javascript:alert(1)", "https://example.com/a.jpg", "https://public.blob.vercel-storage.com.evil.test/a.jpg", "https://user:pass@demo.public.blob.vercel-storage.com/a.jpg"]) assert.equal(validBlogImage(value), false);
  assert.equal(validBlogImage("https://demo.public.blob.vercel-storage.com/a.jpg"), true);
  assert.equal(validBlogImage("/editorial/launch-checklist.jpg"), true);
});
test("publishing validates visibility, body sections and embedded images", () => {
  for (const [key, value] of [["status", "hidden"], ["slug", "../secret"], ["body", "No heading " + "content ".repeat(20)], ["body", "## Intro\n\n" + "text ".repeat(20) + "\n\n![Example](https://evil.test/pixel)"]]) {
    const data = form(); data.set(key, value); assert.throws(() => parseBlog(data));
  }
});
test("case study is explicitly hypothetical and does not invent customer metrics", () => {
  const post = seedPosts.find(post => post.slug === "khuram-portfolio-launch-walkthrough")!;
  assert.equal(post.category, "Illustrative case study");
  assert.match(post.body, /campaign described below is hypothetical/);
  assert.match(post.description, /Not a client success claim/);
});
