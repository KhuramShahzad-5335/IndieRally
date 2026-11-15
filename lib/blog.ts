import "server-only";
import { cache } from "react";
import { mongoClient } from "./mongodb";
import { seedPosts } from "./blog-seed";
import type { BlogPost } from "./blog-domain";

export async function blogCollection() {
  const collection = (await mongoClient()).db(process.env.MONGODB_DB || "launchdeck").collection<BlogPost>("blogPosts");
  await collection.createIndex({ slug: 1 }, { unique: true });
  return collection;
}
export const allBlogPosts = cache(async () => {
  const posts = new Map(seedPosts.map(post => [post.slug, post]));
  if (process.env.MONGODB_URI) {
    const stored = await (await blogCollection()).find({}, { projection: { _id: 0 } }).toArray();
    for (const post of stored) posts.set(post.slug, post);
  }
  const base = process.env.BLOG_BLOB_BASE_URL?.replace(/\/$/, "");
  return [...posts.values()].map(post => base ? {
    ...post,
    image: post.image.startsWith("/editorial/") ? base + post.image : post.image,
    body: post.body.replace(/\]\(\/editorial\//g, "](" + base + "/editorial/"),
  } : post).sort((a, b) => (b.publishedAt ?? b.updatedAt).localeCompare(a.publishedAt ?? a.updatedAt));
});
export const publishedBlogPosts = cache(async () => (await allBlogPosts()).filter(post => post.status === "published"));
export const getBlogPost = cache(async (slug: string) => (await allBlogPosts()).find(post => post.slug === slug));
