import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getBlogPost } from "@/lib/blog";
import { BlogEditor } from "@/components/blog/blog-editor";
export const metadata = { title: "Edit article", robots: { index: false, follow: false } };
export default async function EditArticle({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ saved?: string }> }) {
  if (!(await isAdmin())) redirect("/admin");
  const post = await getBlogPost((await params).slug);
  if (!post) notFound();
  return <div className="mx-auto w-[90%] max-w-5xl py-12"><Link href="/admin/blog" className="text-sm underline">← Editorial desk</Link><h1 className="mt-6 text-4xl">Edit article</h1>{(await searchParams).saved === "1" && <p role="status" className="mt-4 rounded-xl bg-soft p-4">Article saved as {post.status}.</p>}{post.status === "published" && <Link href={"/blog/" + post.slug} className="mt-4 inline-block underline">View published article →</Link>}<BlogEditor key={post.updatedAt} post={post}/></div>;
}
