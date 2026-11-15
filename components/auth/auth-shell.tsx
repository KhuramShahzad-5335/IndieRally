import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
  wide = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  wide?: boolean;
}) {
  return (
    <section className="flex min-h-[calc(100svh-62px)] items-center justify-center px-4 py-12 md:min-h-[calc(100svh-72px)] md:py-16">
      <div className={`w-full motion-safe:animate-enter ${wide ? "max-w-3xl" : "max-w-md"}`}>
        <header className="mb-8 text-center">
          <span
            className="mx-auto mb-6 flex size-12 items-center justify-center rounded-2xl border border-line bg-surface"
            aria-hidden="true"
          >
            <ArrowUpRight size={24} />
          </span>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[.2em] text-muted">
            {eyebrow}
          </p>
          <h1 className="text-3xl leading-tight sm:text-4xl">{title}</h1>
          <p className={`mx-auto mt-4 text-sm leading-7 text-muted ${wide ? "max-w-xl sm:text-base" : "max-w-sm"}`}>
            {description}
          </p>
        </header>
        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-8">
          {children}
        </div>
        <div className="mt-6 text-center text-sm leading-6 text-muted">
          {footer}
        </div>
      </div>
    </section>
  );
}
