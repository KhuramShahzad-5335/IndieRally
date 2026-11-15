import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";

const groups = [
  { title: "Discover", links: [["Explore", "/explore"], ["Product directory", "/#directory"], ["Blog", "/blog"]] },
  { title: "For makers", links: [["Submit a product", "/submit"], ["Services", "/directories"], ["Pricing", "/pricing"]] },
  { title: "IndieRally", links: [["About", "/about"], ["Contact", "/contact"]] },
];
const policies = [["Terms", "/terms"], ["Privacy", "/privacy"], ["Cookies", "/cookies"], ["Refunds", "/refunds"]];

export function SiteFooter() {
  return <footer className="border-t border-line bg-tint">
    <div className="mx-auto w-[calc(100%-28px)] md:w-[90%]">
      <div className="grid gap-10 py-10 lg:grid-cols-[1fr_1.6fr] lg:py-14">
        <div><Brand/><p className="mt-4 max-w-xs leading-relaxed text-muted">Discover independent software, follow weekly launches, and find a place for your own product to start.</p>
          <Link href="/contact" className="mt-5 inline-flex items-center gap-2 font-medium hover:underline">Get in touch <ArrowUpRight size={16} aria-hidden/></Link>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-7 sm:grid-cols-3">{groups.map(group => <div key={group.title}>
          <h2 className="mb-4 font-mono text-xs tracking-widest uppercase">{group.title}</h2>
          <ul className="grid gap-3 text-sm">{group.links.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
        </div>)}</nav>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-5 text-sm text-muted">
        <p>© {new Date().getFullYear()} IndieRally</p>
        <nav aria-label="Policies" className="flex flex-wrap gap-x-5 gap-y-3">{policies.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
      </div>
    </div>
  </footer>;
}
