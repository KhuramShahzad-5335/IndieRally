import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
export const hash = (value: string) => createHash("sha256").update(value).digest("hex");
export function equal(a: string, b: string) { return timingSafeEqual(Buffer.from(hash(a)), Buffer.from(hash(b))); }
export function adminSecret() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (process.env.NODE_ENV === "production" && (!password || !secret || secret.length < 32)) return null;
  return { password: password || "launchdeck-demo", secret: secret || "local-development-only" };
}
export function adminSignature(body: string, config: NonNullable<ReturnType<typeof adminSecret>>) {
  return createHmac("sha256", config.secret).update(body + ":" + config.password).digest("hex");
}
export async function isAdmin() {
  const config = adminSecret();
  const [expiry, signature] = (await cookies()).get("ld-admin")?.value.split(".") ?? [];
  return !!(config && expiry && signature && Number(expiry) > Date.now() && equal(signature, adminSignature(expiry, config)));
}
export function cookieOptions(maxAge: number) {
  return { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production" && process.env.SITE_URL?.startsWith("https://"), path: "/", maxAge };
}
