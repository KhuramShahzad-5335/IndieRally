import "server-only";
import { createHmac } from "node:crypto";
import { ObjectId } from "mongodb";
import { currentAccount } from "./accounts";
import { equal, isAdmin } from "./auth";
import { inbox } from "./inquiries";

export function guestInquiryToken(id: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("Guest inquiry access requires SESSION_SECRET.");
  return createHmac("sha256", secret).update("inquiry:" + id).digest("hex");
}

export async function inquiryAccess(id: string, token = "") {
  if (!/^[a-f0-9]{24}$/.test(id)) return null;
  const item = await (await inbox()).findOne({ _id: new ObjectId(id) });
  if (!item) return null;
  if (await isAdmin()) return { item, admin: true, token: "" };
  if (item.ownerId) {
    const account = await currentAccount();
    return account?._id === item.ownerId ? { item, admin: false, token: "" } : null;
  }
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  try {
    return equal(token, guestInquiryToken(id)) ? { item, admin: false, token } : null;
  } catch { return null; }
}

export function inquiryPath(id: string, token = "") {
  return "/inquiries/" + id + (token ? "?token=" + encodeURIComponent(token) : "");
}
