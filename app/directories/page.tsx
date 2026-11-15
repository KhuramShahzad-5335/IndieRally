import { cover } from "@/lib/editorial";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, Compass, PenLine, Send } from "lucide-react";

export const metadata = pageMetadata("Directory submission services", "Get help researching software directories, preparing copy, and tracking submissions.", "/directories");

const services = [
  { icon: Compass, title: "Directory research", detail: "We look for SaaS, AI, developer tool, and niche directories that match your audience. We check their submission requirements before including them in your campaign." },
  { icon: PenLine, title: "Listing preparation", detail: "We adapt your description, category, and links to each directory’s requirements using your existing product materials." },
  { icon: Send, title: "Manual submissions", detail: "We submit your product to the agreed destinations and document any steps that need your input." },
  { icon: ClipboardCheck, title: "Campaign reporting", detail: "You get a record of submissions, their status, and available live links. Each directory sets its own approval and link policies." },
];

export default function Directories() {
  return <div className="mx-auto w-[calc(100%-32px)] md:w-[90%] pt-12 pb-16">
    <section className="grid overflow-hidden rounded-md border border-line bg-surface lg:grid-cols-[1.1fr_.9fr]">
      <div className="self-center p-6 motion-safe:animate-enter sm:p-10 lg:p-14">
        <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-subtle"><Compass size={18} aria-hidden/> Directory submission services</p>
        <h1 className="max-w-[16ch]">Get listed where people look for software.</h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-subtle">Share your product once. We research relevant directories, tailor your listings, and report where they land.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/pricing" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 font-bold text-[#fff] hover:bg-[#383838]">Compare packages <ArrowRight size={17} aria-hidden/></Link>
          <Link href="/contact" className="inline-flex min-h-11 items-center rounded-lg border border-line px-4 font-semibold hover:bg-soft">Ask a question</Link>
        </div>
      </div>
      <div className="relative isolate flex min-h-[240px] items-end overflow-hidden bg-[#252525] p-5 sm:p-8 lg:min-h-[460px]">
        <Image src={cover("choosing-directories")} fill preload sizes="(min-width: 1024px) 45vw, 100vw" className="-z-20 object-cover grayscale" alt="Open planner on a desk"/>
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/25"/>
        <div className="flex items-center gap-3 rounded-md border border-white/25 bg-black/55 px-4 py-3 text-white backdrop-blur-sm"><ClipboardCheck size={20} aria-hidden className="text-white"/><span className="text-sm font-semibold">Track submissions and live links</span></div>
      </div>
    </section>
    <section className="mt-12" aria-labelledby="services-heading">
      <h2 id="services-heading">What your campaign includes</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{services.map(({ icon: Icon, title, detail }) =>
        <article key={title} className="rounded-md border border-line bg-surface p-5">
          <span className="mb-4 grid size-11 place-items-center rounded-md bg-soft text-subtle"><Icon size={21} aria-hidden/></span>
          <h3>{title}</h3><p className="mt-2 leading-relaxed text-muted">{detail}</p>
        </article>
      )}</div>
    </section>
    <section className="my-12 grid gap-8 border-y border-line py-10 lg:grid-cols-[.8fr_1.2fr]" aria-labelledby="campaign-story">
      <div><p className="mb-3 font-mono text-xs tracking-widest text-muted uppercase">From brief to report</p><h2 id="campaign-story">One product brief. A campaign you can follow.</h2></div>
      <ol className="divide-y divide-line border-y border-line">
        <li className="grid grid-cols-[2.5rem_1fr] gap-3 py-5"><span className="font-mono text-muted">01</span><div><h3>Tell us who you want to reach</h3><p className="mt-2 text-subtle">Share your product URL, audience, and any directories you already use. We use that brief to agree what the campaign should cover.</p></div></li>
        <li className="grid grid-cols-[2.5rem_1fr] gap-3 py-5"><span className="font-mono text-muted">02</span><div><h3>Review the proposed scope</h3><p className="mt-2 text-subtle">We identify relevant destinations and flag anything we need from you, such as screenshots, a login, or ownership verification.</p></div></li>
        <li className="grid grid-cols-[2.5rem_1fr] gap-3 py-5"><span className="font-mono text-muted">03</span><div><h3>See where each submission stands</h3><p className="mt-2 text-subtle">Your report records what was submitted, what is awaiting a decision, and which listings are live.</p></div></li>
      </ol>
    </section>
    <section className="mt-12 grid gap-5 rounded-md border border-line bg-surface p-6 md:grid-cols-2" aria-labelledby="report-heading">
      <div><h2 id="report-heading">See what your report tracks</h2><p className="mt-3 text-muted">This example shows how we record each submission. The destinations and outcomes are illustrative.</p><Link href="/contact" className="mt-4 inline-flex items-center gap-2 font-semibold text-subtle underline">Ask about a campaign <ArrowRight size={16} aria-hidden/></Link></div>
      <dl className="divide-y divide-line rounded-md border border-line bg-paper px-4">{[["Developer tools directory","Live link recorded"],["SaaS catalog","Awaiting review"],["Founder community","Maker verification needed"]].map(([name,status])=><div className="py-3" key={name}><dt className="font-semibold">{name}</dt><dd className="text-sm text-muted">{status}</dd></div>)}</dl>
    </section>
  </div>;
}

