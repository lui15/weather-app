import { Link } from "react-router-dom";
import ToggleTheme from "../components/ToggleTheme";
import HeroMadrid from "../components/HeroMadrid";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-zinc-100">
      <header
        className="border-b border-zinc-200/60 bg-white/80 backdrop-blur
                         dark:border-zinc-800/60 dark:bg-black/70"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo → Landing */}
          <Link to="/" className="font-semibold">
            Weather-App
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <Link
              to="/feed"
              className="hover:text-zinc-900 dark:hover:text-zinc-200"
            >
              Buscar
            </Link>
            <Link
              to="/favorites"
              className="hover:text-zinc-900 dark:hover:text-zinc-200"
            >
              Favorito
            </Link>
          </nav>
          <ToggleTheme /> {/* ← ÚNICO botón */}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        <section className="py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            El clima, al instante.
            <br />
            Consulta el pronóstico mundial.
          </h1>

          {/* Botón que navega a /feed e invierte colores */}
          <div className="mt-6">
            <Link
              to="/feed"
              className="inline-block px-5 py-2 rounded-full
                         bg-black text-white hover:opacity-90
                         dark:bg-white dark:text-black"
            >
              Buscar clima
            </Link>
          </div>
        </section>

        {/* Clima actual de Madrid */}
        <section className="flex items-center justify-center pb-24">
          <HeroMadrid />
        </section>
      </main>
    </div>
  );
}
