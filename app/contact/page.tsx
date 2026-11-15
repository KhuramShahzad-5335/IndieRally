import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { AuthShell } from "@/components/auth/auth-shell";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactConfirmation } from "@/components/contact/contact-confirmation";
import { plans } from "@/lib/editorial";

export const metadata = pageMetadata("Contact", "Send IndieRally a question about listings, launches, or directory submissions.", "/contact");

export default async function Contact({ searchParams }: { searchParams: Promise<{ service?: string; sent?: string }> }) {
  const { service, sent } = await searchParams;
  const selectedPlan = plans.find(plan => plan.id === service);
  const submitted = sent === "1";
  return <AuthShell
    wide
    eyebrow={submitted ? "Thanks for reaching out" : "A conversation starts here"}
    title={submitted ? "Message received." : selectedPlan ? "Let's plan your launch." : "Let's talk about it."}
    description={submitted ? "One less thing on your to-do list. We'll take it from here." : "A launch in mind, a question to ask, or something we could do better? We'd love to hear from you."}
    footer={<Link href="/" className="inline-flex items-center gap-2 font-semibold text-ink underline underline-offset-4"><ArrowLeft size={16} aria-hidden="true"/>Back to IndieRally</Link>}>
    {submitted ? <ContactConfirmation/> : <ContactForm service={selectedPlan?.id}/>}
  </AuthShell>;
}
