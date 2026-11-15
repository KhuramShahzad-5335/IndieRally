import Link from "next/link";
import { requestReset } from "../password-actions";
import { ActionForm } from "@/components/forms/action-form";

export const metadata = { title: "Forgot password", robots: { index: false, follow: false } };
export default async function ForgotPassword({searchParams}: {searchParams: Promise<{sent?:string}>}) {
  const {sent} = await searchParams;
  return <div className="mx-auto w-[calc(100%-32px)] md:w-[90%] max-w-xl py-12">
    <h1>Forgot password?</h1><p className="mt-3 mb-6 text-muted">Enter the email you use to sign in to IndieRally.</p>
    {sent === "1" ? <p role="status" className="rounded-md border border-line bg-surface p-5">If there’s an account for that email, you’ll receive a reset link. Check your spam folder if it doesn’t arrive.</p> :
      <ActionForm action={requestReset} label="Send reset link" className="rounded-md border border-line bg-surface p-5"><label>Email<input name="email" type="email" autoComplete="email" required maxLength={254}/></label></ActionForm>}
    <Link href="/login" className="mt-5 inline-block text-subtle underline">Back to sign in</Link>
  </div>;
}
