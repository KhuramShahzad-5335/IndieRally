import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { BlogEditor } from "@/components/blog/blog-editor";
export const metadata = { title: "Write an article", robots: { index: false, follow: false } };
export default async function NewArticle() {
  if (!(await isAdmin())) redirect("/admin");
  return <div className="mx-auto w-[90%] max-w-5xl py-12"><Link href="/admin/blog" className="text-sm underline">← Editorial desk</Link><h1 className="mt-6 text-4xl">Write something useful.</h1><p className="mt-3 text-muted">Start a draft, preview the content, then publish when it is ready.</p><BlogEditor/></div>;
}
