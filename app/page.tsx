import Image from "next/image";
import Link from "next/link";

// Icône CheckIcon inline
const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    aria-hidden="true"
  >
    <path 
      fillRule="evenodd" 
      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" 
      clipRule="evenodd" 
    />
  </svg>
);

const tiers = [
  {
    name: 'Starter',
    id: 'tier-starter',
    href: '/signup?plan=starter',
    priceMonthly: '20€',
    description: "Parfait pour les petites équipes qui débutent.",
    features: [
      '5 Go de stockage cloud',
      'Jusqu\'à 3 utilisateurs',
      'Synchronisation temps réel',
      'Support par email',
      'Historique 30 jours'
    ],
    featured: false,
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    href: '/signup?plan=pro',
    priceMonthly: '50€',
    description: 'Pour les équipes qui veulent aller plus loin.',
    features: [
      '100 Go de stockage cloud',
      'Utilisateurs illimités',
      'Synchronisation temps réel',
      'Support prioritaire 24/7',
      'Historique illimité',
      'API avancée',
      'Intégrations personnalisées',
      'Rapports analytiques'
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '/contact',
    priceMonthly: '100€',
    description: 'Solution complète pour les grandes organisations.',
    features: [
      'Stockage illimité',
      'Utilisateurs illimités',
      'Synchronisation multi-régions',
      'Support dédié 24/7',
      'Historique illimité',
      'API personnalisée',
      'Intégrations sur mesure',
      'SLA garantis',
      'Formation équipe',
      'Conformité RGPD+'
    ],
    featured: false,
  },
];

function classNames(...classes: (string | boolean | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 font-sans scroll-smooth">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CloudSync
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <a href="#features" className="hover:text-black dark:hover:text-white transition-colors">
            Fonctionnalités
          </a>
          <a href="#pricing" className="hover:text-black dark:hover:text-white transition-colors">
            Tarifs
          </a>
          <a href="#faq" className="hover:text-black dark:hover:text-white transition-colors">
            FAQ
          </a>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white py-2 px-4 transition-colors"
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105"
          >
            S'inscrire
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-6 text-center overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              +10 000 équipes nous font confiance
            </span>
          </div>

          <h1 className="text-6xl font-black tracking-tight text-black dark:text-white sm:text-7xl lg:text-8xl max-w-5xl">
            Synchronisez vos données
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              en temps réel
            </span>
          </h1>
          
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
            CloudSync transforme la façon dont votre équipe collabore. Stockage cloud sécurisé, 
            synchronisation instantanée et outils de productivité tout-en-un.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/signup"
              className="group relative rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-4 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105"
            >
              Commencer gratuitement
              <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <a
              href="#features"
              className="rounded-full border-2 border-zinc-300 dark:border-zinc-700 px-10 py-4 font-semibold text-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-all hover:scale-105"
            >
              En savoir plus
            </a>
          </div>

          <div className="mt-20 flex gap-12 text-center">
            <div>
              <div className="text-4xl font-bold text-black dark:text-white">99.9%</div>
              <div className="text-sm text-zinc-500 mt-1">Uptime garanti</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-black dark:text-white">50ms</div>
              <div className="text-sm text-zinc-500 mt-1">Latence moyenne</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-black dark:text-white">256-bit</div>
              <div className="text-sm text-zinc-500 mt-1">Chiffrement</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6 bg-white dark:bg-zinc-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold text-black dark:text-white">
                Tout ce dont vous avez besoin
              </h2>
              <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Des fonctionnalités puissantes pour booster la productivité de votre équipe
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-100 dark:border-blue-900 hover:shadow-2xl transition-all hover:scale-105">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">Synchronisation ultra-rapide</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Vos fichiers se synchronisent en temps réel sur tous vos appareils. 
                  Travaillez partout, à tout moment.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-8 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-100 dark:border-green-900 hover:shadow-2xl transition-all hover:scale-105">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">Sécurité maximale</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Chiffrement de bout en bout et authentification multi-facteurs. 
                  Vos données sont protégées.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 rounded-3xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-100 dark:border-orange-900 hover:shadow-2xl transition-all hover:scale-105">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">Collaboration intuitive</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Partagez et collaborez avec votre équipe en quelques clics. 
                  Permissions granulaires incluses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="relative isolate py-32 px-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
          {/* Gradient decorative */}
          <div aria-hidden="true" className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl">
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-blue-400 to-purple-500 opacity-10 dark:opacity-20"
            />
          </div>

          <div className="mx-auto max-w-4xl text-center mb-20">
            <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-4">TARIFS</h2>
            <p className="text-5xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
              Choisissez votre plan
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Des tarifs transparents et évolutifs. Commencez gratuitement, 
              évoluez quand vous voulez.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={classNames(
                  tier.featured 
                    ? 'relative bg-white dark:bg-zinc-900 ring-2 ring-blue-600 dark:ring-blue-500 scale-105' 
                    : 'bg-white dark:bg-zinc-900/50 ring-1 ring-zinc-200 dark:ring-zinc-800',
                  'rounded-3xl p-8 hover:shadow-2xl transition-all hover:scale-105'
                )}
              >
                {tier.featured && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-fit">
                    <span className="inline-flex rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 text-sm font-semibold text-white">
                      LE PLUS POPULAIRE
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-black dark:text-white">
                  {tier.name}
                </h3>
                
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-5xl font-black tracking-tight text-black dark:text-white">
                    {tier.priceMonthly}
                  </span>
                  {tier.priceMonthly !== 'Sur mesure' && (
                    <span className="text-base text-zinc-500">/mois</span>
                  )}
                </p>

                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400 min-h-[3rem]">
                  {tier.description}
                </p>

                <ul className="mt-8 space-y-3 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3 text-zinc-700 dark:text-zinc-300">
                      <CheckIcon className="h-6 w-5 flex-none text-blue-600 dark:text-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.href}
                  className={classNames(
                    tier.featured
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700',
                    'mt-8 block rounded-2xl px-4 py-3 text-center text-sm font-semibold transition-all hover:scale-105'
                  )}
                >
                  {tier.name === 'Enterprise' ? 'Nous contacter' : 'Commencer'}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-zinc-500 mt-12">
            💳 Tous les plans incluent 14 jours d'essai gratuit. Sans engagement.
          </p>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-32 px-6 bg-white dark:bg-zinc-950">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-black dark:text-white">
              Questions fréquentes
            </h2>
            
            <div className="space-y-6">
              <details className="group p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <summary className="font-semibold text-lg cursor-pointer text-black dark:text-white list-none flex justify-between items-center">
                  Comment fonctionne l'essai gratuit ?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                  Vous bénéficiez de 14 jours d'essai gratuit sur tous nos plans. 
                  Aucune carte bancaire requise pour commencer.
                </p>
              </details>

              <details className="group p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <summary className="font-semibold text-lg cursor-pointer text-black dark:text-white list-none flex justify-between items-center">
                  Puis-je changer de plan à tout moment ?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                  Absolument ! Vous pouvez upgrader ou downgrader votre plan à tout moment 
                  depuis votre tableau de bord.
                </p>
              </details>

              <details className="group p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <summary className="font-semibold text-lg cursor-pointer text-black dark:text-white list-none flex justify-between items-center">
                  Mes données sont-elles sécurisées ?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                  Oui, nous utilisons un chiffrement AES 256-bit et nos serveurs sont 
                  certifiés ISO 27001. Vos données sont stockées en Europe.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-24 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              Prêt à transformer votre workflow ?
            </h2>
            <p className="mt-6 text-xl text-blue-100">
              Rejoignez plus de 10 000 équipes qui utilisent CloudSync chaque jour.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="rounded-full bg-white px-10 py-4 font-bold text-blue-600 hover:bg-blue-50 transition-all hover:scale-105 shadow-xl"
              >
                Essai gratuit 14 jours
              </Link>
              <Link
                href="/contact"
                className="rounded-full border-2 border-white px-10 py-4 font-bold text-white hover:bg-white/10 transition-all hover:scale-105"
              >
                Demander une démo
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="font-bold text-lg">CloudSync</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              La plateforme de synchronisation cloud pour les équipes modernes.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-black dark:text-white">Produit</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><a href="#features" className="hover:text-black dark:hover:text-white">Fonctionnalités</a></li>
              <li><a href="#pricing" className="hover:text-black dark:hover:text-white">Tarifs</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-black dark:text-white">Entreprise</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><a href="#" className="hover:text-black dark:hover:text-white">À propos</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white">Carrières</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-black dark:text-white">Légal</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><a href="#" className="hover:text-black dark:hover:text-white">Confidentialité</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white">CGU</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white">Sécurité</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500">
          © 2026 CloudSync. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}