import Link from "next/link";
import { redirect } from "next/navigation";
import { currentAccount } from "@/lib/accounts";
import { ActionForm } from "@/components/forms/action-form";
import { authenticate } from "@/app/account-actions";

export async function AuthPage({ mode, vote, reset }: { mode: "signup" | "login"; vote?: string; reset?: boolean }) {
  if (!reset && await currentAccount()) redirect("/dashboard");
  const signup = mode === "signup";
  const title = signup ? "Create your account" : "Sign in";
  return <div className="mx-auto w-[calc(100%-48px)] md:w-[90%] max-[590px]:w-[calc(100%-28px)] max-w-[760px] min-h-[65vh] pt-12 pb-16">
    <div className="mb-6 motion-safe:animate-enter [&_p]:mt-2 [&_p]:text-muted [&>a]:mt-4"><h1>{title}</h1><p className="max-w-[500px] text-[17px] leading-[1.65] text-subtle">Submit products and keep track of their reviews.</p></div>
    {reset && <p role="status" className="mb-4 rounded-lg bg-soft p-3">Your password was updated. Sign in with your new password.</p>}{vote && <p className="rounded-md bg-[#efefef] px-3.5 py-3 text-[#434343] mb-4" role="alert">Sign in or create an account to upvote a launch.</p>}<ActionForm action={authenticate.bind(null, mode)} label={title} className="rounded-md border border-line bg-surface p-[22px] [&_h2]:text-[1.4rem] [&_p]:mt-2">
      {vote && <input type="hidden" name="vote" value={vote}/>} {signup && <label>Display name<input name="name" required minLength={2} maxLength={60} autoComplete="name"/></label>}<label>Email<input name="email" type="email" autoComplete="username" required maxLength={254}/></label>
      <label>Password<input name="password" type="password" minLength={12} maxLength={128} autoComplete={signup ? "new-password" : "current-password"} required/></label>
      {signup && <p>Use at least 12 characters.</p>}
    </ActionForm>{!signup && <Link href="/forgot-password" className="mt-4 block text-subtle underline">Forgot password?</Link>}
    <Link className="text-subtle underline-offset-4 hover:underline mt-4 inline-block" href={(signup ? "/login" : "/signup") + (vote ? "?vote="+encodeURIComponent(vote) : "")}>{signup ? "Already have an account? Sign in" : "New to IndieRally? Create an account"}</Link>
  </div>;
}
