import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { MongoClient } from "mongodb";
import type { Listing } from "./domain";
import { seed } from "./seed";

type Match = Partial<Pick<Listing, "slug" | "status" | "trackingHash" | "ownerId">>;
interface Repository {
  find(match: Match): Promise<Listing[]>;
  create(listing: Listing): Promise<boolean>;
  update(match: Match, fields: Partial<Listing>, event: Listing["history"][number]): Promise<boolean>;
  vote(slug: string, voter: string, start: string, now: string): Promise<void>;
}

const directory = path.join(process.cwd(), ".data");
const file = path.join(directory, "listings.json");
const shared = globalThis as typeof globalThis & { launchdeckWrites?: Promise<unknown>; launchdeckMongo?: Promise<Repository> };
async function localRead(): Promise<Listing[]> {
  try { return JSON.parse(await readFile(file, "utf8")); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return structuredClone(seed); throw error; }
}
function mutate(operation: (items: Listing[]) => boolean) {
  const next = (shared.launchdeckWrites ?? Promise.resolve()).then(async () => {
    const items = await localRead();
    if (!operation(items)) return false;
    await mkdir(directory, { recursive: true });
    await writeFile(file + ".tmp", JSON.stringify(items, null, 2));
    await rename(file + ".tmp", file);
    return true;
  });
  shared.launchdeckWrites = next.catch(() => undefined);
  return next;
}
const matches = (item: Listing, match: Match) => Object.entries(match).every(([key, value]) => item[key as keyof Match] === value);
const local: Repository = {
  async find(match) { return (await localRead()).filter(item => matches(item, match)); },
  create(item) { return mutate(items => { if (items.some(existing => existing.slug === item.slug)) return false; items.push(item); return true; }); },
  update(match, fields, event) {
    return mutate(items => {
      const item = items.find(entry => matches(entry, match));
      if (!item) return false;
      Object.assign(item, fields);
      item.history.push(event);
      return true;
    });
  },
  async vote(slug, voter, start, now) {
    await mutate(items => {
      const item = items.find(entry => entry.slug === slug && entry.status === "published" && !!entry.publishedAt && entry.publishedAt >= start && entry.publishedAt <= now);
      if (!item || item.voters.includes(voter)) return false;
      item.voters.push(voter);
      return true;
    });
  },
};
async function mongo(uri: string): Promise<Repository> {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  try {
    await client.connect();
    const collection = client.db(process.env.MONGODB_DB || "launchdeck").collection<Listing>("launchdeck"); await collection.createIndex({ ownerId: 1, submittedAt: -1 });
    await collection.createIndex({ slug: 1 }, { unique: true });
    await collection.createIndex({ trackingHash: 1 }, { unique: true, sparse: true });
    await collection.createIndex({ status: 1, publishedAt: -1 });
    return {
      find: async match => (await collection.find(match).toArray()).map(({ _id, ...item }) => item),
      async create(item) {
        try { await collection.insertOne(item); return true; }
        catch (error) { if ((error as { code?: number }).code === 11000) return false; throw error; }
      },
      async update(match, fields, event) {
        return (await collection.updateOne(match, { $set: fields, $push: { history: event } })).matchedCount === 1;
      },
      async vote(slug, voter, start, now) {
        await collection.updateOne({ slug, status: "published", publishedAt: { $gte: start, $lte: now } }, { $addToSet: { voters: voter } });
      },
    };
  } catch (error) { await client.close(); throw error; }
}
export async function repository() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return local;
  return shared.launchdeckMongo ??= mongo(uri).catch(error => { delete shared.launchdeckMongo; throw error; });
}
