import { isLive } from "@/lib/rounds";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/accounts";
import { repository } from "@/lib/store";
import { reviseOwned } from "../../actions";
import { ActionForm } from "@/components/forms/action-form";
import { ProductFields } from "@/components/products/product-fields";

export const metadata = { title: "Submission review", robots: { index: false, follow: false } };
export default async function Submission({ params }: { params: Promise<{ slug: string }> }) {
  const account = await requireAccount();
  const { slug } = await params;
  const item = (await (await repository()).find({ slug, ownerId: account._id }))[0];
  if (!item) notFound();
  return <div className="mx-auto w-[calc(100%-48px)] md:w-[90%] max-[590px]:w-[calc(100%-28px)] max-w-[760px] min-h-[65vh] pt-12 pb-16">
    <Link href="/dashboard" className="mb-[22px] inline-flex items-center gap-2 text-subtle hover:underline">Back to my submissions</Link>
    <div className="mb-6 motion-safe:animate-enter [&_p]:mt-2 [&_p]:text-muted [&>a]:mt-4"><h1>{item.name}</h1>{item.status==="published" && !isLive(item) && <p>Scheduled for {item.publishedAt?.slice(0,10)} at midnight UTC.</p>}{isLive(item) && <Link href={"/products/" + slug} className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-[#171717] bg-accent text-[#fff] hover:bg-[#383838]">View listing</Link>}</div>
    <section className="rounded-md border border-line bg-surface p-[22px] [&_h2]:text-[1.4rem] [&_p]:mt-2"><h2>Review history</h2><ol className="mt-3 grid gap-2 [&_time]:text-xs [&_time]:text-muted [&>li]:border-b [&>li]:border-line [&>li]:py-2.5">{[...item.history].reverse().map((entry, index) => <li key={index}><strong>{entry.status === "changes" ? "Changes requested" : entry.status}</strong> <time dateTime={entry.at}>{entry.at.slice(0,10)}</time>{entry.note && <p className="whitespace-pre-wrap wrap-anywhere">{entry.note}</p>}</li>)}</ol></section>
    {item.status === "changes" && <ActionForm action={reviseOwned.bind(null, slug)} label="Resubmit for review" className="rounded-md border border-line bg-surface p-[22px] [&_h2]:text-[1.4rem] [&_p]:mt-2 mt-5"><ProductFields item={item}/></ActionForm>}
  </div>;
}
