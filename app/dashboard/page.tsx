import { isLive } from "@/lib/rounds";
import Link from "next/link";
import { requireAccount } from "@/lib/accounts";
import { repository } from "@/lib/store";
import { signOut } from "../account-actions";
import { SubmitLink } from "@/components/products/submit-link";

export const metadata = { title: "My submissions", robots: { index: false, follow: false } };
export default async function Dashboard() {
  const account = await requireAccount();
  const items = (await (await repository()).find({ ownerId: account._id })).sort((a,b) => b.submittedAt.localeCompare(a.submittedAt));
  return <div className="mx-auto w-[calc(100%-48px)] md:w-[90%] max-[590px]:w-[calc(100%-28px)] max-w-[760px] min-h-[65vh] pt-12 pb-16">
    <div className="flex items-center justify-between gap-[18px] max-[590px]:items-start [&_p]:mt-2 [&_p]:text-muted"><div><h1>My submissions</h1><p>{account.email}</p></div>
      <form action={signOut}><button className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-line bg-surface hover:bg-soft">Sign out</button></form></div>
    <div className="rounded-md border border-line bg-surface p-[22px] [&_h2]:text-[1.4rem] [&_p]:mt-2 mt-5">
      {items.length ? <ul className="mt-3 grid gap-2 [&_time]:text-xs [&_time]:text-muted [&>li]:border-b [&>li]:border-line [&>li]:py-2.5">{items.map(item => <li key={item.slug}><Link className="text-subtle underline-offset-4 hover:underline" href={"/dashboard/" + item.slug}>{item.name}</Link> · {item.status === "changes" ? "Changes requested" : item.status === "published" && !isLive(item) ? "Scheduled" : item.status}</li>)}</ul> : <p>You haven’t submitted any products yet.</p>}
      <div className="mt-4"><SubmitLink/></div>
    </div>
  </div>;
}
