"use client";
import { useState } from "react";
import { Upload, Eye, Pencil } from "lucide-react";
import { BlogContent } from "./blog-content";

export function EditorFields({ image, body }: { image: string; body: string }) {
  const [url, setUrl] = useState(image);
  const [content, setContent] = useState(body);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { setNotice("Choose an image under 3 MB."); return; }
    setBusy(true); setNotice("");
    try {
      const data = new FormData(); data.set("image", file);
      const response = await fetch("/api/admin/images", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");
      setUrl(result.url); setNotice("Uploaded to Blob. Save the article to keep this cover. You can also copy its URL for an inline image.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Upload failed. Please retry."); }
    finally { setBusy(false); }
  }
  return <>
    <div className="w-full rounded-xl border border-line bg-paper p-5">
      <label>Cover image URL<input name="image" value={url} onChange={event => setUrl(event.target.value)} required maxLength={1000}/></label>
      <label className="mt-4"><span className="flex items-center gap-2 text-sm"><Upload size={16} aria-hidden/>Upload to Vercel Blob</span><input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={event => void upload(event.target.files?.[0])}/></label>
      <p className="mt-2 text-xs leading-6 text-muted">JPEG, PNG, or WebP, up to 3 MB. Images are public; upload only content you have permission to publish.</p>
      {(busy || notice) && <p role="status" className="mt-3 text-sm">{busy ? "Uploading…" : notice}</p>}
    </div>
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><label htmlFor="blog-body">Article content</label><button type="button" onClick={() => setPreview(!preview)} className="flex shrink-0 items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm">{preview ? <Pencil size={16}/> : <Eye size={16}/>} {preview ? "Edit content" : "Preview content"}</button></div>
      <p id="body-help" className="mb-3 text-sm leading-6 text-muted">Use ## Heading for sections, a blank line between paragraphs, and - for bullet points. Put inline images on their own line: ![Description](Blob URL). HTML is displayed as text.</p>
      <textarea id="blog-body" name="body" value={content} onChange={event => setContent(event.target.value)} rows={22} minLength={100} maxLength={60000} required aria-describedby="body-help" className={preview ? "sr-only" : "w-full font-mono text-sm leading-7"}/>
      {preview && <div className="rounded-xl border border-line bg-paper p-5 sm:p-8"><BlogContent body={content}/></div>}
    </div>
  </>;
}
