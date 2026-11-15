import Link from "next/link";

export const metadata = { title: "Cancellation and refunds", alternates: { canonical: "/refunds" } };

export default function PolicyPage() {
  return <article className="mx-auto w-[90%] max-w-3xl space-y-7 py-12">
    <h1>Cancellation and refunds</h1>
    <section className="space-y-2"><h2 className="text-2xl">Campaign requests</h2><p className="leading-relaxed text-subtle">Submitting a directory package request does not charge you. Confirm scope, fees, cancellation terms, and refund terms with IndieRally before paying for a campaign.</p></section>
    <section className="space-y-2"><h2 className="text-2xl">Requesting help</h2><p className="leading-relaxed text-subtle">Use the contact form for questions about an agreed campaign or to request cancellation or a refund. Include your product name and any campaign reference.</p></section>
    <Link className="inline-block font-semibold underline" href="/contact">Contact IndieRally</Link>
  </article>;
}
