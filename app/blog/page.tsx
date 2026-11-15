import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { publishedBlogPosts } from "@/lib/blog";
import { readingMinutes } from "@/lib/blog-domain";

export const metadata = pageMetadata("Guides & stories", "Learn how IndieRally launches products, manages directory campaigns, and helps founders prepare their next step.", "/blog");
export default async function Blog() {
  const posts = await publishedBlogPosts();
  return <div className="mx-auto w-[calc(100%-32px)] max-w-7xl py-12 md:w-[90%] lg:py-20">
    <header className="max-w-3xl"><p className="flex items-center gap-2 text-xs uppercase tracking-[.2em] text-muted"><BookOpen size={16} aria-hidden/>The IndieRally field guide</p><h1 className="mt-5 text-4xl leading-tight sm:text-6xl">A little clarity for your next launch.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-muted">How we work, what we offer, and what happens next. Practical guides for the people building independent software.</p></header>
    <div className="mt-10 flex flex-wrap gap-3 border-y border-line py-5 text-sm"><span className="text-muted">Start here:</span><Link href="/blog/how-indierally-works" className="font-semibold underline underline-offset-4">How IndieRally works</Link><span aria-hidden className="text-muted">/</span><Link href="/blog/directory-services-explained" className="font-semibold underline underline-offset-4">Our services explained</Link></div>
    <div className="mt-10 grid gap-7 md:grid-cols-2">{posts.map(post => <article key={post.slug} className="group relative overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-muted motion-reduce:transition-none">
      <Image src={post.image} alt={post.imageAlt} width={800} height={460} sizes="(min-width: 1280px) 600px, (min-width: 768px) 44vw, 92vw" className="aspect-[16/8] w-full object-cover"/>
      <div className="p-6 sm:p-8"><div className="flex items-center justify-between gap-3 text-xs uppercase tracking-widest text-muted"><span>{post.category}</span><ArrowUpRight size={17} aria-hidden/></div><h2 className="mt-4 text-2xl leading-snug tracking-tight"><Link href={"/blog/" + post.slug} className="after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-inset">{post.title}</Link></h2><p className="mt-4 text-sm leading-7 text-muted">{post.description}</p><div className="mt-6 flex flex-wrap justify-between gap-2 border-t border-line pt-4 text-xs text-muted"><span>By {post.author}</span><span>{readingMinutes(post.body)} min read · <time dateTime={post.publishedAt}>{post.publishedAt?.slice(0, 10)}</time></span></div></div>
    </article>)}</div>
    {!posts.length && <p className="mt-10 text-muted">New guides are on the way. Check back soon.</p>}
  </div>;
}
