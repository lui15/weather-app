import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

/** Toggle oscuro/claro auto-contenido */
function ThemeToggleInline() {
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;
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
      className="px-3 py-1 text-sm rounded-full border border-zinc-700/50 bg-white/5 hover:bg-white/10 transition"
    >
      Cambiar tema
    </button>
  );
}

/** Íconos geométricos simples */
const Square = () => <div className="w-14 h-14 rounded-md bg-zinc-700/60" />;
const Circle = () => <div className="w-14 h-14 rounded-full bg-zinc-700/60" />;
const Triangle = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" className="text-zinc-700/60">
    <polygon points="28,6 52,50 4,50" fill="currentColor" />
  </svg>
);

/** Una fila de sección con chevron y año a la derecha */
function SectionRow({ label, year }: { label: string; year: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-zinc-800/70">
      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
        <span className="text-sm text-zinc-200">{label}</span>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-xs text-zinc-500">{year}</span>
        <svg
          className="w-4 h-4 text-zinc-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* NAV */}
      <header className="sticky top-0 z-10 border-b border-zinc-900/80 bg-zinc-950/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">NewsBoard</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-zinc-800">
              βeta
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <Link to="/search" className="hover:text-zinc-200">
              Buscar
            </Link>
            <Link to="/theme" className="hover:text-zinc-200">
              Tema
            </Link>
            <Link to="/profile" className="hover:text-zinc-200">
              Perfil
            </Link>
          </nav>
          <ThemeToggleInline />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* HERO */}
        <section className="py-20 md:py-28 text-center">
          {/* mini logo con 3 formas */}
          <div className="mx-auto mb-6 flex items-center justify-center gap-2 text-zinc-600">
            <span className="inline-block w-3 h-3 rounded bg-zinc-700" />
            <span className="inline-block w-3 h-3 rounded-full bg-zinc-700" />
            <span
              className="inline-block"
              style={{
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "10px solid #3f3f46",
              }}
            />
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Noticias frescas.
          </h1>
          <p className="mt-3 text-xl md:text-2xl text-zinc-400">
            Información al instante.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              to="/"
              className="px-5 py-2 rounded-full bg-zinc-100 text-zinc-900 hover:bg-white transition text-sm"
            >
              Explorar noticias
            </Link>
            <Link
              to="/favorites"
              className="px-5 py-2 rounded-full bg-white/5 text-zinc-100 border border-zinc-800 hover:bg-white/10 transition text-sm"
            >
              Favoritos
            </Link>
          </div>
        </section>

        {/* FEATURE CARDS */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <Square />
            <h3 className="mt-5 font-semibold">Filtros rápidos.</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Encuentra noticias por palabra clave, rango de fechas o secciones.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <Circle />
            <h3 className="mt-5 font-semibold">Vista adaptable.</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Interfaz flexible con temas claro y oscuro, accesible y
              responsive.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <Triangle />
            <h3 className="mt-5 font-semibold">Favoritos al instante.</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Guarda artículos y accede a tu colección personal de noticias.
            </p>
          </div>
        </section>

        {/* SECTION LIST */}
        <section className="mt-14 mb-24">
          <div className="space-y-1">
            <SectionRow label="Tecnología" year="2025" />
            <SectionRow label="Deportes" year="2025" />
            <SectionRow label="Política" year="2025" />
            <SectionRow label="Ciencia" year="2025" />
            <SectionRow label="Mundo" year="2025" />
            <SectionRow label="Favoritos" year="2025" />
          </div>
        </section>
      </main>
    </div>
  );
}
