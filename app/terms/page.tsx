import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMetadata("Terms of use", "Read the terms for using IndieRally, submitting products, and requesting launch services.", "/terms");

export default function PolicyPage() {
  return <article className="mx-auto w-[90%] max-w-3xl space-y-7 py-12">
    <h1>Terms of use</h1>
    <section className="space-y-2"><h2 className="text-2xl">Accounts</h2><p className="leading-relaxed text-subtle">Use an email address you control and keep your sign-in credentials private. You can manage or delete your account from Profile.</p></section>
    <section className="space-y-2"><h2 className="text-2xl">Listings and voting</h2><p className="leading-relaxed text-subtle">Submit accurate product information and only materials you have permission to share. IndieRally reviews listings before publication. Do not impersonate others, submit spam, or manipulate rankings.</p></section>
    <section className="space-y-2"><h2 className="text-2xl">Directory services</h2><p className="leading-relaxed text-subtle">Public package prices are starting prices. A request starts a discussion about scope and pricing. External directories make their own publication decisions.</p></section>
    <Link className="inline-block font-semibold underline" href="/contact">Contact IndieRally</Link>
  </article>;
}
