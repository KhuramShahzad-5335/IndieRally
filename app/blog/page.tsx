import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { articles, cover } from "@/lib/editorial";

export const metadata = pageMetadata("Blog", "Practical guides for software launches, product listings, and directory campaigns.", "/blog");

export default function Blog() {
  return <div className="mx-auto min-h-[65vh] w-[calc(100%-32px)] md:w-[90%] py-7 sm:py-10">
    <header className="mb-5 sm:mb-7"><h1>IndieRally blog</h1><p className="mt-3 text-lg text-muted">Practical advice for launching and distributing independent software.</p></header>
    <div className="grid gap-4 sm:gap-6">{articles.map(post => {
      const words = post.paragraphs.join(" ").trim().split(/\s+/).length;
      return <article key={post.slug} className="group relative grid overflow-hidden rounded-md border border-line bg-surface motion-safe:transition-colors hover:border-muted md:grid-cols-[42%_1fr]">
        <div className="grid place-items-center border-b border-line bg-paper p-4 sm:p-6 md:border-r md:border-b-0">
          <Image src={cover(post.slug)} width={800} height={460} alt={post.alt} className="aspect-[800/460] w-full rounded-md object-cover grayscale" sizes="(min-width: 768px) 38vw, 90vw"/>
        </div>
        <div className="min-w-0 p-5">
          <div className="flex items-center justify-between gap-3"><span className="font-mono text-xs tracking-widest text-subtle uppercase">Launch guides</span><ArrowUpRight size={18} aria-hidden className="text-muted group-hover:text-ink"/></div>
          <h2 className="mt-4 text-[clamp(1.5rem,3vw,2.25rem)]"><Link href={"/blog/" + post.slug} className="after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-[#717171]">{post.title}</Link></h2>
          <p className="mt-4 text-base leading-relaxed text-subtle">{post.paragraphs[0].split("\n\n")[0]}</p>
          <p className="mt-5 text-sm text-muted">By <span className="font-semibold text-ink">IndieRally Editorial</span></p>
          <div className="mt-4 flex flex-wrap justify-between gap-2 border-t border-line pt-4 text-sm text-muted"><time dateTime="2026-11-14">November 14, 2026</time><span>{Math.max(1, Math.ceil(words / 200))} min read · {words} words</span></div>
          <span aria-hidden className="mt-4 inline-flex items-center gap-2 font-semibold group-hover:underline">Read the article <ArrowUpRight size={16}/></span>
        </div>
      </article>;
    })}</div>
  </div>;
}



