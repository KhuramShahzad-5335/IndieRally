import Image from "next/image";
import Link from "next/link";

export function Brand() {
  return <Link href="/" className="inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap text-xl font-bold tracking-tight">
    <Image src="/icon.svg" width={36} height={36} alt=""/>IndieRally
  </Link>;
}
