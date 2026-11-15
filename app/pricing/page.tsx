import Link from "next/link";
import { ArrowRight, ClipboardCheck, Layers3, PenLine, Search } from "lucide-react";
import { plans } from "@/lib/editorial";

export const metadata = {title:"Directory service pricing",description:"Compare IndieRally’s one-time directory submission packages.",alternates:{canonical:"/pricing"}};
const descriptions = {
  starter: "Get your first directory campaign underway.",
  growth: "Reach a wider mix of directories in your market.",
  reach: "Cover more destinations across your niche.",
} as const;

export default function Pricing() {
  return <div className="min-h-[70vh] bg-paper text-ink"><div className="mx-auto w-[calc(100%-48px)] md:w-[90%] max-[590px]:w-[calc(100%-28px)] min-h-[65vh] pt-12 pb-16">
    <div className="mx-auto mt-3 mb-[46px] text-center [&_p]:mx-auto [&_p]:mt-4 [&_p]:max-w-[490px] [&_p]:text-muted"><h1>Get listed in the right directories</h1><p>Launch on IndieRally for free. Choose a one-time campaign when you want help reaching directories beyond IndieRally.</p></div>
    <div className="grid gap-4 min-[561px]:grid-cols-2 min-[801px]:grid-cols-3 max-[800px]:mx-auto max-[800px]:max-w-[560px] max-[800px]:!grid-cols-1">{plans.map(plan => <section key={plan.id} className={`rounded-md border bg-surface p-2 [&_p]:mt-2 [&_p]:text-muted ${plan.id === "growth" ? "border-ink" : "border-line"}`}>
      <div className="rounded-md bg-soft p-[19px] min-[801px]:min-h-[124px] [&_h2]:text-[1.35rem]"><h2>{plan.name}</h2><p>{descriptions[plan.id as keyof typeof descriptions]}</p></div>
      <div className="px-[19px] py-[22px]"><strong className="block text-[2.7rem] leading-[1.05] tracking-[-.06em]">{"$" + plan.price}</strong><p>Starting price in USD per campaign</p>
        <Link className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none mt-5 w-full !border-[#4a4a4a] bg-accent text-white hover:bg-[#454545]" href={"/contact?service="+plan.id}>Request {plan.name} <ArrowRight size={17} aria-hidden/></Link>
        <ul className="mt-[25px] grid gap-[11px] [&_li]:flex [&_li]:items-center [&_li]:gap-[9px] [&_svg]:shrink-0"><li><Layers3 size={17} aria-hidden/> Up to {plan.placements} submissions</li><li><Search size={17} aria-hidden/> Directory research</li><li><PenLine size={17} aria-hidden/> Tailored listing copy</li><li><ClipboardCheck size={17} aria-hidden/> Campaign report and available links</li></ul>
      </div>
    </section>)}</div>
    <section className="mt-14 grid gap-8 border-y border-line py-10 lg:grid-cols-[.85fr_1.15fr]" aria-labelledby="pricing-next">
      <div><p className="mb-3 font-mono text-xs tracking-widest text-muted uppercase">After you request a package</p><h2 id="pricing-next">Know what you’re paying for.</h2></div>
      <div className="space-y-5 text-subtle">
        <p><strong className="block text-ink">Tell us about your product.</strong> Share your URL and who you want to reach. Starter suits a focused first campaign, Growth covers a wider set of destinations, and Reach gives us room to explore relevant niches.</p>
        <p><strong className="block text-ink">Agree on the scope and price.</strong> These are starting prices. A package request starts a conversation about fit, placement limits, timing, and cost before you commit.</p>
        <p><strong className="block text-ink">Get a record of the work.</strong> Each package includes a report with submission status and available live links. Each directory controls its own approvals.</p>
        <Link className="inline-flex items-center gap-2 font-semibold underline" href="/directories">See how campaigns work <ArrowRight size={16} aria-hidden/></Link>
      </div>
    </section>
  </div></div>;
}



