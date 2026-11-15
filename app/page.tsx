import { siteOrigin } from "@/lib/seo";
import { categorySlug } from "@/lib/categories";
import type { Metadata } from "next";
import Link from "next/link";
import { currentAccount } from "@/lib/accounts";
import { isLive } from "@/lib/rounds";
import {
  ArrowRight,
  ArrowUpRight,

  Layers3,


} from "lucide-react";
import { Card } from "@/components/products/product-card";
import { Icon } from "@/components/products/product-icon";
import { JsonLd } from "@/components/seo/json-ld";
import { SearchBar } from "@/components/products/search-bar";
import { SubmitLink } from "@/components/products/submit-link";
import { repository } from "@/lib/store";
import { categories, search } from "@/lib/domain";
import { hash } from "@/lib/auth";
type Params = Promise<Record<string, string | string[] | undefined>>;
const one = (value: string | string[] | undefined, size: number) =>
  typeof value === "string" ? value.slice(0, size) : "";
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Params;
}): Promise<Metadata> {
  const params = await searchParams;
  return {
    alternates: { canonical: "/" },
    ...([params.q, params.category, params.sort].some(Boolean)
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}
export default async function Home({ searchParams }: { searchParams: Params }) {
  const params = await searchParams;
  const q = one(params.q, 100),
    category = one(params.category, 30),
    sort = params.sort === "top" ? "top" : "new";
  const all = (await (await repository()).find({ status: "published" })).filter(
    (item) => isLive(item),
  );
  const items = search(all, q, category, sort);
  const newest = search(all);
  const featured = newest.find((item) => item.featured) ?? newest[0];
  const account = await currentAccount();
  const voter = account ? hash(account._id) : undefined;
  return (
    <>
      <section className="overflow-hidden border-b border-line bg-paper">
        <div className="mx-auto w-[calc(100%-48px)] md:w-[90%] max-[590px]:w-[calc(100%-28px)] grid min-h-[calc(100svh-72px)] lg:grid-cols-[1.15fr_.85fr] items-center gap-10 py-14 lg:gap-[8vw] max-[590px]:min-h-[calc(100svh-62px)] max-[590px]:grid-cols-1 max-[590px]:content-center max-[590px]:gap-5 max-[590px]:py-8 [&>div:first-child]:motion-safe:animate-enter [&_h1]:my-5 [&_h1]:text-[clamp(3rem,7.5vw,8rem)] [&_h1]:leading-[.94] [&_h1]:tracking-[-.085em] [&_em]:text-subtle [&_em]:not-italic [&_p]:max-w-[500px] [&_p]:text-subtle">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-medium tracking-widest text-subtle">
              01 / INDEPENDENT SOFTWARE
            </div>
            <h1>
              Launch indie.
              <br /> <em>Get discovered.</em>
            </h1>
            <p>
              IndieRally helps indie developers and small teams launch through a reviewed directory listing, weekly launch rounds, and selected product spotlights.
            </p>
            <div className="mt-[25px] flex flex-wrap items-center gap-2.5">
              <Link
                href="/explore"
                className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-[#171717] bg-accent text-[#fff] hover:bg-[#383838]"
              >
                Explore launches <ArrowRight size={17} />
              </Link>
              <Link
                href="/submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-line bg-surface hover:bg-soft"
              >
                Launch your product <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          {featured && (
            <div className="motion-safe:animate-enter">
              <Link
                href={`/products/${featured.slug}`}
                className="group block overflow-hidden rounded-xl border border-line bg-surface p-6 motion-safe:transition-colors hover:border-muted md:p-9"
              >
                <span className="flex items-center gap-[7px] text-[10px] font-extrabold tracking-[.15em] text-subtle [&>span]:size-2 [&>span]:rounded-full [&>span]:bg-[#a6a6a6]">
                  <span /> FEATURED PRODUCT
                </span>
                <div className="mt-8 flex items-center gap-4">
                  <Icon item={featured} />
                  <div>
                    <strong className="block text-2xl tracking-tight">{featured.name}</strong>
                    <small className="text-muted">{featured.category}</small>
                  </div>
                  <ArrowUpRight className="ml-auto shrink-0 motion-safe:transition-transform motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:translate-x-1" size={20} />
                </div>
                <p className="mt-6 border-t border-line pt-4">{featured.tagline}</p>
              </Link>
            </div>
          )}
        </div>
      </section>
      <div
        className="mx-auto w-[calc(100%-48px)] md:w-[90%] max-[590px]:w-[calc(100%-28px)] scroll-mt-[82px] py-12 lg:py-20"
        id="directory"
      >
        <div className="flex items-center justify-between gap-[18px] max-[590px]:items-start [&_p]:mt-2 [&_p]:text-muted">
          <div>
            <p className="mb-3 font-mono text-xs tracking-widest uppercase">02 / Product directory</p><h2 className="text-[clamp(2rem,4vw,4rem)]">Explore products</h2>
            <p>Find a tool for whatever you’re working on.</p>
          </div>
          <span className="rounded-full bg-soft px-2.5 py-1 text-xs font-semibold text-subtle whitespace-nowrap">
            {items.length} {items.length === 1 ? "product" : "products"}
          </span>
        </div>
        <SearchBar query={q} category={category} sort={sort} />
        <div className="grid items-start gap-6 min-[801px]:grid-cols-[minmax(0,1fr)_minmax(220px,26%)] max-[800px]:[&>aside]:grid max-[800px]:[&>aside]:gap-3 min-[591px]:max-[800px]:[&>aside]:grid-cols-2">
          <section aria-label="Product results" className="grid gap-3 xl:grid-cols-2">
            {items.length ? (
              items.map((item) => (
                <Card key={item.slug} item={item} voter={voter} />
              ))
            ) : (
              <div className="rounded-md border border-line bg-surface p-[22px] [&_p]:mt-2 [&_p]:mb-3.5">
                <h3>No products found</h3>
                <p>Try a different search or category.</p>
                <Link
                  className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-line bg-surface hover:bg-soft"
                  href="/#directory"
                >
                  Clear filters
                </Link>
              </div>
            )}
          </section>
          <aside>
            <div className="rounded-md border border-line bg-surface p-[22px]">
              <h3>Categories</h3>
              <div className="mt-[9px] grid [&>a]:flex [&>a]:justify-between [&>a]:border-b [&>a]:border-line [&>a]:px-1.5 [&>a]:py-[9px] [&>a]:text-sm [&>a:last-child]:border-0 [&>a:hover]:bg-soft [&>a>span:last-child]:text-muted">
                {categories.map((name) => {
                  return (
                    <Link
                      className={category === name ? "bg-soft" : ""}
                      href={`/categories/${categorySlug(name)}`}
                      key={name}
                    >
                      <span>{name}</span>
                      <span>
                        {all.filter((item) => item.category === name).length}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="rounded-md bg-[#292929] p-[22px] text-white min-[801px]:mt-3.5 [&_p]:mt-2 [&_p]:mb-3.5 [&_p]:text-[#e5e5e5]">
              <span className="mb-3 grid size-[37px] place-items-center rounded-md bg-[#454545] text-white">
                <Layers3 size={20} />
              </span>
              <h3>Building something?</h3>
              <p>
                Get your product in front of people looking for their next
                favorite tool.
              </p>
              <SubmitLink />
            </div>
          </aside>
        </div>
      </div>
      <JsonLd
        value={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "IndieRally",
          url: siteOrigin(),
        }}
      />
    </>
  );
}




