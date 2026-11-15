import { pageMetadata, siteOrigin } from "@/lib/seo";
import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { currentAccount } from "@/lib/accounts";
import { isLive } from "@/lib/rounds";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { repository } from "@/lib/store";
import { hash } from "@/lib/auth";
import { Card } from "@/components/products/product-card";
import { Icon } from "@/components/products/product-icon";
import { JsonLd } from "@/components/seo/json-ld";
import { Vote } from "@/components/products/product-vote";
type Props = { params: Promise<{ slug: string }> };
const get = cache(async (slug: string) => { return (await (await repository()).find({ slug, status: "published" })).find(item=>isLive(item)); });
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await get((await params).slug);
  if (!item) return { title: "Product unavailable", robots: { index: false } };
  const url = "/products/" + item.slug;
  return pageMetadata(item.name, item.tagline, url);
}
export default async function Product({ params }: Props) {
  const item = await get((await params).slug);
  if (!item) notFound();
  const account = await currentAccount();
  const voter = account ? hash(account._id) : undefined;
  const related = (await (await repository()).find({ status: "published", category: item.category })).filter(entry => isLive(entry) && entry.slug !== item.slug).slice(0, 3);
  return <div className="mx-auto w-[calc(100%-48px)] md:w-[90%] max-[590px]:w-[calc(100%-28px)] max-w-[760px] min-h-[65vh] pt-12 pb-16"><Link className="mb-[22px] inline-flex items-center gap-2 text-subtle hover:underline" href="/#directory"><ArrowLeft size={17}/> All products</Link>
    <div className="mb-[18px] rounded-md border border-line bg-tint p-8 max-[590px]:p-[22px] [&>p]:mt-2 [&>p]:max-w-full [&>span:nth-child(2)]:mt-3 [&>span:nth-child(2)]:mb-2"><Icon item={item} large/><span className="inline-block rounded-full bg-soft px-2.5 py-1 text-xs font-semibold text-subtle">{item.category}</span><h1>{item.name}</h1><p className="max-w-[500px] text-[17px] leading-[1.65] text-subtle">{item.tagline}</p><div className="mt-[25px] flex flex-wrap items-center gap-2.5"><a href={item.website} rel="ugc nofollow noopener noreferrer" target="_blank" className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-[#171717] bg-accent text-[#fff] hover:bg-[#383838]">Visit website <ArrowUpRight size={17}/></a><Vote item={item} voter={voter}/></div></div>
    <section className="rounded-md border border-line bg-surface p-[22px] [&_h2]:text-[1.4rem] [&_p]:mt-2"><h2>About {item.name}</h2><p className="whitespace-pre-wrap wrap-anywhere">{item.description}</p><dl className="mt-[18px] flex flex-wrap gap-6 [&_dt]:text-xs [&_dt]:text-muted [&_dd]:font-semibold"><div><dt>Maker</dt><dd>{item.maker}</dd></div><div><dt>Pricing</dt><dd>{item.pricing}</dd></div><div><dt>Published</dt><dd>{item.publishedAt?.slice(0, 10)}</dd></div></dl></section>
    {related.length > 0 && <section className="mt-[25px] [&_h2]:mb-3 [&_h2]:text-[1.4rem]"><h2>More in {item.category}</h2><div className="grid gap-2.5">{related.map(entry => <Card key={entry.slug} item={entry} voter={voter}/>)}</div></section>}
    <JsonLd value={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: item.name, description: item.description, applicationCategory: item.category, url: new URL("/products/" + item.slug, siteOrigin()).href, author: { "@type": "Organization", name: item.maker }, datePublished: item.publishedAt }}/>
  </div>;
}
