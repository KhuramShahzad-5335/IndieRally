import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  // Let crawlers see the noindex metadata on private and authentication routes.
  return { rules: { userAgent: "*", allow: "/" }, sitemap: new URL("/sitemap.xml", siteOrigin()).href };
}
