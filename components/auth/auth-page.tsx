import Link from "next/link";
import { redirect } from "next/navigation";
import { currentAccount } from "@/lib/accounts";
import { ActionForm } from "@/components/forms/action-form";
import { PasswordField } from "@/components/forms/password-field";
import { AuthShell } from "@/components/auth/auth-shell";
import { authenticate } from "@/app/account-actions";

export async function AuthPage({ mode, vote, reset, inquiry }: { mode: "signup" | "login"; vote?: string; reset?: boolean; inquiry?: string }) {
  const inquiryId = typeof inquiry === "string" && /^[a-f0-9]{24}$/.test(inquiry) ? inquiry : "";
  if (!reset && await currentAccount()) redirect(inquiryId ? "/inquiries/" + inquiryId : "/dashboard");
  const signup = mode === "signup";
  return <AuthShell eyebrow={signup ? "Your next chapter starts here" : "Your IndieRally account"}
    title={signup ? "Make room for your next big idea." : "Good to have you back."}
    description={signup ? "Join independent builders. Launch your product, discover new ideas, and support the people behind them." : "Sign in to manage your launches and cheer on the products you want to see succeed."}
    footer={<>{signup ? "Already part of the rally? " : "New to IndieRally? "}<Link className="font-semibold text-ink underline underline-offset-4" href={(signup ? "/login" : "/signup") + (inquiryId ? "?inquiry=" + inquiryId : vote ? "?vote=" + encodeURIComponent(vote) : "")}>{signup ? "Sign in" : "Create an account"}</Link></>}>
    {reset && <p role="status" className="mb-5 rounded-lg bg-soft p-3 text-sm leading-6">Password updated. You're ready to sign in with your new password.</p>}
    {inquiryId && <p role="status" className="mb-5 rounded-lg bg-soft p-3 text-sm leading-6">Sign in to the account that submitted this inquiry to read and reply.</p>}
    {vote && <p role="status" className="mb-5 rounded-lg bg-soft p-3 text-sm leading-6">One more step: sign in or create an account to upvote this launch.</p>}
    <ActionForm action={authenticate.bind(null, mode)} label={signup ? "Create account" : "Sign in"} pendingLabel={signup ? "Creating your account…" : "Signing in…"} className="gap-5 [&>button]:mt-2 [&>button]:min-h-12 [&>button]:w-full [&_label]:text-sm [&_input]:min-h-12">
      {inquiryId && <input type="hidden" name="inquiry" value={inquiryId}/>}
      {vote && <input type="hidden" name="vote" value={vote}/>}
      {signup && <label>Display name<input name="name" placeholder="What should we call you?" required minLength={2} maxLength={60} autoComplete="name"/></label>}
      <label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="username" required maxLength={254}/></label>
      <PasswordField autoComplete={signup ? "new-password" : "current-password"} hint={signup ? "Use 12–128 characters. A few unrelated words make a memorable password." : undefined}/>
      {!signup && <Link href="/forgot-password" className="justify-self-end text-sm font-medium text-subtle underline underline-offset-4">Forgot password?</Link>}
    </ActionForm>
  </AuthShell>;
}

