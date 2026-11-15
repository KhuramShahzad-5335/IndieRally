import Link from "next/link";
import { resetPassword } from "../password-actions";
import { ActionForm } from "@/components/forms/action-form";

export const metadata = { title: "Reset password", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function ResetPassword({searchParams}: {searchParams: Promise<{token?:string}>}) {
  const {token} = await searchParams;
  return <div className="mx-auto w-[calc(100%-32px)] md:w-[90%] max-w-xl py-12"><h1>Reset your password</h1>
    {typeof token === "string" && /^[a-f0-9]{64}$/.test(token) ?
      <ActionForm action={resetPassword} label="Update password" className="mt-6 rounded-md border border-line bg-surface p-5">
        <input name="token" type="hidden" value={token}/>
        <label>New password<input type="password" name="password" required minLength={12} maxLength={128} autoComplete="new-password"/></label>
        <label>Confirm password<input type="password" name="confirm" required minLength={12} maxLength={128} autoComplete="new-password"/></label>
      </ActionForm> : <p className="mt-4" role="alert">This reset link is invalid.</p>}
    <Link href="/forgot-password" className="mt-5 inline-block text-subtle underline">Request a new link</Link>
  </div>;
}
