"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordField({
  name = "password",
  label = "Password",
  autoComplete = "current-password",
  hint,
}: {
  name?: string;
  label?: string;
  autoComplete?: "current-password" | "new-password";
  hint?: string;
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div className="grid w-full gap-2">
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required
          minLength={12}
          maxLength={128}
          autoComplete={autoComplete}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="min-h-12 w-full pr-14"
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
          aria-controls={id}
          aria-pressed={visible}
          className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:bg-soft hover:text-ink motion-reduce:transition-none"
        >
          {visible ? (
            <EyeOff size={19} aria-hidden="true" />
          ) : (
            <Eye size={19} aria-hidden="true" />
          )}
        </button>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="text-xs leading-5 text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
