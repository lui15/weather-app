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
      aria-pressed={dark}
      onClick={() => setDark((v) => !v)}
      className="px-3 py-1 text-sm rounded-full border
                 bg-white text-zinc-900 border-zinc-300 hover:bg-zinc-100
                 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800
                 transition"
    >
      Cambiar tema
    </button>
  );
}
