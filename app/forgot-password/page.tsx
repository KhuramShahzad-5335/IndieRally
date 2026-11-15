import Link from "next/link";
import { MailCheck, ArrowLeft } from "lucide-react";
import { requestReset } from "../password-actions";
import { ActionForm } from "@/components/forms/action-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata = { title: "Forgot password", robots: { index: false, follow: false } };
export default async function ForgotPassword({searchParams}: {searchParams: Promise<{sent?:string}>}) {
  const {sent} = await searchParams;
  const submitted = sent === "1";
  return <AuthShell eyebrow="Let's get you back in" title={submitted ? "Check your inbox." : "Forgot your password?"}
    description={submitted ? "Your next step is in your email." : "It happens. Enter the email you use for IndieRally and we'll help you choose a new password."}
    footer={<Link href="/login" className="inline-flex items-center gap-2 font-semibold text-ink underline underline-offset-4"><ArrowLeft size={16} aria-hidden="true"/>Back to sign in</Link>}>
    {submitted ? <div role="status" className="text-center">
      <MailCheck className="mx-auto mb-4 text-subtle" size={32} aria-hidden="true"/>
      <h2 className="text-xl">Look for a reset link</h2>
      <p className="mt-3 text-sm leading-7 text-muted">If an account matches that email, you'll receive a link valid for 30 minutes. Check your spam folder too.</p>
      <p className="mt-4 border-t border-line pt-4 text-xs leading-6 text-muted">Nothing yet? Wait five minutes before requesting another link.</p>
      <Link href="/forgot-password" className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">Try another email</Link>
    </div> : <ActionForm action={requestReset} label="Send reset link" pendingLabel="Requesting your link…" className="gap-5 [&>button]:min-h-12 [&>button]:w-full [&_label]:text-sm [&_input]:min-h-12">
      <label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required maxLength={254}/></label>
      <p className="text-xs leading-6 text-muted">We'll email a secure link so you can reset your password.</p>
    </ActionForm>}
  </AuthShell>;
}
