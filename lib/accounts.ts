import "server-only";
import { cache } from "react";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { mongoClient } from "./mongodb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cookieOptions, hash } from "./auth";

const derive = promisify(scrypt);
const lifetime = 7 * 86400;
type Account = { _id: string; email: string; name?: string; salt: string; passwordHash: string; resetHash?: string; resetExpiresAt?: Date; resetRequestedAt?: Date };
type Session = { _id: string; ownerId: string; expiresAt: Date };
const shared = globalThis as typeof globalThis & { accountStore?: ReturnType<typeof connect> };
async function connect() {
  const client = await mongoClient();
  const db = client.db(process.env.MONGODB_DB || "launchdeck");
  const accounts = db.collection<Account>("accounts");
  const sessions = db.collection<Session>("sessions");
  await accounts.createIndex({ email: 1 }, { unique: true });
  await accounts.createIndex({ resetHash: 1 }, { sparse: true, unique: true });
  await sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  return { accounts, sessions, client, db };
}
export function accountStore() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MongoDB is required for accounts.");
  return shared.accountStore ??= connect().catch(error => { delete shared.accountStore; throw error; });
}
export async function passwordDigest(password: string, salt: string) {
  return (await derive(password, salt, 64) as Buffer).toString("hex");
}
export function passwordMatches(actual: string, expected: string) {
  return timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
}
export async function startSession(ownerId: string) {
  const token = randomBytes(32).toString("hex");
  const { sessions } = await accountStore();
  const jar = await cookies();
  const old = jar.get("ld-account")?.value;
  if (old) await sessions.deleteOne({ _id: hash(old) });
  await sessions.insertOne({ _id: hash(token), ownerId, expiresAt: new Date(Date.now() + lifetime * 1000) });
  jar.set("ld-account", token, cookieOptions(lifetime));
}
export const currentAccount = cache(async function currentAccount() {
  const token = (await cookies()).get("ld-account")?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token) || !process.env.MONGODB_URI) return null;
  const { accounts, sessions } = await accountStore();
  const session = await sessions.findOne({ _id: hash(token), expiresAt: { $gt: new Date() } });
  return session ? accounts.findOne({ _id: session.ownerId }, { projection: { email: 1, name: 1 } }) : null;
});
export async function requireAccount() {
  const account = await currentAccount();
  if (!account) redirect("/login");
  return account;
}
export async function endSession() {
  const jar = await cookies();
  const token = jar.get("ld-account")?.value;
  if (token && process.env.MONGODB_URI) await (await accountStore()).sessions.deleteOne({ _id: hash(token) });
  jar.delete("ld-account");
}


