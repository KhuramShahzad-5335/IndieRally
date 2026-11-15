"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  Compass,
  Layers3,
  Tag,
  BookOpen,
  Info,
  Mail,
  UserRound,
  Plus,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useRef } from "react";
import { signOut } from "@/app/account-actions";

export function MobileMenu({
  name,
  moderator,
}: {
  name?: string;
  moderator: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();

  return (
    <div className="min-[1100px]:hidden">
      <button
        type="button"
        className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-line bg-surface hover:bg-soft"
        aria-label="Open navigation"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        <Menu size={21} />
      </button>
      <dialog
        ref={dialog}
        className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-[min(340px,90vw)] max-w-none border-l border-line bg-paper text-ink shadow-sm backdrop:bg-black/55 motion-safe:open:animate-drawer"
        aria-labelledby="mobile-menu-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="flex flex-col h-full justify-between items-start w-full px-6 py-4">
          <div className="flex items-center justify-between gap-[18px] max-[590px]:items-start [&_p]:mt-2 [&_p]:text-muted w-full">
            <Link
              id="mobile-menu-title"
              className="grid size-11 place-items-center rounded-md bg-[#262626] text-white"
              href="/"
              aria-label="IndieRally home"
              onClick={close}
            >
              <Image src="/icon.svg" width={36} height={36} alt="" />
            </Link>
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-line bg-surface hover:bg-soft"
              aria-label="Close navigation"
              onClick={close}
            >
              <X size={20} />
            </button>
          </div>
          <nav aria-label="Mobile navigation" className="w-full gap-6 flex flex-col gap-4">
            <Link href="/explore" onClick={close} className="flex items-center justify-start gap-2 text-md font-semibold border-b border-gray-300 pb-2 gap-4 hover:bg-soft">
              <Compass size={17} aria-hidden /> Explore
            </Link>
            <Link href="/directories" onClick={close} className="flex items-center justify-start gap-2 text-md font-semibold border-b border-gray-300 pb-2 gap-4 hover:bg-soft">
              <Layers3 size={17} aria-hidden /> Services
            </Link>
            <Link href="/pricing" onClick={close} className="flex items-center justify-start gap-2 text-md font-semibold border-b border-gray-300 pb-2 gap-4 hover:bg-soft">
              <Tag size={17} aria-hidden /> Pricing
            </Link>
            <Link href="/blog" onClick={close} className="flex items-center justify-start gap-2 text-md font-semibold border-b border-gray-300 pb-2 gap-4 hover:bg-soft">
              <BookOpen size={17} aria-hidden /> Blog
            </Link>
            <Link href="/about" onClick={close} className="flex items-center justify-start gap-2 text-md font-semibold border-b border-gray-300 pb-2 gap-4 hover:bg-soft">
              <Info size={17} aria-hidden /> About
            </Link>
            <Link href="/contact" onClick={close} className="flex items-center justify-start gap-2 text-md font-semibold border-b border-gray-300 pb-2 gap-4 hover:bg-soft">
              <Mail size={17} aria-hidden /> Contact
            </Link>
            <Link href="/privacy" onClick={close} className="flex items-center justify-start gap-2 text-md font-semibold border-b border-gray-300 pb-2 gap-4 hover:bg-soft">
              <Info size={17} aria-hidden /> Privacy
            </Link>
          </nav>
          <div className="sticky -bottom-5 row-start-4 grid gap-2 bg-paper pb-[max(12px,env(safe-area-inset-bottom))] w-full">
            {moderator ? null : name ? (
              <>
                <Link
                  className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-line bg-surface hover:bg-soft"
                  href="/profile"
                  onClick={close}
                >
                  <UserRound size={17} aria-hidden /> Profile
                </Link>
                <Link
                  className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-[#171717] bg-accent text-[#fff] hover:bg-[#383838]"
                  href="/submit"
                  onClick={close}
                >
                  <Plus size={17} aria-hidden /> Submit a product
                </Link>
                <form action={signOut} onSubmit={close}>
                  <button className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-line bg-surface hover:bg-soft w-full">
                    <LogOut size={17} aria-hidden /> Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-line bg-surface hover:bg-soft"
                  href="/login"
                  onClick={close}
                >
                  <LogIn size={17} aria-hidden /> Sign in
                </Link>
                <Link
                  className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-[#171717] bg-accent text-[#fff] hover:bg-[#383838]"
                  href="/signup"
                  onClick={close}
                >
                  <UserPlus size={17} aria-hidden /> Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}
