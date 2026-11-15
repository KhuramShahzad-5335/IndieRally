"use server";
import { randomBytes, randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { accountStore, endSession, passwordDigest, passwordMatches, startSession } from "@/lib/accounts";

export async function authenticate(mode: "signup" | "login", _: string, form: FormData) {
  if (!process.env.MONGODB_URI) return "Accounts require a configured database.";
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
  if (password.length < 12 || password.length > 128) return "Use a password of 12–128 characters.";
  try {
    const { accounts } = await accountStore();
    if (mode === "signup") {
      const name = String(form.get("name") ?? "").trim(); if(name.length<2||name.length>60)return "Use a display name of 2–60 characters."; const salt = randomBytes(16).toString("hex");
      const account = { _id: randomUUID(), email, name, salt, passwordHash: await passwordDigest(password, salt) };
      try { await accounts.insertOne(account); }
      catch (error) { if ((error as { code?: number }).code === 11000) return "Could not create an account with those details."; throw error; }
      await startSession(account._id);
    } else {
      const account = await accounts.findOne({ email });
      const digest = await passwordDigest(password, account?.salt ?? "missing-account");
      if (!account || !passwordMatches(digest, account.passwordHash)) return "Email or password is incorrect.";
      await startSession(account._id);
    }
  } catch { return "Account access is temporarily unavailable. Try again shortly."; }
  const vote = form.get("vote"); redirect(typeof vote === "string" && /^[a-z0-9-]{1,100}$/.test(vote) ? "/products/"+vote : "/dashboard");
}
export async function signOut() { await endSession(); redirect("/"); }
