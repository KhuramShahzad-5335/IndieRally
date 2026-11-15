import { Search } from "lucide-react";
import { categories } from "@/lib/domain";

export function SearchBar({
  query,
  category,
  sort,
}: {
  query?: string;
  category?: string;
  sort?: string;
}) {
  return (
    <form
      action="/#directory"
      method="get"
      className="mt-[22px] mb-[18px] grid grid-cols-[minmax(180px,1fr)_auto_auto_auto] gap-[9px] max-[590px]:grid-cols-2 max-[590px]:[&>button]:col-span-2"
    >
      <label className="flex items-center gap-2.5 rounded-md border border-line bg-surface px-[13px] text-muted focus-within:outline-2 focus-within:outline-[#898989] max-[590px]:col-span-2 [&>input]:w-full [&>input]:min-w-0 [&>input]:bg-transparent [&>input]:py-2.5 [&>input]:text-ink [&>input]:focus:outline-none">
        <Search size={19} />
        <input
          name="q"
          type="search"
          placeholder="Search products, makers, and more..."
          defaultValue={query}
          maxLength={100}
          aria-label="Search products"
        />
      </label>
      <select
        name="category"
        defaultValue={category || ""}
        aria-label="Category"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <select
        name="sort"
        defaultValue={sort || "new"}
        aria-label="Sort products"
      >
        <option value="new">Newest</option>
        <option value="top">Top voted</option>
      </select>
      <button className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none bg-[#262626] text-white hover:bg-[#393939]">
        Search
      </button>
    </form>
  );
}
