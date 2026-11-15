import type { Metadata } from "next";

export const siteName = "IndieRally";
export const siteDescription = "Discover independent software, explore weekly product launches, and give your next indie project a place to grow.";

export function siteOrigin(environment: { SITE_URL?: string; NODE_ENV?: string } = process.env) {
  const url = new URL(environment.SITE_URL || (environment.NODE_ENV === "production" ? "https://indierally.vercel.app" : "http://localhost:3000"));
  return url.origin;
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName, title, description, url: path, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "IndieRally — Launch indie. Get discovered." }] },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  };
}
