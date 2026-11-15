import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, Inbox, PackageCheck, Radio, Trophy } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { repository } from "@/lib/store";
import { inbox } from "@/lib/inquiries";
import { allBlogPosts } from "@/lib/blog";
import { isLive, startOfRound } from "@/lib/rounds";
import { votes } from "@/lib/domain";
import { logout } from "@/app/actions";

export const metadata = { title: "Admin dashboard", robots: { index: false, follow: false } };
const cards = [
  { href: "/admin", label: "Product moderation", icon: PackageCheck },
  { href: "/inquiries", label: "Inquiry inbox", icon: Inbox },
  { href: "/admin/blog", label: "Blog management", icon: BookOpen },
  { href: "/explore", label: "Public launch board", icon: Radio },
];
export default async function AdminDashboard() {
  if (!(await isAdmin())) redirect("/admin");
  const [listings, inquiryCount, posts] = await Promise.all([
    (await repository()).find({}),
    (await inbox()).countDocuments({}),
    allBlogPosts(),
  ]);
  const pending = listings.filter(item => item.status === "pending");
  const live = listings.filter(item => isLive(item) && startOfRound(Date.parse(item.publishedAt ?? "")) === startOfRound());
  const ranked = [...live].sort((a, b) => votes(b) - votes(a) || a.slug.localeCompare(b.slug)).slice(0, 5);
  const published = posts.filter(post => post.status === "published");
  const drafts = posts.filter(post => post.status === "draft");
  const stats = [
    { label: "Awaiting review", value: pending.length, href: "/admin#review-queue", hint: "Product submissions" },
    { label: "Inquiries", value: inquiryCount, href: "/inquiries", hint: "Customer conversations" },
    { label: "Published articles", value: published.length, href: "/admin/blog", hint: `${drafts.length} draft${drafts.length === 1 ? "" : "s"}` },
    { label: "This week’s launches", value: live.length, href: "/explore", hint: "Current leaderboard" },
  ];
  return <div className="mx-auto min-h-[70vh] w-[calc(100%-32px)] max-w-7xl py-10 md:w-[90%] lg:py-16">
    <header className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-7"><div><p className="font-mono text-xs uppercase tracking-[.2em] text-muted">IndieRally / Operations</p><h1 className="mt-3 text-4xl sm:text-5xl">Admin dashboard</h1><p className="mt-3 text-muted">A clear view of launches, conversations, and editorial work.</p></div><form action={logout}><button className="rounded-lg border border-line bg-surface px-4 py-3 text-sm font-semibold hover:bg-soft">Sign out</button></form></header>
    <section aria-label="Admin summary" className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({label,value,href,hint})=><Link key={label} href={href} className="rounded-2xl border border-line bg-surface p-5 transition-colors hover:bg-soft"><p className="text-sm text-muted">{label}</p><p className="mt-3 text-4xl font-semibold tracking-tight">{value}</p><p className="mt-2 text-xs text-muted">{hint}</p></Link>)}</section>
    <section aria-label="Admin workspaces" className="mt-10"><div className="flex items-baseline justify-between gap-3"><h2 className="text-2xl">Your workspaces</h2><span className="text-xs font-mono text-muted">01 / 04</span></div><div className="mt-4 grid gap-3 sm:grid-cols-2">{cards.map(({href,label,icon:Icon},index)=><Link key={href} href={href} className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors hover:bg-soft"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-soft"><Icon size={20} aria-hidden/></span><span className="min-w-0 flex-1"><span className="block text-xs font-mono text-muted">0{index+1} / WORKSPACE</span><span className="mt-1 block font-semibold">{label}</span></span><ArrowRight size={18} className="text-muted transition-transform group-hover:translate-x-1" aria-hidden/></Link>)}</div></section>
    <section className="mt-10"><div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4"><div className="flex items-center gap-3"><Trophy size={20} aria-hidden/><h2 className="text-2xl">This week’s leaderboard</h2></div><Link href="/explore" className="text-sm font-semibold underline underline-offset-4">Open launch board →</Link></div>{ranked.length ? <ol className="divide-y divide-line">{ranked.map((item,index)=><li key={item.slug} className="flex flex-wrap items-center gap-3 py-4"><span className="w-8 font-mono text-sm text-muted">{String(index+1).padStart(2,"0")}</span><span className="min-w-0 flex-1"><Link href={`/products/${item.slug}`} className="font-semibold hover:underline">{item.name}</Link><span className="ml-2 text-sm text-muted">{item.category}</span></span><span className="text-sm text-muted">{votes(item)} votes</span></li>)}</ol> : <p className="py-5 text-sm text-muted">No published launches in this week’s round yet.</p>}</section>
  </div>;
}
