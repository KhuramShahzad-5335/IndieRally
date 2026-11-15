import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Search, SquarePen } from "lucide-react";

export const metadata = pageMetadata("About", "Learn how IndieRally helps independent makers launch and find their first users.", "/about");

const stages = [
  { icon: SquarePen, title: "Tell us what you built", text: "Submit your product, explain what it helps people do, and link to a place they can see it for themselves." },
  { icon: CalendarDays, title: "Launch with the weekly round", text: "We review submissions and schedule approved products for the next round. Signed-in readers can vote while the round is open." },
  { icon: Search, title: "Stay discoverable", text: "Your product stays in the searchable directory after voting closes, and recent results stay visible on Explore." },
];

export default function About() {
  return <div className="mx-auto w-[calc(100%-28px)] md:w-[90%]">
    <header className="grid gap-6 border-b border-line py-14 md:grid-cols-[1.2fr_.8fr] md:items-end lg:py-24">
      <div className="motion-safe:animate-enter"><p className="mb-4 font-mono text-xs tracking-widest text-muted uppercase">01 / About IndieRally</p><h1 className="max-w-[15ch] text-[clamp(2.75rem,6vw,6rem)]">Good tools deserve to be found.</h1></div>
      <p className="max-w-lg text-lg leading-relaxed text-subtle">IndieRally helps indie developers and small teams launch their products. We review submissions, schedule approved listings for a weekly round, and feature selected products in our spotlight.</p>
    </header>
    <section className="grid gap-8 border-b border-line py-12 lg:grid-cols-[.8fr_1.2fr] lg:py-16">
      <div><p className="mb-3 font-mono text-xs tracking-widest text-muted uppercase">02 / Why it exists</p><h2>From launch day to the next discovery.</h2></div>
      <div className="max-w-prose space-y-4 text-base leading-relaxed text-subtle"><p>A launch is often someone’s first encounter with a product. A clear description and a working link help them decide whether to give it a try. A weekly round gives that first encounter a moment to happen.</p><p>The directory gives each product a home after that moment passes. Visitors can search by name or browse by category whenever they have a problem to solve.</p></div>
    </section>
    <section className="py-12 lg:py-16"><p className="mb-3 font-mono text-xs tracking-widest text-muted uppercase">03 / How it works</p><h2>Follow a product from submission to discovery.</h2>
      <ol className="mt-7 grid gap-4 md:grid-cols-3">{stages.map(({icon: Icon,title,text}) => <li key={title} className="rounded-md border border-line bg-surface p-6"><Icon size={22} aria-hidden/><h3 className="mt-5">{title}</h3><p className="mt-3 leading-relaxed text-muted">{text}</p></li>)}</ol>
      <div className="mt-7 flex flex-wrap gap-5"><Link className="inline-flex min-h-11 items-center gap-2 rounded-md bg-accent px-4 font-bold text-white hover:bg-[#383838]" href="/explore">Explore launches <ArrowUpRight size={16} aria-hidden/></Link><Link className="inline-flex min-h-11 items-center underline" href="/directories">See how directory campaigns work</Link></div>
    </section>
  </div>;
}

