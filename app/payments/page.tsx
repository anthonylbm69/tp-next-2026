"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CheckoutButton() {
    const searchParams = useSearchParams();

    // On récupère le prix depuis l'URL (ex: ?price=50), par défaut 20
    const price = searchParams.get("price") || "20";

    const details: Record<string, { name: string, features: string[] }> = {
        "20": {
            name: "Starter",
            features: [
                '5 Go de stockage cloud',
                'Jusqu\'à 3 utilisateurs',
                'Synchronisation temps réel',
                'Support par email',
                'Historique 30 jours'
            ],
        },
        "50": {
            name: "Pro",
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
        },
        "100": {
            name: "Enterprise",
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
        }
    };

    const currentPlan = details[price] || details["20"];

    const handleCheckout = async () => {
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: parseInt(price) })
            });

            const data = await res.json();
            if (data.url) window.location.href = data.url;
        } catch (err) {
            console.error("Erreur:", err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-zinc-50 p-4 dark:from-zinc-950 dark:to-zinc-900 relative overflow-hidden">
            
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-1 shadow-2xl ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                <div className="rounded-[calc(1.5rem-1px)] bg-white p-8 dark:bg-zinc-900">
                    
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        Plan {currentPlan.name}
                    </div>

                    <h1 className="mb-2 text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                        Finaliser votre commande
                    </h1>
                    <p className="mb-8 text-zinc-500 dark:text-zinc-400">
                        Plus qu'une étape pour booster votre productivité avec CloudSync.
                    </p>

                    <div className="mb-8 flex items-baseline">
                        <span className="text-6xl font-black tracking-tight text-black dark:text-white">
                            {price}€
                        </span>
                        <span className="ml-2 text-xl font-medium text-zinc-500">/mois</span>
                    </div>

                    <ul className="mb-10 space-y-4">
                        {currentPlan.features.map((feature) => (
                            <li key={feature} className="flex items-start text-zinc-600 dark:text-zinc-300">
                                <div className="mr-3 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                    <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Bouton de paiement avec dégradé et animation */}
                    <button
                        onClick={handleCheckout}
                        className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-4 text-center text-lg font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-blue-500/25 active:scale-95"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Payer {price}€ maintenant
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <Link 
                        href="/#pricing" 
                        className="mt-6 block text-center text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
                    >
                        Choisir un autre plan
                    </Link>

                    <div className="mt-8 flex items-center justify-center gap-2 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                        <svg className="h-4 w-4 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                            Paiement sécurisé par Stripe
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}