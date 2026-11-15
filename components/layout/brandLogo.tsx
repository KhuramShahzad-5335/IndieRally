import Image from "next/image";
import Link from "next/link";

export function BrandLogo() {
  return <Link href="/" aria-label="IndieRally home"><Image src="/icon.svg" width={36} height={36} alt=""/></Link>;
}
