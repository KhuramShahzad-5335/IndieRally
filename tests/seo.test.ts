import test from "node:test";
import assert from "node:assert/strict";
import { pageMetadata, siteOrigin } from "../lib/seo.ts";

test("canonical origins respect deployment configuration and never default to localhost in production", () => {
  assert.equal(siteOrigin({ NODE_ENV: "production" }), "https://indierally.vercel.app");
  assert.equal(siteOrigin({ NODE_ENV: "development" }), "http://localhost:3000");
  assert.equal(siteOrigin({ SITE_URL: "https://example.com/subpath/?tracking=1" }), "https://example.com");
});

test("page metadata keeps canonical and sharing details consistent", () => {
  const metadata = pageMetadata("Pricing", "Compare launch services.", "/pricing");
  assert.equal(metadata.alternates?.canonical, "/pricing");
  assert.equal(metadata.openGraph?.url, "/pricing");
  assert.equal(metadata.openGraph?.title, metadata.title);
  assert.equal(metadata.twitter?.description, metadata.description);
});
