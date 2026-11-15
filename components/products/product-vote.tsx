import { ChevronUp } from "lucide-react";
import { votes, type Listing } from "@/lib/domain";
import { canVote } from "@/lib/rounds";
import { upvote } from "@/app/actions";

export function Vote({ item, voter }: { item: Listing; voter?: string }) {
  if (!canVote(item))
    return (
      <span
        className="grid min-w-[47px] place-items-center gap-px rounded-md border border-line bg-soft px-1.5 py-[5px] text-xs font-bold hover:bg-[#f0f0f0] hover:text-[#484848] disabled:bg-[#f0f0f0] disabled:text-[#484848]"
        aria-label={votes(item) + " final votes"}
      >
        <ChevronUp size={17} />
        {votes(item)}
      </span>
    );
  const voted = !!voter && item.voters.includes(voter);
  return (
    <form className="relative z-10" action={upvote.bind(null, item.slug)}>
      <button
        className="grid min-w-[47px] place-items-center gap-px rounded-md border border-line bg-soft px-1.5 py-[5px] text-xs font-bold hover:bg-[#f0f0f0] hover:text-[#484848] disabled:bg-[#f0f0f0] disabled:text-[#484848]"
        type="submit"
        disabled={voted}
        aria-label={voted ? `Upvoted ${item.name}` : `Upvote ${item.name}`}
      >
        <ChevronUp size={17} />
        {votes(item)}
      </button>
    </form>
  );
}
