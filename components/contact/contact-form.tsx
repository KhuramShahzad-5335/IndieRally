import Link from "next/link";
import { ActionForm } from "@/components/forms/action-form";
import { plans } from "@/lib/editorial";
import { send } from "@/app/contact/actions";

export function ContactForm({ service }: { service?: string }) {
  const selectedPlan = plans.find((plan) => plan.id === service);
  return (
    <ActionForm
      action={send}
      label="Send message"
      pendingLabel="Sending your message…"
      className="gap-5 [&>button]:mt-1 [&>button]:min-h-12 [&>button]:w-full [&_label]:text-sm [&_input]:min-h-12 [&_select]:min-h-12"
    >
      {selectedPlan && (
        <p className="w-full rounded-lg bg-soft px-4 py-3 text-sm leading-6 text-subtle">
          You're asking about the{" "}
          <strong className="text-ink">{selectedPlan.name} package</strong>.
          Tell us about your product and what you'd like to achieve.
        </p>
      )}
      <div className="grid w-full items-start gap-5 sm:grid-cols-2">
      <label>
        Your name
        <input
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={80}
          placeholder="What should we call you?"
        />
      </label>
      <div className="grid content-start gap-2">
      <label>
        Email address
        <input
          name="email"
          autoComplete="email"
          type="email"
          required
          maxLength={254}
          placeholder="you@example.com"
          aria-describedby="contact-email-hint"
        />
      </label>
      <p id="contact-email-hint" className="text-xs leading-5 text-muted">
        The best address for our team to reply to.
      </p>
      </div>
      </div>
      <label>
        What can we help with?
        <select name="topic" defaultValue={selectedPlan?.id ?? "general"}>
          <option value="general">A question or feedback</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} package
            </option>
          ))}
        </select>
      </label>
      <label>
        Your message
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={3000}
          rows={5}
          placeholder="Tell us a little about your idea, product, or question…"
          className="min-h-32 resize-y leading-6"
          aria-describedby="contact-message-hint"
        />
      </label>
      <p
        id="contact-message-hint"
        className="-mt-3 text-xs leading-5 text-muted"
      >
        A product link and a little context help us give a useful answer. Up to
        3,000 characters.
      </p>
      <input name="fax" hidden tabIndex={-1} autoComplete="off" />
      <p className="text-xs leading-6 text-muted">
        We'll use these details to handle your request. Read our{" "}
        <Link
          href="/privacy"
          className="font-medium text-subtle underline underline-offset-4"
        >
          privacy policy
        </Link>
        .
      </p>
    </ActionForm>
  );
}
