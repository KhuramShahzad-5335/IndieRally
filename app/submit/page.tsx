import type { Metadata } from "next";
import { CalendarDays, ClipboardCheck, Send } from "lucide-react";
import { requireAccount } from "@/lib/accounts";
import { submit } from "../actions";
import { ActionForm } from "@/components/forms/action-form";
import { ProductFields } from "@/components/products/product-fields";

export const metadata: Metadata = { title: "Submit a product", robots: { index: false, follow: false }, description: "Submit your independent software for review and get a public listing on IndieRally.", alternates: { canonical: "/submit" } };

export default async function SubmitPage() {
  const accountsEnabled = Boolean(process.env.MONGODB_URI);
  if (accountsEnabled) await requireAccount();
  const steps = [
    { Icon: Send, title: "Send your listing", detail: "Include a working HTTPS link and a clear description of who the product helps." },
    { Icon: ClipboardCheck, title: "Follow the review", detail: accountsEnabled ? "See the decision and any requested changes in My submissions." : "Save your private status link to see the decision or make requested changes." },
    { Icon: CalendarDays, title: "Join the next launch", detail: "Approved products join the next weekly round, starting Monday at midnight UTC." },
  ];
  return <div className="mx-auto grid min-h-[65vh] w-[calc(100%-28px)] items-start gap-8 py-12 md:w-[90%] lg:grid-cols-[1fr_1.55fr] lg:gap-[6vw] lg:py-16">
    <aside aria-labelledby="submit-title" className="motion-safe:animate-enter">
      <h1 id="submit-title">Submit a product</h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-subtle">Give people a clear reason to try what you built. Submitting a listing is free.</p>
      <ol className="mt-7 divide-y divide-line border-y border-line">{steps.map(({ Icon, title, detail }) => <li key={title} className="flex items-start gap-4 py-4">
        <Icon size={19} aria-hidden className="mt-0.5 shrink-0 text-muted"/>
        <div><h2 className="text-base tracking-normal">{title}</h2><p className="mt-1 text-sm leading-relaxed text-muted">{detail}</p></div>
      </li>)}</ol>
    </aside>
    <ActionForm action={submit} label="Send for review" className="min-w-0 rounded-xl border border-line bg-surface p-5 sm:p-8 lg:gap-6">
      <ProductFields/>
    </ActionForm>
  </div>;
}
