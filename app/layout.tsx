import { siteOrigin, pageMetadata, siteDescription } from "@/lib/seo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { isAdmin } from "@/lib/auth";
import { UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { currentAccount } from "@/lib/accounts";
import { SubmitLink } from "@/components/products/submit-link";
import { MobileMenu } from "@/components/layout/mobile-menu";
import "@fontsource-variable/roboto";
import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { Brand } from "@/components/layout/brand";

// analytics relevant imports
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  ...pageMetadata("IndieRally — Discover independent software", siteDescription, "/"),
  alternates: undefined,
  metadataBase: new URL(siteOrigin()),
  title: {
    default: "IndieRally — Discover independent software",
    template: "%s | IndieRally",
  },
  description:
    "Launch your indie product through a reviewed software directory, weekly launch rounds, and selected spotlights.",

};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const moderator = await isAdmin();
  const account = moderator ? null : await currentAccount();
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html:"try{if(localStorage.getItem('indierally-theme')==='monochrome')document.documentElement.dataset.theme='monochrome'}catch{}"}}/></head>
      <body>
        <Analytics />
        <SpeedInsights />
        <a
          className="absolute -top-24 left-3 z-20 bg-surface p-2 focus:top-3"
          href="#main"
        >
          Skip to content
        </a>
        <header className="sticky top-0 z-10 border-b border-line bg-paper/76 backdrop-blur-[14px]">
          <div className="mx-auto w-[calc(100%-48px)] md:w-[90%] max-[590px]:w-[calc(100%-28px)] flex min-h-[72px] items-center justify-between gap-4 max-[590px]:min-h-[62px]">
            <Brand />
            <nav
              className="hidden items-center gap-5 text-sm min-[1100px]:flex"
              aria-label="Main"
            >
              <Link href="/explore">Explore</Link>
              <Link href="/directories">Services</Link>
              <Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/pricing">Pricing</Link><Link href="/contact">Contact</Link>
            </nav>
            <div className="flex min-w-0 items-center gap-2">
              <div className="hidden items-center gap-2 min-[1100px]:flex">
                {moderator ? null : account ? (
                  <>
                    <SubmitLink />
                    <Link
                      className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-line bg-surface hover:bg-soft w-11 !px-0"
                      href="/profile"
                      aria-label="Profile"
                      title="Profile"
                    >
                      <UserRound size={19} aria-hidden />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-line bg-surface hover:bg-soft"
                      href="/login"
                    >
                      Sign in
                    </Link>
                    <Link
                      className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-[#171717] bg-accent text-[#fff] hover:bg-[#383838]"
                      href="/signup"
                    >
                      Create account
                    </Link>
                  </>
                )}
              </div>
              
              <ThemeToggle />
              <MobileMenu
                moderator={moderator}
                name={
                  account
                    ? account.name || account.email.split("@")[0]
                    : undefined
                }
              />
            </div>
          </div>
        </header>
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}







