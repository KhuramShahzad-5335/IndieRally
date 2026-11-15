import { Check, Send } from "lucide-react";
import { FormSection } from "@/components/forms/form-section";
import Image from "next/image";
import { currentAccount } from "@/lib/accounts";
import { inbox } from "@/lib/inquiries";
import { plans } from "@/lib/editorial";
import { redirect } from "next/navigation";
import { ActionForm } from "@/components/forms/action-form";
export const metadata = {title:"Contact", description:"Send IndieRally a question about listings, launches, or directory submissions.", alternates:{canonical:"/contact"}};
async function send(_: string, form: FormData) {
  "use server";
  const read = (key: string) => String(form.get(key) ?? "").trim();
  const name = read("name"), email = read("email"), topic = read("topic"), message = read("message");
  if(name.length < 2 || name.length > 80 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10 || message.length > 3000 || !["general",...plans.map(p=>p.id)].includes(topic)) return "Check your name, email, topic, and message.";
  if(read("fax")) return "Unable to submit this message.";
  try { const account = await currentAccount(); await (await inbox()).insertOne({name,email,topic,message,createdAt:new Date(),...(account ? {ownerId:account._id} : {})}); } catch { return "Your message could not be saved. Please try again."; }
  redirect("/contact?sent=1");
}
export default async function Contact({ searchParams }: { searchParams: Promise<{ service?: string; sent?: string }> }) {
  const { service, sent } = await searchParams;
  const selectedPlan = plans.find(plan => plan.id === service);
  return <div className="grid w-full lg:min-h-[calc(100svh-72px)] lg:grid-cols-2">
    <section aria-labelledby="contact-title" className="relative isolate flex min-h-[320px] items-end overflow-hidden bg-[#252525] px-6 py-10 text-white md:px-[5vw] lg:sticky lg:top-[72px] lg:h-[calc(100svh-72px)] lg:self-start lg:py-16">
      <Image src="/editorial/contact-team.jpg" alt="A team collaborating around a table" fill preload sizes="(min-width: 1024px) 50vw, 100vw" className="-z-20 object-cover object-center grayscale"/>
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/65"/>
      <div className="motion-safe:animate-enter">
        <h1 id="contact-title" className="text-[clamp(2.75rem,6vw,6rem)]">Contact us</h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-white/90">Ask about a product listing, share an issue, or tell us who you want to reach with a directory campaign.</p>
      </div>
    </section>
    <div className="flex min-w-0 flex-col justify-center bg-surface px-6 py-10 md:px-[5vw] lg:py-14">
      <div className="mb-6">
        <div className="mb-4 grid size-11 place-items-center rounded-lg bg-soft"><Send size={20} aria-hidden/></div>
        <h2 className="text-3xl">{selectedPlan ? "Request " + selectedPlan.name : "Send us a message"}</h2>
        <p className="mt-2 text-muted">Include your product link if it helps explain your request.</p>
      </div>
      {sent === "1" && <p className="mb-6 flex items-center gap-3 rounded-md border border-line bg-soft p-4 text-ink" role="status"><Check size={18} aria-hidden className="shrink-0"/>Your message was saved for the IndieRally team.</p>}
      <ActionForm action={send} label="Send message" className="min-w-0 sm:gap-6">
        <FormSection number="01" title="Your details">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <label>Name<input name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="Your name"/></label>
            <label>Email<input name="email" autoComplete="email" type="email" required maxLength={254} placeholder="you@example.com"/></label>
          </div>
        </FormSection>
        <FormSection number="02" title="Your request">
          <label>Topic<select name="topic" defaultValue={selectedPlan?.id ?? "general"}><option value="general">General inquiry</option>{plans.map(plan => <option key={plan.id} value={plan.id}>{plan.name} package</option>)}</select></label>
          <label>Message<textarea name="message" required minLength={10} maxLength={3000} rows={5} placeholder="How can we help?"/></label>
        </FormSection>
        <input name="fax" hidden tabIndex={-1} autoComplete="off"/>
      </ActionForm>
    </div>
  </div>;
}
