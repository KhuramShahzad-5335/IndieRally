import { siteOrigin } from "@/lib/seo";
import { categorySlug } from "@/lib/categories";
import { categories } from "@/lib/domain";
import type { MetadataRoute } from "next";
import { publishedBlogPosts } from "@/lib/blog";
import { isLive } from "@/lib/rounds";
import { repository } from "@/lib/store";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = new URL(siteOrigin());
  const articles = await publishedBlogPosts();
  const products = await (await repository()).find({ status: "published" });
  return ["/", "/about", "/privacy", "/terms", "/cookies", "/refunds", "/contact", "/blog", "/explore", "/pricing", "/directories", ...categories.map(category => "/categories/" + categorySlug(category))].map(path => ({ url: new URL(path, base).href })).concat(articles.map(post => ({ url: new URL("/blog/" + post.slug, base).href, lastModified: post.updatedAt }))).concat(products.filter(item=>isLive(item)).map(item => ({ url: new URL("/products/" + item.slug, base).href, lastModified: item.history.at(-1)?.at || item.publishedAt })));
}



