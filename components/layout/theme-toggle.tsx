"use client";

import { useSyncExternalStore } from "react";
import { Contrast, Sun } from "lucide-react";

const event = "indierally-theme-change";
const subscribe = (update: () => void) => {
  window.addEventListener(event, update);
  return () => window.removeEventListener(event, update);
};
const getTheme = () => document.documentElement.dataset.theme === "monochrome";
const getServerTheme = () => false;

export function ThemeToggle() {
  const monochrome = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  function toggle() {
    const theme = monochrome ? "light" : "monochrome";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("indierally-theme", theme);
    } catch {}
    window.dispatchEvent(new Event(event));
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Monochrome theme"
      aria-pressed={monochrome}
      className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm font-medium hover:bg-soft"
      title={monochrome ? "Switch to Light" : "Switch to Monochrome"}
    >
      {monochrome ? (
        <Contrast size={17} aria-hidden />
      ) : (
        <Sun size={17} aria-hidden />
      )}
      {/* <span className="hidden sm:inline">
        {monochrome ? "Monochrome" : "Light"}
      </span> */}
    </button>
  );
}
