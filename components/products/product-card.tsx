import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Listing } from "@/lib/domain";
import { Icon } from "./product-icon";
import { Vote } from "./product-vote";

export function Card({
  item,
  voter,
  fullCard = false,
}: {
  item: Listing;
  voter?: string;
  fullCard?: boolean;
}) {
  return (
    <article
      className={
        fullCard
          ? "flex items-center gap-[15px] rounded-md border border-line bg-surface p-4 hover:border-[#b4b4b4] max-[590px]:gap-[9px] max-[590px]:p-[11px] [&_p]:mt-[3px] [&_p]:mb-2 [&_p]:wrap-anywhere [&_p]:text-subtle relative h-full"
          : "flex items-center gap-[15px] rounded-md border border-line bg-surface p-4 hover:border-[#b4b4b4] max-[590px]:gap-[9px] max-[590px]:p-[11px] [&_p]:mt-[3px] [&_p]:mb-2 [&_p]:wrap-anywhere [&_p]:text-subtle"
      }
    >
      <Icon item={item} />
      <div className="min-w-0 flex-1">
        <Link
          className={
            "inline-flex items-center gap-[7px] text-[17px] font-extrabold wrap-anywhere hover:underline [&_svg]:shrink-0 [&_svg]:text-subtle " +
            (fullCard
              ? "after:absolute after:inset-0 after:rounded-md focus-visible:after:outline-3 focus-visible:after:outline-[#717171]"
              : "")
          }
          href={`/products/${item.slug}`}
        >
          {item.name} <ArrowUpRight size={14} />
        </Link>
        <p>{item.tagline}</p>
        <div className="flex flex-wrap gap-1.5 [&>span]:rounded-full [&>span]:bg-soft [&>span]:px-2 [&>span]:py-[3px] [&>span]:text-[11px] [&>span]:font-semibold [&>span]:text-subtle">
          <span>{item.category}</span>
          <span>{item.pricing}</span>
        </div>
      </div>
      <Vote item={item} voter={voter} />
    </article>
  );
}
