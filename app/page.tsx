import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950 font-sans scroll-smooth">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Logo"
            width={100}
            height={20}
          />
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white mt-2"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            S'inscrire
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        <section className="flex flex-col items-center justify-center h-[calc(100vh-73px)] px-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-black dark:text-white sm:text-7xl">
            Propulsez votre projet <br />
            <span className="text-zinc-500">avec notre plateforme</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Une solution complète pour gérer vos données avec Prisma et vos paiements avec Stripe.
            Simple, rapide et sécurisé.
          </p>
          <div className="mt-12 flex flex-col items-center gap-4">
            <a
              href="#pricing"
              className="rounded-full bg-black px-10 py-4 text-white dark:bg-white dark:text-black font-semibold text-lg hover:scale-105 transition-transform"
            >
              Voir les abonnements
            </a>
            <p className="text-sm text-zinc-400 animate-bounce mt-4">
              Scrollez pour découvrir ↓
            </p>
          </div>
        </section>
        <section
          id="pricing"
          className="bg-zinc-50 dark:bg-zinc-900/50 flex min-h-screen items-center justify-center py-24 px-6 border-t border-zinc-100 dark:border-zinc-800"
        >
          <div className="w-full max-w-md mx-auto">
            <div className="flex flex-col p-8 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white rounded-3xl shadow-2xl relative transition-all hover:shadow-black/5 dark:hover:shadow-white/5">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-6 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                RECOMMANDÉ
              </span>

              <h3 className="text-2xl font-bold dark:text-white text-center">Plan Mensuel</h3>
              <div className="mt-6 text-center">
                <span className="text-5xl font-black dark:text-white">19€</span>
                <span className="text-zinc-500 ml-2">/ mois</span>
              </div>

              <div className="my-8 border-t border-zinc-100 dark:border-zinc-800" />

              <ul className="space-y-5 text-zinc-600 dark:text-zinc-400 flex-1">
                <li className="flex items-center gap-3 font-medium text-black dark:text-white">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black dark:bg-white text-[10px] text-white dark:text-black">✓</div>
                  Accès illimité aux fonctions
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 text-[10px]">✓</div>
                  Support par email 24/7
                </li>
                <li className="flex items-center gap-3 text-zinc-400">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 text-[10px]">✓</div>
                  Accès aux outils Beta
                </li>
              </ul>

              <button className="mt-10 w-full rounded-2xl bg-black py-4 font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all active:scale-95 shadow-lg">
                Commencer l'essai gratuit
              </button>

              <p className="text-center text-xs text-zinc-400 mt-4">
                Sans engagement. Annulable à tout moment.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-zinc-100 dark:border-zinc-800 text-center text-sm text-zinc-500">
        © 2026 Ton Projet. Propulsé par Next.js, Prisma & Stripe.
      </footer>
    </div>
  );
}