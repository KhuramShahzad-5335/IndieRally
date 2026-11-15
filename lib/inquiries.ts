import "server-only";
import { mongoClient } from "./mongodb";
export type InquiryMessage = { id: string; role: "admin" | "user"; text: string; at: Date; deliveryAt?: Date; delivery?: "sending" | "sent" | "failed" };
export type Inquiry = { name: string; email: string; topic: string; message: string; createdAt: Date; ownerId?: string; status?: "open" | "answered" | "closed"; updatedAt?: Date; messages?: InquiryMessage[] };
export async function inbox() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MongoDB is required for contact requests.");
  const client = await mongoClient();
  return client.db(process.env.MONGODB_DB || "launchdeck").collection<Inquiry>("inquiries");
}
