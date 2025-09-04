import { useEffect, useState } from "react";

export default function ToggleTheme() {
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((v) => !v)}
      className="text-sm px-3 py-1 rounded-full border border-zinc-300 dark:border-zinc-700"
      aria-pressed={dark}
      title="Cambiar tema"
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
