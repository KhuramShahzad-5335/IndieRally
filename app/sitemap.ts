import { categorySlug } from "@/lib/categories";
import { categories } from "@/lib/domain";
import type { MetadataRoute } from "next";
import { articles } from "@/lib/editorial";
import { isLive } from "@/lib/rounds";
import { repository } from "@/lib/store";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = new URL(process.env.SITE_URL || "http://localhost:3000");
  const products = await (await repository()).find({ status: "published" });
  return ["/", "/about", "/privacy", "/terms", "/cookies", "/refunds", "/contact", "/blog", "/explore", "/pricing", "/directories", ...categories.map(category => "/categories/" + categorySlug(category)), ...articles.map(post=>"/blog/"+post.slug)].map(path => ({ url: new URL(path, base).href })).concat(products.filter(item=>isLive(item)).map(item => ({ url: new URL("/products/" + item.slug, base).href, lastModified: item.publishedAt })));
}



