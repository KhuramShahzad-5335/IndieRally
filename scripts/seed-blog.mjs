import nextEnv from "@next/env";
import { MongoClient } from "mongodb";
nextEnv.loadEnvConfig(process.cwd());
if (!process.env.MONGODB_URI) throw new Error("Set MONGODB_URI before importing the starter guides.");
const { seedPosts } = await import("../lib/blog-seed.ts");
const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
try {
  const collection = client.db(process.env.MONGODB_DB || "launchdeck").collection("blogPosts");
  await collection.createIndex({ slug: 1 }, { unique: true });
  const result = await collection.bulkWrite(seedPosts.map(post => ({ updateOne: { filter: { slug: post.slug }, update: { $setOnInsert: post }, upsert: true } })));
  console.log(`Imported ${result.upsertedCount} guides; existing saved articles were preserved.`);
} finally { await client.close(); }
