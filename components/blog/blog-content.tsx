import Image from "next/image";
import { blogSections, validBlogImage } from "@/lib/blog-domain";

export function BlogContent({ body }: { body: string }) {
  return <div className="space-y-12 text-base leading-8 text-subtle sm:text-lg sm:leading-9">
    {blogSections(body).map(section => <section key={section.id} id={section.id} className="scroll-mt-28">
      <h2 className="mb-5 text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl">{section.title}</h2>
      <div className="space-y-5">{section.text.split(/\n\s*\n/).map((block, index) => {
        const image = block.trim().match(/^!\[([^\]]+)\]\(([^)]+)\)$/);
        if (image && validBlogImage(image[2])) return <figure key={index}><Image src={image[2]} alt={image[1]} width={1200} height={750} sizes="(min-width: 1024px) 720px, 90vw" className="h-auto w-full rounded-xl"/><figcaption className="mt-2 text-sm text-muted">{image[1]}</figcaption></figure>;
        const lines = block.split("\n");
        if (lines.every(line => line.startsWith("- "))) return <ul key={index} className="list-disc space-y-2 pl-6 marker:text-muted">{lines.map((line, i) => <li key={i}>{line.slice(2)}</li>)}</ul>;
        return <p key={index} className="whitespace-pre-line wrap-anywhere">{block}</p>;
      })}</div>
    </section>)}
  </div>;
}
