import "server-only";
import { mongoClient } from "./mongodb";
type Inquiry = { name: string; email: string; topic: string; message: string; createdAt: Date; ownerId?: string };
export async function inbox() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MongoDB is required for contact requests.");
  const client = await mongoClient();
  return client.db(process.env.MONGODB_DB || "launchdeck").collection<Inquiry>("inquiries");
}
