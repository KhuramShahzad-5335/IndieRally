export const categories = ["Developer Tools", "Productivity", "Design", "AI Tools", "Marketing", "Analytics"] as const;
export const plans = ["Free", "Freemium", "Paid"] as const;
export type Input = { name: string; tagline: string; description: string; website: string; category: typeof categories[number]; pricing: typeof plans[number]; maker: string };
export type Decision = "published" | "changes" | "rejected";
export type Listing = Input & {
  slug: string; status: "pending" | Decision; submittedAt: string; publishedAt?: string;
  trackingHash?: string; ownerId?: string; baseVotes: number; voters: string[]; featured?: boolean; theme?: number;
  history: { status: "pending" | Decision; at: string; note?: string }[];
};
export function parseInput(form: FormData): Input {
  const field = (key: string, min: number, max: number) => {
    const value = form.get(key);
    const clean = typeof value === "string" ? value.trim() : "";
    if (clean.length < min || clean.length > max) throw new Error(`${key[0].toUpperCase() + key.slice(1)} must be ${min}–${max} characters.`);
    return clean;
  };
  const website = field("website", 10, 500);
  let url: URL;
  try { url = new URL(website); } catch { throw new Error("Enter a valid HTTPS website URL."); }
  if (url.protocol !== "https:" || !url.hostname.includes(".") || url.username || url.password) throw new Error("Enter a valid HTTPS website URL.");
  url.hash = "";
  const category = field("category", 1, 30) as Input["category"];
  const pricing = field("pricing", 1, 12) as Input["pricing"];
  if (!categories.includes(category) || !plans.includes(pricing)) throw new Error("Choose a valid category and pricing model.");
  return { name: field("name", 2, 50), tagline: field("tagline", 8, 100), description: field("description", 30, 3000), website: url.href, category, pricing, maker: field("maker", 2, 60) };
}
export const slugify = (name: string) => name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "product";
export const votes = (listing: Listing) => listing.baseVotes + listing.voters.length;
export function search(items: Listing[], query = "", category = "", sort = "") {
  const terms = query.trim().toLowerCase().split(/\s+/);
  return items.filter(item => item.status === "published" && (!category || item.category === category) &&
    terms.every(term => [item.name, item.tagline, item.description, item.category, item.maker].join(" ").toLowerCase().includes(term)))
    .sort((a, b) => (sort === "top" ? votes(b) - votes(a) : 0) || (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") || a.slug.localeCompare(b.slug));
}
