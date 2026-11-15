import Link from "next/link";
import type { Filter } from "mongodb";
import { isAdmin } from "@/lib/auth";
import { requireAccount } from "@/lib/accounts";
import { inbox, type Inquiry } from "@/lib/inquiries";

export const metadata = { title: "Inquiries", robots: { index: false, follow: false } };
export default async function Inquiries({ searchParams }: { searchParams: Promise<{ status?: string; page?: string; deleted?: string }> }) {
  const admin = await isAdmin();
  const account = admin ? null : await requireAccount();
  const params = await searchParams;
  const status = ["open", "answered", "closed"].includes(params.status ?? "") ? params.status! : "";
  const page = Math.min(10000, Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1));
  const match: Filter<Inquiry> = admin ? {} : { ownerId: account!._id };
  if (status === "open") match.$or = [{ status: "open" }, { status: { $exists: false } }];
  else if (status) match.status = status as "answered" | "closed";
  const collection = await inbox();
  const [items, total] = await Promise.all([collection.find(match).sort({ createdAt: -1 }).skip((page - 1) * 20).limit(20).toArray(), collection.countDocuments(match)]);
  const pageLink = (number: number) => `/inquiries?page=${number}${status ? "&status=" + status : ""}`;
  return <div className="mx-auto w-[calc(100%-32px)] max-w-5xl py-12 md:w-[90%]">
    <Link href={admin ? "/admin" : "/profile"} className="text-sm text-subtle underline underline-offset-4">← {admin ? "Moderation" : "Your profile"}</Link>
    <header className="mt-7 flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs uppercase tracking-widest text-muted">{admin ? "Team inbox" : "Here to help"}</p><h1 className="mt-3 text-3xl sm:text-4xl">{admin ? "Inquiries & conversations" : "Your inquiries"}</h1><p className="mt-3 text-muted">{total} {total === 1 ? "conversation" : "conversations"}. Read replies and keep everything in one place.</p></div>{!admin && <Link href="/contact" className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white">New inquiry</Link>}</header>
    {params.deleted === "1" && <p role="status" className="mt-5 rounded-xl bg-soft p-4">The inquiry and its conversation have been deleted.</p>}
    <nav aria-label="Filter inquiries" className="my-7 flex flex-wrap gap-2">{["", "open", "answered", "closed"].map(value => <Link key={value} href={value ? "/inquiries?status=" + value : "/inquiries"} aria-current={status === value ? "page" : undefined} className={`rounded-lg border border-line px-4 py-2 text-sm capitalize ${status === value ? "bg-ink text-paper" : "bg-surface"}`}>{value || "All"}</Link>)}</nav>
    <div className="grid gap-3">{items.length ? items.map(item => <Link key={String(item._id)} href={"/inquiries/" + item._id} className="group rounded-xl border border-line bg-surface p-5 transition-colors hover:bg-soft motion-reduce:transition-none">
      <div className="flex flex-wrap justify-between gap-2"><h2 className="text-lg capitalize">{item.topic === "general" ? "General inquiry" : item.topic + " package"}{admin ? " · " + item.name : ""}</h2><span className="text-xs capitalize text-muted">{item.status ?? "open"}</span></div><p className="mt-3 line-clamp-2 whitespace-pre-wrap wrap-anywhere text-sm leading-6 text-subtle">{item.messages?.at(-1)?.text ?? item.message}</p><p className="mt-3 text-xs text-muted">{item.createdAt.toISOString().slice(0, 10)} · {item.messages?.length ?? 0} replies</p>
    </Link>) : <p className="rounded-xl border border-line p-8 text-muted">No inquiries in this view.</p>}</div>
    <nav aria-label="Inquiry pages" className="mt-6 flex justify-between text-sm">{page > 1 ? <Link className="underline" href={pageLink(page - 1)}>Previous</Link> : <span/>}{page * 20 < total && <Link className="underline" href={pageLink(page + 1)}>Next</Link>}</nav>
  </div>;
}
