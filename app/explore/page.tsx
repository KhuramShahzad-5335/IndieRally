import Link from "next/link";
import { ArrowUpRight, Radio, Trophy } from "lucide-react";
import { repository } from "@/lib/store";
import { votes } from "@/lib/domain";
import { isLive, WEEK, startOfRound } from "@/lib/rounds";
import { Icon } from "@/components/products/product-icon";
import { SubmitLink } from "@/components/products/submit-link";
import { Vote } from "@/components/products/product-vote";
import { currentAccount } from "@/lib/accounts";
import { hash } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = {title:"Explore weekly launches",description:"See this week’s product leaderboard and winners from the last three weeks.",alternates:{canonical:"/explore"}};
const dateKey = (time: number) => new Date(time).toISOString().slice(0,10);
const dateLabel = (time: number) => new Intl.DateTimeFormat("en",{month:"short",day:"numeric",timeZone:"UTC"}).format(time);

export default async function Explore({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
  const now = Date.now();
  const current = startOfRound(now);
  const weeks = [current, current-WEEK, current-2*WEEK, current-3*WEEK];
  const [{week}, listings, account] = await Promise.all([
    searchParams, (await repository()).find({status:"published"}), currentAccount(),
  ]);
  const selected = weeks.find(start => dateKey(start) === week) ?? current;
  const live = selected === current;
  const voter = account ? hash(account._id) : undefined;
  const items = listings.filter(item => isLive(item, now) && startOfRound(Date.parse(item.publishedAt ?? "")) === selected)
    .sort((a,b) => votes(b)-votes(a) || a.slug.localeCompare(b.slug));
  const topScore = items.length ? votes(items[0]) : 0;

  return <div className="mx-auto w-[calc(100%-48px)] md:w-[90%] max-[590px]:w-[calc(100%-28px)] min-h-[65vh] pt-7 pb-10 sm:pt-10">
    <div className="mb-6 [&_p]:mt-2 [&_p]:text-muted [&>a]:mt-4"><h1>Explore weekly launches</h1><p className="max-w-[500px] text-[17px] leading-[1.65] text-subtle">Discover new products and see which ones topped the leaderboard. Each round starts Monday at midnight UTC.</p><SubmitLink/></div>
    <nav aria-label="Launch weeks" className="mb-6 flex flex-wrap gap-2 max-[580px]:grid max-[580px]:grid-cols-2 max-[580px]:[&_a]:whitespace-normal max-[580px]:[&_a]:text-center">
      {weeks.map((start,index) => <Link key={start} className={start === selected ? "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-[#171717] bg-accent text-[#fff] hover:bg-[#383838]" : "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-line bg-surface hover:bg-soft"} aria-current={start === selected ? "page" : undefined} href={index ? "/explore?week="+dateKey(start) : "/explore"}>
        <span>{index ? "Week of " + dateLabel(start) : "This week"}</span>
      </Link>)}
    </nav>
    <section className="mt-4 max-[580px]:[&>div:first-child]:flex-wrap" aria-labelledby="round-heading">
      <div className="flex items-center justify-between gap-[18px] max-[590px]:items-start [&_p]:mt-2 [&_p]:text-muted mb-4"><h2 id="round-heading" className="flex items-center gap-2">{live ? <Radio size={22}/> : <Trophy size={22}/>} {live ? "Live leaderboard" : "Weekly results"}</h2><span className="rounded-full bg-soft px-2.5 py-1 text-xs font-semibold text-subtle whitespace-nowrap">{dateLabel(selected)} – {dateLabel(selected+WEEK-1)}</span></div>
      {items.length ? <ol className="grid gap-4 xl:grid-cols-2">{items.map((item,index) => {
        const tied = index > 0 && votes(item) === votes(items[index-1]);
        const rank = tied ? items.findIndex(entry=>votes(entry)===votes(item))+1 : index+1;
        const winner = !live && topScore > 0 && rank === 1;
        return <li key={item.slug} className={`group relative grid overflow-hidden rounded-md border bg-surface motion-safe:transition-colors hover:border-muted md:grid-cols-[38%_1fr] ${winner ? "border-[#959595]" : "border-line"}`}>
          <div className="grid min-h-32 place-items-center border-b border-line bg-paper p-5 md:border-r md:border-b-0"><Icon item={item} large/></div>
          <div className="min-w-0 p-5">
            <div className="flex items-center justify-between gap-2 text-xs font-semibold tracking-wider text-muted uppercase"><span className="inline-flex items-center gap-2">{winner && <Trophy size={15} aria-hidden/>}{winner ? "Weekly winner" : "Rank " + rank} · {item.category}</span><ArrowUpRight size={16} aria-hidden className="shrink-0"/></div>
            <h3 className="mt-3 text-2xl wrap-anywhere"><Link href={"/products/" + item.slug} className="after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-[#717171]">{item.name}</Link></h3>
            <p className="mt-2 leading-relaxed text-subtle wrap-anywhere">{item.tagline}</p>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
              <span className="text-sm text-muted">{item.pricing} · {item.maker}</span>
              <Vote item={item} voter={voter}/>
            </div>
          </div>
        </li>;
      })}</ol> : <p className="rounded-md border border-line bg-surface p-[22px] [&_h2]:text-[1.4rem] [&_p]:mt-2">No launches {live ? "yet this week." : "in this week’s round."}</p>}
    </section>
  </div>;
}
