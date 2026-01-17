import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);

const tiers = [
  { name: 'Starter', id: 'tier-starter', priceValue: 20, priceMonthly: '20€', description: "Parfait pour les petites équipes qui débutent.", features: ['5 Go de stockage cloud', 'Jusqu\'à 3 utilisateurs', 'Synchronisation temps réel', 'Support par email', 'Historique 30 jours'], featured: false },
  { name: 'Pro', id: 'tier-pro', priceValue: 50, priceMonthly: '50€', description: 'Pour les équipes qui veulent aller plus loin.', features: ['100 Go de stockage cloud', 'Utilisateurs illimités', 'Synchronisation temps réel', 'Support prioritaire 24/7', 'Historique illimité', 'API avancée', 'Intégrations personnalisées', 'Rapports analytiques'], featured: true },
  { name: 'Enterprise', id: 'tier-enterprise', priceValue: 100, priceMonthly: '100€', description: 'Solution complète pour les grandes organisations.', features: ['Stockage illimité', 'Utilisateurs illimités', 'Synchronisation multi-régions', 'Support dédié 24/7', 'Historique illimité', 'API personnalisée', 'Intégrations sur mesure', 'SLA garantis', 'Formation équipe', 'Conformité RGPD+'], featured: false },
];

function classNames(...classes: (string | boolean | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default async function Home() {

  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  let user = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      const dbUser = await db.user.findUnique({
        where: { id: Number(payload.userId) },
        select: { firstName: true, lastName: true, email: true }
      });

      if (dbUser) {
        user = dbUser;
      }
    } catch (error) {
      console.error("Erreur de vérification JWT", error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 font-sans scroll-smooth">
      {/* Navigation (Header) */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CloudSync
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Bonjour, <span className="text-blue-600 dark:text-blue-400">{user.firstName} {user.lastName}</span>
              </span>
              <Link href="/api/logout" className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors">Déconnexion</Link>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white py-2 px-4 transition-colors">Se connecter</Link>
              <Link href="/signup" className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105">S'inscrire</Link>
            </>
          )}
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-89px)] px-6 text-center overflow-hidden">
          {/* L'ajout de min-h-[calc(100vh-89px)] assure que la section prend toute la hauteur restante sous le menu */}

          <h1 className="text-6xl font-black tracking-tight text-black dark:text-white sm:text-7xl lg:text-8xl max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Synchronisez vos données
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">en temps réel</span>
          </h1>

          <p className="mt-8 max-w-2xl text-xl text-zinc-600 dark:text-zinc-400">
            CloudSync transforme la façon dont votre équipe collabore avec une synchronisation instantanée.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href={user ? "/dashboard" : "/signup"}
              className="group relative rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-4 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105"
            >
              {user ? "Accéder au Dashboard" : "Commencer gratuitement"}
            </Link>
          </div>

          {/* Optionnel : Un petit indicateur de scroll en bas pour inviter à descendre */}
          <div className="absolute bottom-10 animate-bounce">
            <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Pricing Section - RÉAPPARAÎT ICI */}
        <section id="pricing" className="relative isolate py-24 px-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-4">TARIFS</h2>
            <p className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">Choisissez votre plan</p>
          </div>

          <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={classNames(
                  tier.featured
                    ? 'relative bg-white dark:bg-zinc-900 ring-2 ring-blue-600 scale-105'
                    : 'bg-white dark:bg-zinc-900/50 ring-1 ring-zinc-200 dark:ring-zinc-800',
                  'rounded-3xl p-8 hover:shadow-2xl transition-all flex flex-col'
                )}
              >
                <h3 className="text-2xl font-bold text-black dark:text-white">{tier.name}</h3>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-5xl font-black text-black dark:text-white">{tier.priceMonthly}</span>
                  <span className="text-base text-zinc-500">/mois</span>
                </p>
                <ul className="mt-8 space-y-3 text-sm flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3 text-zinc-700 dark:text-zinc-300">
                      <CheckIcon className="h-6 w-5 flex-none text-blue-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={user ? `/payments?price=${tier.priceValue}` : "/signup"}
                  className={classNames(
                    tier.featured ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white',
                    'mt-8 block rounded-2xl px-4 py-3 text-center text-sm font-semibold hover:scale-105 transition-transform'
                  )}
                >
                  {user ? "Acheter maintenant" : "S'inscrire pour acheter"}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500">
        © 2026 CloudSync. Tous droits réservés.
      </footer>
    </div>
  );
}