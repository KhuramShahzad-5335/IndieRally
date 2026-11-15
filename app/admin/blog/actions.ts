"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { blogCollection, getBlogPost } from "@/lib/blog";
import { parseBlog, type BlogPost } from "@/lib/blog-domain";

export async function saveBlog(originalSlug: string, expectedUpdatedAt: string, _: string, form: FormData) {
  if (!(await isAdmin())) return "Sign in as an administrator to edit articles.";
  if (!process.env.MONGODB_URI) return "Configure MongoDB to save articles.";
  let input;
  try { input = parseBlog(form); } catch (error) { return (error as Error).message; }
  if (originalSlug && originalSlug !== input.slug) return "The URL slug cannot change after creation.";
  const existing = await getBlogPost(input.slug);
  if (!originalSlug && existing) return "That URL is already used by another article.";
  const now = new Date().toISOString();
  const post: BlogPost = { ...input, status: input.status as BlogPost["status"], createdAt: existing?.createdAt ?? now, updatedAt: now,
    ...(existing?.publishedAt ? { publishedAt: existing.publishedAt } : input.status === "published" ? { publishedAt: now } : {}) };
  try {
    const collection = await blogCollection();
    const stored = await collection.findOne({ slug: input.slug });
    if (stored) {
      const result = await collection.updateOne({ slug: input.slug, updatedAt: expectedUpdatedAt }, { $set: post });
      if (!result.modifiedCount) return "This article changed in another session. Reload before editing again.";
    } else await collection.insertOne(post);
  } catch { return "The article could not be saved. Check the database or reload if another editor just saved it."; }
  revalidatePath("/blog"); revalidatePath("/blog/" + input.slug); revalidatePath("/sitemap.xml"); revalidatePath("/admin/blog");
  redirect("/admin/blog/" + input.slug + "?saved=1");
}
