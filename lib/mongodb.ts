import "server-only";
import { MongoClient } from "mongodb";

const shared = globalThis as typeof globalThis & { indieRallyMongoClient?: Promise<MongoClient> };

/** Reuse one connection pool across repositories and development hot reloads. */
export function mongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MongoDB is not configured.");
  return shared.indieRallyMongoClient ??= (async () => {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
    try {
      return await client.connect();
    } catch (error) {
      await client.close();
      delete shared.indieRallyMongoClient;
      throw error;
    }
  })();
}
