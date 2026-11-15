import { pageMetadata, siteOrigin } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, cover } from "@/lib/editorial";
import { JsonLd } from "@/components/seo/json-ld";
const headings: Record<string, string[]> = {
  "launch-checklist": [
    "Clarify your pitch",
    "Test the signup journey",
    "Learn from launch day",
  ],
  "choosing-directories": [
    "Start with your audience",
    "Track each submission",
    "Measure results",
  ],
  "write-a-listing": [
    "Lead with the outcome",
    "Show the workflow",
    "Give readers a next step",
  ],
};
const published = "2026-11-14";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article)
    return { title: "Article unavailable", robots: { index: false } };
  const description =
    article.paragraphs[0].split("\n\n")[0].split(". ")[0] + ".";
  return {
    ...pageMetadata(article.title, description, "/blog/" + slug),
    twitter: { card: "summary_large_image" as const, title: article.title, description, images: [cover(slug)] },
    openGraph: {
      type: "article" as const,
      title: article.title,
      description,
      images: [cover(slug)],
      url: "/blog/" + slug,
      siteName: "IndieRally",
      publishedTime: published,
      authors: ["IndieRally Editorial"],
    },
  };
}
export default async function Article({ params }: Props) {
  const { slug } = await params;
  const post = articles.find((item) => item.slug === slug);
  if (!post) notFound();
  const origin = siteOrigin();
  return (
    <article className="mx-auto w-[calc(100%-48px)] md:w-[90%] max-[590px]:w-[calc(100%-28px)] min-h-[65vh] pt-12 pb-16 [&_img]:mt-3.5 [&_img]:aspect-[800/460] [&_img]:h-auto [&_img]:w-full [&_img]:rounded-md [&_img]:object-cover grayscale">
      <Link
        className="mb-[22px] inline-flex items-center gap-2 text-subtle hover:underline"
        href="/blog"
      >
        Back to the blog
      </Link>
      <h1>{post.title}</h1>
      <p className="mt-3 text-sm text-muted">
        By IndieRally Editorial ·{" "}
        <time dateTime={published}>November 14, 2026</time> ·{" "}
        {Math.max(
          1,
          Math.ceil(post.paragraphs.join(" ").split(/\s+/).length / 200),
        )}{" "}
        min read
      </p>
      <Image
        src={cover(slug)}
        alt={post.alt}
        width={800}
        height={460}
        sizes="90vw"
        preload
      />
      <div className="mt-4 grid gap-[18px] min-[801px]:grid-cols-[235px_minmax(0,1fr)]">
        <aside className="rounded-md border border-line bg-surface p-[22px] [&_h2]:text-[1.4rem] [&_p]:mt-2 self-start min-[801px]:sticky min-[801px]:top-[90px] min-[801px]:col-start-1 min-[801px]:row-start-1 [&_nav]:grid [&_nav]:gap-2.5 [&_h2]:!text-[1.1rem]">
          <nav aria-label="In this article">
            <h2>In this article</h2>
            {headings[slug].map((heading, index) => (
              <a key={heading} href={"#section-" + index}>
                {heading}
              </a>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 max-w-[75ch] [&_h2]:text-2xl [&_p]:mt-4 leading-[1.75] min-[801px]:col-start-2 min-[801px]:row-start-1 [&_section]:scroll-mt-[100px] [&_section+section]:mt-6">
          {post.paragraphs.map((p, index) => (
            <section key={p} id={"section-" + index}>
              <h2>{headings[slug][index]}</h2>
              {p.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
      <JsonLd
        value={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          mainEntityOfPage: new URL("/blog/" + slug, origin).href,
          publisher: { "@type": "Organization", name: "IndieRally", url: origin },
          datePublished: published,
          image: new URL(cover(slug), origin).href,
          url: new URL("/blog/" + slug, origin).href,
          author: { "@type": "Organization", name: "IndieRally" },
        }}
      />
    </article>
  );
}
