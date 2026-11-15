export const blogCategories = ["Getting started", "Services", "Launch guides", "Illustrative case study"] as const;
export type BlogPost = {
  slug: string; title: string; description: string; author: string; category: string;
  image: string; imageAlt: string; body: string; status: "draft" | "published";
  createdAt: string; updatedAt: string; publishedAt?: string;
};
export function validBlogImage(value: string) {
  if (/^\/editorial\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/.test(value)) return true;
  try { const url = new URL(value); return url.protocol === "https:" && /^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/.test(url.hostname) && !url.username && !url.password && !url.port; } catch { return false; }
}
export function blogSections(body: string) {
  return body.split(/^## /m).filter(part => part.trim()).map((part, index) => {
    const newline = part.indexOf("\n");
    return { id: "section-" + index, title: (newline < 0 ? part : part.slice(0, newline)).trim(), text: newline < 0 ? "" : part.slice(newline + 1).trim() };
  });
}
export function readingMinutes(body: string) { return Math.max(1, Math.ceil(body.split(/\s+/).length / 200)); }
export function parseBlog(form: FormData) {
  const read = (key: string, min: number, max: number) => {
    const value = String(form.get(key) ?? "").trim();
    if (value.length < min || value.length > max) throw new Error(`${key} must contain ${min}–${max} characters.`);
    return value;
  };
  const slug = read("slug", 2, 100);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug === "new") throw new Error("Use a lowercase URL slug with words separated by hyphens.");
  const image = read("image", 1, 1000);
  if (!validBlogImage(image)) throw new Error("Use an editorial image path or a public Vercel Blob image URL.");
  const body = read("body", 100, 60000);
  if (!body.startsWith("## ") || blogSections(body).some(section => !section.title || section.title.length > 120 || !section.text)) throw new Error("Start each section with ## Heading, followed by its content.");
  for (const match of body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) {
    if (!match[1].trim() || !validBlogImage(match[2])) throw new Error("Every inline image needs alt text and a valid Blob or editorial image URL.");
  }
  const status = read("status", 1, 20);
  if (status !== "draft" && status !== "published") throw new Error("Choose draft or published.");
  const category = read("category", 1, 50);
  if (!(blogCategories as readonly string[]).includes(category)) throw new Error("Choose a valid category.");
  return { slug, title: read("title", 5, 120), description: read("description", 30, 180), author: read("author", 2, 80), category, image, imageAlt: read("imageAlt", 5, 200), body, status };
}
