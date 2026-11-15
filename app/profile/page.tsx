import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { accountStore, passwordDigest, passwordMatches, requireAccount } from "@/lib/accounts";
import { repository } from "@/lib/store";
import { inbox } from "@/lib/inquiries";
import { plans } from "@/lib/editorial";
import { isLive } from "@/lib/rounds";
import { signOut } from "../account-actions";
import { ActionForm } from "@/components/forms/action-form";
import { SubmitLink } from "@/components/products/submit-link";

export const metadata = {title:"Profile",robots:{index:false,follow:false}};

async function save(_:string, form:FormData){
  "use server";
  const account = await requireAccount();
  const name = String(form.get("name") ?? "").trim();
  if (name.length < 2 || name.length > 60) return "Use a display name of 2–60 characters.";
  await (await accountStore()).accounts.updateOne({_id:account._id},{$set:{name}});
  redirect("/profile?saved=1");
}

async function deleteAccount(_:string, form:FormData){
  "use server";
  const {_id} = await requireAccount();
  const password = String(form.get("password") ?? "");
  if (form.get("confirm") !== "on" || password.length < 12 || password.length > 128) return "Enter your current password and confirm deletion.";
  try {
    const {accounts,sessions,client,db} = await accountStore();
    const account = await accounts.findOne({_id});
    if (!account || !passwordMatches(await passwordDigest(password,account.salt),account.passwordHash)) return "Incorrect password.";
    await client.withSession(session => session.withTransaction(async () => {
      const deleted = await accounts.deleteOne({_id,passwordHash:account.passwordHash},{session});
      if (!deleted.deletedCount) throw new Error("Account changed during deletion.");
      await sessions.deleteMany({ownerId:_id},{session});
      await db.collection("launchdeck").deleteMany({ownerId:_id},{session});
      await db.collection("inquiries").deleteMany({ownerId:_id},{session});
    }));
  } catch {
    return "Account deletion could not be confirmed. Please try again.";
  }
  (await cookies()).delete("ld-account");
  redirect("/");
}

export default async function Profile({searchParams}:{searchParams:Promise<{saved?:string}>}){
  const account = await requireAccount();
  const [{saved},products,requests] = await Promise.all([
    searchParams,
    (await repository()).find({ownerId:account._id}),
    (await inbox()).find({ownerId:account._id,topic:{$in:plans.map(plan=>plan.id)}}).sort({createdAt:-1}).toArray(),
  ]);
  return <div className="mx-auto w-[calc(100%-48px)] md:w-[90%] max-[590px]:w-[calc(100%-28px)] max-w-[760px] min-h-[65vh] pt-12 pb-16">
    <div className="flex items-center justify-between gap-[18px] max-[590px]:items-start [&_p]:mt-2 [&_p]:text-muted mb-5"><div><h1>Your profile</h1><p>{account.email}</p><Link href="/inquiries" className="mt-3 inline-block font-semibold underline underline-offset-4">Your inquiries & replies →</Link></div><form action={signOut}><button className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-line bg-surface hover:bg-soft">Sign out</button></form></div>
    {saved === "1" && <p className="rounded-md bg-[#efefef] px-3.5 py-3 text-[#434343] mb-4" role="status">Profile updated.</p>}
    <ActionForm action={save} className="rounded-md border border-line bg-surface p-[22px] [&_h2]:text-[1.4rem] [&_p]:mt-2" label="Save profile"><h2>Account details</h2><label>Display name<input name="name" defaultValue={account.name} required minLength={2} maxLength={60} autoComplete="name"/></label></ActionForm>
    <section className="rounded-md border border-line bg-surface p-[22px] [&_h2]:text-[1.4rem] [&_p]:mt-2 mt-5"><div className="flex items-center justify-between gap-[18px] max-[590px]:items-start [&_p]:mt-2 [&_p]:text-muted"><h2>Your products</h2><SubmitLink/></div>
      {products.length ? <ul className="mt-3 grid gap-2 [&_time]:text-xs [&_time]:text-muted [&>li]:border-b [&>li]:border-line [&>li]:py-2.5">{products.sort((a,b)=>b.submittedAt.localeCompare(a.submittedAt)).map(item => <li key={item.slug}><Link className="text-subtle underline-offset-4 hover:underline" href={"/dashboard/"+item.slug}>{item.name}</Link> · {item.status === "changes" ? "Changes requested" : item.status === "published" && !isLive(item) ? "Scheduled" : item.status}</li>)}</ul> : <p>You haven’t submitted any products yet.</p>}
    </section>
    <section className="rounded-md border border-line bg-surface p-[22px] [&_h2]:text-[1.4rem] [&_p]:mt-2 mt-5"><h2>Directory service requests</h2>
      {requests.length ? <ul className="mt-3 grid gap-2 [&_time]:text-xs [&_time]:text-muted [&>li]:border-b [&>li]:border-line [&>li]:py-2.5">{requests.map(request => <li key={String(request._id)}><strong>{plans.find(plan=>plan.id===request.topic)?.name}</strong> · Requested <time dateTime={request.createdAt.toISOString()}>{request.createdAt.toISOString().slice(0,10)}</time></li>)}</ul> : <p>You haven’t requested any directory packages.</p>}
      <Link className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-line bg-surface hover:bg-soft mt-4" href="/pricing">View service packages</Link>
    </section>
    <ActionForm action={deleteAccount} className="rounded-md border border-line bg-surface p-[22px] [&_h2]:text-[1.4rem] [&_p]:mt-2 mt-5 [&_button]:!border-[#424242] [&_button]:!bg-[#424242] [&_button]:!text-white [&_button:hover]:!bg-[#343434]" label="Delete account">
      <h2>Delete account</h2><p>This permanently removes your account, active sessions, product listings, and contact requests sent while signed in. Published products will also disappear from launch rankings.</p>
      <label>Current password<input name="password" type="password" required maxLength={128} autoComplete="current-password"/></label>
      <label className="!flex items-center !gap-2"><input name="confirm" type="checkbox" required/> I want to permanently delete my account and its listings.</label>
    </ActionForm>
  </div>;
}
