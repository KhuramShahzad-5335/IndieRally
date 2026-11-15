import Link from "next/link";
import { resetPassword } from "../password-actions";
import { ActionForm } from "@/components/forms/action-form";
import { PasswordField } from "@/components/forms/password-field";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata = { title: "Reset password", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function ResetPassword({searchParams}: {searchParams: Promise<{token?:string}>}) {
  const {token} = await searchParams;
  const valid = typeof token === "string" && /^[a-f0-9]{64}$/.test(token);
  return <AuthShell eyebrow="A fresh start" title={valid ? "Choose a new password." : "Let's try a new link."}
    description={valid ? "Make it unique, make it yours. You'll use this password the next time you sign in." : "This reset link is incomplete or invalid. Request a new one to get back to your account."}
    footer={<Link href="/login" className="font-semibold text-ink underline underline-offset-4">Back to sign in</Link>}>
    {valid ? <>
      <ActionForm action={resetPassword} label="Update password" pendingLabel="Updating your password…" className="gap-5 [&>button]:mt-2 [&>button]:min-h-12 [&>button]:w-full">
        <input name="token" type="hidden" value={token}/>
        <PasswordField label="New password" autoComplete="new-password" hint="Use 12–128 characters and avoid reusing a password from another account."/>
        <PasswordField name="confirm" label="Confirm new password" autoComplete="new-password"/>
        <p className="text-xs leading-6 text-muted">For your security, updating your password signs you out of your existing sessions.</p>
      </ActionForm>
      <Link href="/forgot-password" className="mt-5 block text-center text-sm text-subtle underline underline-offset-4">Need a new reset link?</Link>
    </> : <div role="alert" className="text-center">
      <p className="mb-5 text-sm leading-7 text-muted">Reset links can only be used once and expire after 30 minutes.</p>
      <Link href="/forgot-password" className="flex min-h-12 items-center justify-center rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-[#383838]">Request a new link</Link>
    </div>}
  </AuthShell>;
}
