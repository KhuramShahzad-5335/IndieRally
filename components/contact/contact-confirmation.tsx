import Link from "next/link";
import { Check } from "lucide-react";

export function ContactConfirmation() {
  return <div className="text-center">
    <div role="status">
      <span className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-soft text-ink"><Check size={24} aria-hidden="true"/></span>
      <h2 className="text-xl">Your message is with us.</h2>
      <p className="mt-3 text-sm leading-7 text-muted">Your request has been saved for the IndieRally team. If it needs a reply, we'll use the email address you provided.</p>
    </div>
    <Link href="/explore" className="mt-6 flex min-h-12 items-center justify-center rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#383838] motion-reduce:transition-none">Explore indie launches</Link>
    <Link href="/contact" className="mt-5 inline-block text-sm font-semibold text-subtle underline underline-offset-4">Send another message</Link>
  </div>;
}
