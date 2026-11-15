import Link from "next/link";

export const metadata = { title: "Cookie policy", alternates: { canonical: "/cookies" } };

export default function PolicyPage() {
  return <article className="mx-auto w-[90%] max-w-3xl space-y-7 py-12">
    <h1>Cookie policy</h1>
    <section className="space-y-2"><h2 className="text-2xl">Sign-in cookies</h2><p className="leading-relaxed text-subtle">IndieRally uses session cookies to keep founders signed in and a separate cookie for moderator access. Signing out ends your current founder session.</p></section>
    <section className="space-y-2"><h2 className="text-2xl">Browser controls</h2><p className="leading-relaxed text-subtle">You can clear cookies and site storage in your browser. Clearing them signs you out on that browser.</p></section>
    <Link className="inline-block font-semibold underline" href="/contact">Contact IndieRally</Link>
  </article>;
}

