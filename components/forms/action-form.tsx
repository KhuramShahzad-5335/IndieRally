"use client";

import { useActionState, type ReactNode } from "react";

export function ActionForm({ action, children, label, pendingLabel = "Saving…", className = "" }: { action: (previous: string, data: FormData) => Promise<string>; children: ReactNode; label: string; pendingLabel?: string; className?: string }) {
  const [error, dispatch, pending] = useActionState(action, "");
  return <form action={dispatch} className={"grid w-full justify-items-start gap-[15px] [&_label]:grid [&_label]:w-full [&_label]:gap-1.5 [&_label]:font-semibold [&_input:not([type=checkbox]):not([type=hidden])]:w-full [&_select]:w-full [&_textarea]:w-full " + className}>{children}
    {error && <p className="w-full rounded-lg bg-[#efefef] p-2.5 text-[#3e3e3e]" role="alert">{error}</p>}
    <button className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none border-[#171717] bg-accent text-[#fff] hover:bg-[#383838] disabled:cursor-wait disabled:opacity-60" disabled={pending}>{pending ? pendingLabel : label}</button>
  </form>;
}
