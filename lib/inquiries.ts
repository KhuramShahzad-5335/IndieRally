import "server-only";
import { MongoClient } from "mongodb";
type Inquiry = { name: string; email: string; topic: string; message: string; createdAt: Date; ownerId?: string };
let connection: Promise<MongoClient> | undefined;
export async function inbox() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MongoDB is required for contact requests.");
  const client = await (connection ??= new MongoClient(uri, {serverSelectionTimeoutMS:8000}).connect().catch(error => { connection = undefined; throw error; }));
  return client.db(process.env.MONGODB_DB || "launchdeck").collection<Inquiry>("inquiries");
}
