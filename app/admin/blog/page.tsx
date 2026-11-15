import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { allBlogPosts } from "@/lib/blog";

export const metadata = { title: "Blog management", robots: { index: false, follow: false } };
export default async function BlogAdmin() {
  if (!(await isAdmin())) redirect("/admin");
  const posts = await allBlogPosts();
  return <div className="mx-auto w-[90%] max-w-6xl py-12"><Link href="/admin" className="text-sm underline">← Moderation</Link><div className="mt-6 flex flex-wrap items-center justify-between gap-5"><div><h1 className="text-4xl">Editorial desk</h1><p className="mt-3 text-muted">Write guides, manage drafts, and publish updates.</p></div><Link href="/admin/blog/new" className="rounded-lg bg-accent px-5 py-3 text-white">Write an article</Link></div>
    <p className="mt-6 rounded-xl border border-line bg-surface p-4 text-sm">Image uploads: {process.env.BLOB_READ_WRITE_TOKEN ? "Blob token configured" : "Not connected. Set BLOB_READ_WRITE_TOKEN from a public Vercel Blob store."}</p>
    <div className="mt-8 grid gap-3">{posts.map(post => <Link key={post.slug} href={"/admin/blog/" + post.slug} className="rounded-xl border border-line bg-surface p-5 hover:bg-soft"><div className="flex flex-wrap justify-between gap-3"><h2 className="text-xl">{post.title}</h2><span className="text-sm capitalize text-muted">{post.status}</span></div><p className="mt-2 text-sm text-muted">{post.category} · {post.author} · Updated {post.updatedAt.slice(0, 10)}</p></Link>)}</div>
  </div>;
}
