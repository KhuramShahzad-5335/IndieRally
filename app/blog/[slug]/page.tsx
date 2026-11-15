import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import { pageMetadata, siteOrigin } from "@/lib/seo";
import { getBlogPost } from "@/lib/blog";
import { blogSections, readingMinutes } from "@/lib/blog-domain";
import { BlogContent } from "@/components/blog/blog-content";
import { JsonLd } from "@/components/seo/json-ld";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const post = await getBlogPost((await params).slug);
  if (!post || post.status !== "published") return { title: "Article unavailable", robots: { index: false } };
  return { ...pageMetadata(post.title, post.description, "/blog/" + post.slug),
    openGraph: { type: "article" as const, title: post.title, description: post.description, url: "/blog/" + post.slug, siteName: "IndieRally", images: [post.image], publishedTime: post.publishedAt, modifiedTime: post.updatedAt, authors: [post.author] },
    twitter: { card: "summary_large_image" as const, title: post.title, description: post.description, images: [post.image] },
  };
}
export default async function Article({ params }: Props) {
  const post = await getBlogPost((await params).slug);
  if (!post || post.status !== "published") notFound();
  const sections = blogSections(post.body);
  const dateLabel = (value: string) => new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(value));
  return <article className="mx-auto w-[calc(100%-32px)] max-w-7xl py-10 md:w-[90%] lg:py-16">
    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-subtle hover:underline"><ArrowLeft size={16} aria-hidden/>All guides & stories</Link>
    <header className="mx-auto mt-10 max-w-4xl text-center"><p className="text-xs uppercase tracking-[.2em] text-muted">{post.category}</p><h1 className="mt-5 text-[clamp(2rem,4.4vw,3.75rem)] leading-[1.12]">{post.title}</h1><p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">{post.description}</p><div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted"><span>By <span className="font-semibold text-ink">{post.author}</span></span><time dateTime={post.publishedAt}>{dateLabel(post.publishedAt!)}</time><span className="inline-flex items-center gap-1.5"><Clock3 size={14} aria-hidden/>{readingMinutes(post.body)} min read</span>{post.updatedAt.slice(0,10) !== post.publishedAt?.slice(0,10) && <span>Updated {dateLabel(post.updatedAt)}</span>}</div></header>
    <figure className="mx-auto my-10 max-w-5xl sm:my-14"><Image src={post.image} alt={post.imageAlt} width={1200} height={600} sizes="(min-width: 1280px) 1024px, 90vw" preload className="aspect-[2/1] w-full rounded-2xl object-cover"/></figure>
    <div className="grid items-start gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[240px_minmax(0,1fr)_60px]">
      <aside className="lg:sticky lg:top-28"><nav aria-label="In this article" className="border-l border-line pl-5"><p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">On this page</p><ol className="space-y-3">{sections.map((section, index) => <li key={section.id}><a href={"#" + section.id} className="flex gap-3 text-sm font-normal leading-6 text-subtle hover:text-ink"><span className="font-mono text-xs text-muted">{String(index+1).padStart(2,"0")}</span>{section.title}</a></li>)}</ol></nav><Link href="/contact" className="mt-6 inline-flex items-center gap-2 pl-5 text-sm font-semibold">Ask us a question <ArrowUpRight size={15} aria-hidden/></Link></aside>
      <div className="min-w-0 max-w-[75ch]">
        {post.category === "Illustrative case study" && <div className="mb-9 rounded-xl bg-soft p-5 text-sm leading-7"><strong className="block text-ink">An illustrative example, not a customer testimonial.</strong><p className="mt-2 text-muted">This article describes a hypothetical campaign. It does not claim that IndieRally delivered work or generated results for the featured person.</p>{post.slug === "khuram-portfolio-launch-walkthrough" && <a href="https://www.khuramshahzad.dev/" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block underline underline-offset-4">View the public portfolio used for context ↗</a>}</div>}
        <BlogContent body={post.body}/>
        <footer className="mt-14 border-t border-line pt-8"><p className="text-xs uppercase tracking-widest text-muted">Your next step</p><h2 className="mt-3 text-2xl">Let's make the plan specific to you.</h2><p className="mt-3 leading-7 text-muted">Share your product, audience, and the question you want to answer. We'll help you understand the next step.</p><div className="mt-5 flex flex-wrap gap-4"><Link href="/contact" className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white">Talk to IndieRally</Link><Link href="/pricing" className="rounded-lg border border-line px-5 py-3 text-sm font-semibold">Explore services</Link></div></footer>
      </div>
    </div>
    <JsonLd value={{ "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.description, datePublished: post.publishedAt, dateModified: post.updatedAt, image: new URL(post.image, siteOrigin()).href, mainEntityOfPage: new URL("/blog/" + post.slug, siteOrigin()).href, author: { "@type": post.author === "IndieRally Editorial" ? "Organization" : "Person", name: post.author }, publisher: { "@type": "Organization", name: "IndieRally", url: siteOrigin() } }}/>
  </article>;
}
