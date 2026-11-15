import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card } from "@/components/products/product-card";
import { currentAccount } from "@/lib/accounts";
import { hash } from "@/lib/auth";
import { categorySlug } from "@/lib/categories";
import { categories, search } from "@/lib/domain";
import { isLive } from "@/lib/rounds";
import { repository } from "@/lib/store";

type Props = { params: Promise<{ slug: string }> };
const getCategory = (slug: string) => categories.find(category => categorySlug(category) === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Category unavailable", robots: { index: false } };
  return { title: category, description: "Discover independent software in " + category + ".", alternates: { canonical: "/categories/" + slug } };
}

export default async function CategoryPage({ params }: Props) {
  const category = getCategory((await params).slug);
  if (!category) notFound();
  const [account, listings] = await Promise.all([currentAccount(), (await repository()).find({ status: "published" })]);
  const items = search(listings.filter(item => isLive(item)), "", category);
  return <div className="mx-auto min-h-[65vh] w-[calc(100%-32px)] py-12 md:w-[90%]">
    <Link className="font-mono text-xs uppercase tracking-widest text-muted hover:underline" href="/#directory">← Directory</Link>
    <h1 className="mt-5">{category}</h1>
    <p className="mt-3 text-muted">{items.length} {items.length === 1 ? "product" : "products"}</p>
    <div className="mt-8 grid gap-4 border-t border-line pt-6 md:grid-cols-2 xl:grid-cols-3">
      {items.length ? items.map(item => <Card key={item.slug} fullCard item={item} voter={account ? hash(account._id) : undefined}/>) : <p className="text-muted">No products in this category yet.</p>}
    </div>
  </div>;
}
