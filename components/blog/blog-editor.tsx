import { ActionForm } from "@/components/forms/action-form";
import { blogCategories, type BlogPost } from "@/lib/blog-domain";
import { saveBlog } from "@/app/admin/blog/actions";
import { EditorFields } from "./editor-fields";

export function BlogEditor({ post }: { post?: BlogPost }) {
  return <ActionForm action={saveBlog.bind(null, post?.slug ?? "", post?.updatedAt ?? "")} label="Save article" pendingLabel="Saving article…" className="mt-8 gap-6 rounded-2xl border border-line bg-surface p-5 sm:p-8 [&_label]:text-sm [&>button]:min-h-12">
    <div className="grid w-full gap-5 sm:grid-cols-2"><label>Title<input name="title" defaultValue={post?.title} required minLength={5} maxLength={120}/></label><label>URL slug<input name="slug" defaultValue={post?.slug} required readOnly={!!post} pattern="[a-z0-9]+(-[a-z0-9]+)*" minLength={2} maxLength={100} placeholder="your-article-title"/></label></div>
    <label>Summary / SEO description<textarea name="description" defaultValue={post?.description} required minLength={30} maxLength={180} rows={3}/></label>
    <div className="grid w-full gap-5 sm:grid-cols-3"><label>Author<input name="author" defaultValue={post?.author ?? "IndieRally Editorial"} required minLength={2} maxLength={80}/></label><label>Category<select name="category" defaultValue={post?.category ?? "Launch guides"}>{blogCategories.map(category => <option key={category}>{category}</option>)}</select></label><label>Visibility<select name="status" defaultValue={post?.status ?? "draft"}><option value="draft">Draft (private)</option><option value="published">Published (public)</option></select></label></div>
    <label>Cover description (alt text)<input name="imageAlt" defaultValue={post?.imageAlt} required minLength={5} maxLength={200}/></label>
    <EditorFields image={post?.image ?? "/editorial/launch-checklist.jpg"} body={post?.body ?? "## Start here\n\nIntroduce the reader's question and explain what this guide will help them do. Replace this text with your article.\n\n## Next steps\n\nExplain the practical next action the reader should take."}/>
    <p className="text-sm leading-6 text-muted">Drafts stay out of public pages and the sitemap. To unpublish an article, select Draft and save. Only publish customer results with permission and supporting evidence.</p>
  </ActionForm>;
}
