"use server";

import nodemailer from "nodemailer";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { accountStore, passwordDigest } from "@/lib/accounts";
import { hash } from "@/lib/auth";

export async function requestReset(_: string, form: FormData): Promise<string> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
  const { RESET_EMAIL_API_KEY, RESET_EMAIL_FROM, SITE_URL, MONGODB_URI, RESET_GMAIL_USER, RESET_GMAIL_APP_PASSWORD } = process.env;
  const gmail = RESET_GMAIL_USER && RESET_GMAIL_APP_PASSWORD;
  if ((!gmail && (!RESET_EMAIL_API_KEY || !RESET_EMAIL_FROM)) || !SITE_URL || !MONGODB_URI) return "Password reset email is currently unavailable.";
  try {
    const { accounts } = await accountStore();
    const token = randomBytes(32).toString("hex");
    const now = new Date();
    const link = new URL("/reset-password", SITE_URL);
    link.searchParams.set("token", token);
    const result = await accounts.updateOne(
      { email, $or: [{ resetRequestedAt: { $lt: new Date(now.getTime() - 300000) } }, { resetRequestedAt: { $exists: false } }] },
      { $set: { resetHash: hash(token), resetExpiresAt: new Date(now.getTime() + 1800000), resetRequestedAt: now } },
    );
    const subject = "Reset your IndieRally password";
    const text = "Use this link within 30 minutes to reset your password.\n\n" + link.href + "\n\nIf you did not request this, you can ignore this message.";
    if (result.modifiedCount && gmail) {
      const smtp = nodemailer.createTransport({
        host: "smtp.gmail.com", port: 465, secure: true,
        auth: { user: RESET_GMAIL_USER, pass: RESET_GMAIL_APP_PASSWORD?.replace(/\s/g, "") },
        connectionTimeout: 5000, greetingTimeout: 5000, socketTimeout: 8000,
      });
      await smtp.sendMail({ from: { name: "IndieRally", address: RESET_GMAIL_USER! }, to: email, subject, text, disableFileAccess: true, disableUrlAccess: true });
    } else if (result.modifiedCount) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: "Bearer " + RESET_EMAIL_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ from: RESET_EMAIL_FROM, to: [email], subject, text }),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) console.error("Password reset email rejected", response.status);
    }
  } catch {
    console.error("Password reset request failed.");
  }
  redirect("/forgot-password?sent=1");
}

export async function resetPassword(_: string, form: FormData): Promise<string> {
  const token = String(form.get("token") ?? "");
  const password = String(form.get("password") ?? "");
  if (!/^[a-f0-9]{64}$/.test(token)) return "This reset link is invalid.";
  if (password.length < 12 || password.length > 128) return "Use a password of 12–128 characters.";
  if (password !== form.get("confirm")) return "Passwords must match.";
  try {
    const { accounts, sessions, client } = await accountStore();
    const resetHash = hash(token);
    if (!await accounts.findOne({ resetHash, resetExpiresAt: { $gt: new Date() } }, { projection: { _id: 1 } })) return "This reset link has expired or has already been used.";
    const salt = randomBytes(16).toString("hex");
    const passwordHash = await passwordDigest(password, salt);
    const changed = await client.withSession(session => session.withTransaction(async () => {
      const account = await accounts.findOneAndUpdate({ resetHash, resetExpiresAt: { $gt: new Date() } }, {
        $set: { salt, passwordHash }, $unset: { resetHash: "", resetExpiresAt: "" },
      }, { session, projection: { _id: 1 } });
      if (!account) return false;
      await sessions.deleteMany({ ownerId: account._id }, { session });
      return true;
    }));
    if (!changed) return "This reset link has expired or has already been used.";
  } catch {
    return "The password could not be updated. Please try again.";
  }
  (await cookies()).delete("ld-account");
  redirect("/login?reset=1");
}
