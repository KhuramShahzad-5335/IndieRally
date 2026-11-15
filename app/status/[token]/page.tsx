import { isLive } from "@/lib/rounds";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hash } from "@/lib/auth";
import { repository } from "@/lib/store";
import { revise } from "../../actions";
import { ActionForm } from "@/components/forms/action-form";
import { ProductFields } from "@/components/products/product-fields";

export const metadata: Metadata = { title: "Submission status", robots: { index: false, follow: false }, referrer: "no-referrer" };
const labels = { pending: "In review", published: "Published", changes: "Changes requested", rejected: "Declined" };
export default async function Status({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-f0-9]{48}$/.test(token)) notFound();
  const item = (await (await repository()).find({ trackingHash: hash(token) }))[0];
  if (!item) notFound();
  return <div className="mx-auto w-[calc(100%-48px)] md:w-[90%] max-[590px]:w-[calc(100%-28px)] max-w-[760px] min-h-[65vh] pt-12 pb-16"><div className="mb-6 motion-safe:animate-enter [&_p]:mt-2 [&_p]:text-muted [&>a]:mt-4"><span className="inline-block rounded-full bg-soft px-2.5 py-1 text-xs font-semibold text-subtle">{labels[item.status]}</span><h1>{item.name}</h1><p className="max-w-[500px] text-[17px] leading-[1.65] text-subtle">Bookmark this private link to check your submission later. Anyone with the link can access this page.</p>{item.status === "published" && !isLive(item) && <p>Scheduled for {item.publishedAt?.slice(0,10)} at midnight UTC.</p>}{isLive(item) && <Link className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-[#171717] bg-accent text-[#fff] hover:bg-[#383838]" href={`/products/${item.slug}`}>View your listing</Link>}</div>
  <section className="rounded-md border border-line bg-surface p-[22px] [&_h2]:text-[1.4rem] [&_p]:mt-2"><h2>Review history</h2><ol className="mt-3 grid gap-2 [&_time]:text-xs [&_time]:text-muted [&>li]:border-b [&>li]:border-line [&>li]:py-2.5">{[...item.history].reverse().map((event, index) => <li key={index}><strong>{labels[event.status]}</strong> <time dateTime={event.at}>{event.at.slice(0, 10)}</time>{event.note && <p className="whitespace-pre-wrap wrap-anywhere">{event.note}</p>}</li>)}</ol></section>
  {item.status === "changes" && <ActionForm action={revise.bind(null, token)} label="Resubmit for review" className="rounded-md border border-line bg-surface p-[22px] [&_h2]:text-[1.4rem] [&_p]:mt-2 mt-5"><h2>Edit your submission</h2><ProductFields item={item}/></ActionForm>}
  </div>;
}
