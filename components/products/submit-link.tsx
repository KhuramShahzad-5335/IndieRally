import Link from "next/link";
import { Plus } from "lucide-react";

export function SubmitLink() {
  return (
    <Link
      href="/submit"
      className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-[#171717] bg-accent text-[#fff] hover:bg-[#383838]"
    >
      <Plus size={17} /> Submit a product
    </Link>
  );
}
