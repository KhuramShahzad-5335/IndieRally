import type { ReactNode } from "react";

export function FormSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <fieldset className="grid w-full min-w-0 gap-4 border-t border-line pt-4">
    <legend className="pr-3 text-base font-semibold"><span className="mr-2 font-mono text-xs text-muted">{number} /</span>{title}</legend>
    {children}
  </fieldset>;
}
