"use server";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nextRound, startOfRound } from "@/lib/rounds";
import { currentAccount, requireAccount } from "@/lib/accounts";
import { repository } from "@/lib/store";
import { parseInput, slugify, type Decision } from "@/lib/domain";
import { adminSecret, adminSignature, cookieOptions, equal, hash, isAdmin } from "@/lib/auth";

export async function submit(_: string, form: FormData): Promise<string> {
  const ownerId = process.env.MONGODB_URI ? (await requireAccount())._id : undefined;
  let input;
  try { input = parseInput(form); } catch (error) { return (error as Error).message; }
  const at = new Date().toISOString();
  const token = randomBytes(24).toString("hex");
  const base = slugify(input.name);
  const repo = await repository();
  const draft = { ...input, ...(ownerId ? { ownerId } : { trackingHash: hash(token) }), status: "pending" as const, submittedAt: at, voters: [], baseVotes: 0, history: [{ status: "pending" as const, at }] };
  if (!(await repo.create({ ...draft, slug: base })) &&
      !(await repo.create({ ...draft, slug: base + "-" + randomBytes(4).toString("hex") }))) return "Please retry submitting.";
  redirect(ownerId ? "/dashboard" : "/status/" + token);
}
export async function revise(token: string, _: string, form: FormData): Promise<string> {
  let input;
  try { input = parseInput(form); } catch (error) { return (error as Error).message; }
  const at = new Date().toISOString();
  const success = await (await repository()).update({ trackingHash: hash(token), status: "changes" }, { ...input, status: "pending" }, { status: "pending", at });
  if (!success) return "This submission has already moved to another review state.";
  redirect("/status/" + token);
}
export async function login(_: string, form: FormData): Promise<string> {
  const config = adminSecret();
  if (!config) return "Admin access requires server configuration.";
  if (!equal(String(form.get("password") ?? ""), config.password)) return "Incorrect password.";
  const expiry = String(Date.now() + 8 * 60 * 60 * 1000);
  (await cookies()).set("ld-admin", expiry + "." + adminSignature(expiry, config), cookieOptions(28800));
  redirect("/admin");
}
export async function logout() { (await cookies()).delete("ld-admin"); redirect("/admin"); }
export async function review(slug: string, _: string, form: FormData): Promise<string> {
  if (!(await isAdmin())) return "Sign in again to review this submission.";
  const decision = form.get("decision") as Decision;
  const note = String(form.get("note") ?? "").trim();
  if (!["published", "changes", "rejected"].includes(decision)) return "Choose a decision.";
  if (note.length > 500 || (decision !== "published" && note.length < 3)) return "Enter a review note of 3–500 characters.";
  const at = new Date().toISOString();
  const ok = await (await repository()).update({ slug, status: "pending" }, { status: decision, ...(decision === "published" ? { publishedAt: nextRound(Date.parse(at)), featured: form.get("featured") === "on" } : {}) }, { status: decision, at, note });
  if (!ok) return "Another reviewer has already handled this submission.";
  redirect("/admin");
}
export async function upvote(slug: string) {
  const account = await currentAccount();
  if (!account) redirect("/login?vote=" + encodeURIComponent(slug));
  const now = Date.now();
  await (await repository()).vote(slug, hash(account._id), new Date(startOfRound(now)).toISOString(), new Date(now).toISOString());
  revalidatePath("/explore");
  revalidatePath("/");
  revalidatePath("/products/" + slug);
}

export async function reviseOwned(slug: string, _: string, form: FormData): Promise<string> {
  const account = await requireAccount();
  let input;
  try { input = parseInput(form); } catch (error) { return (error as Error).message; }
  const at = new Date().toISOString();
  const success = await (await repository()).update({ slug, ownerId: account._id, status: "changes" }, { ...input, status: "pending" }, { status: "pending", at });
  if (!success) return "This submission is unavailable for revision.";
  redirect("/dashboard/" + slug);
}
