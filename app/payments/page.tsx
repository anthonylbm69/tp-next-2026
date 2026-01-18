"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { IconCheck, IconArrowLeft, IconLock, IconCreditCard } from "@tabler/icons-react";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const price = searchParams.get("price");

    const details: Record<string, { name: string, features: string[], color: string, description: string }> = {
        "20": {
            name: "Starter",
            color: "from-blue-500 to-blue-600",
            description: "Idéal pour débuter sereinement.",
            features: ['5 Go de stockage cloud', 'Jusqu\'à 3 utilisateurs', 'Synchronisation temps réel', 'Support par email', 'Historique 30 jours'],
        },
        "50": {
            name: "Pro",
            color: "from-blue-600 to-purple-600",
            description: "La puissance pour les équipes en croissance.",
            features: ['100 Go de stockage cloud', 'Utilisateurs illimités', 'Synchronisation temps réel', 'Support prioritaire 24/7', 'Historique illimité', 'API avancée'],
        },
        "100": {
            name: "Enterprise",
            color: "from-purple-600 to-pink-600",
            description: "Sécurité et performances maximales.",
            features: ['Stockage illimité', 'Utilisateurs illimités', 'Synchronisation multi-régions', 'Support dédié 24/7', 'SLA garantis', 'Formation équipe', 'Conformité RGPD+'],
        }
    };

    const handleCheckout = async (selectedPrice: string) => {
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: parseInt(selectedPrice) })
            });

            const data = await res.json();
            if (data.url) window.location.href = data.url;
        } catch (err) {
            console.error("Erreur:", err);
        }
    };

    if (!price) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 dark:bg-zinc-950">
                <div className="mb-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors group"
                    >
                        <div className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                            <IconArrowLeft className="size-4" />
                        </div>
                        Retour au Dashboard
                    </Link>
                </div>
                <h1 className="mb-4 text-4xl font-black tracking-tight text-zinc-900 dark:text-white text-center">
                    Sélectionnez votre forfait
                </h1>
                <p className="mb-12 text-zinc-500 dark:text-zinc-400 text-center max-w-md">
                    Choisissez l'offre qui correspond le mieux à vos besoins de synchronisation.
                </p>
                <div className="grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
                    {Object.entries(details).map(([key, plan]) => (
                        <div key={key} className="flex flex-col rounded-3xl bg-white p-8 shadow-xl ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 transition-all hover:shadow-2xl hover:-translate-y-1">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{plan.name}</h2>
                            <p className="text-sm text-zinc-500 mt-1">{plan.description}</p>
                            <div className="my-8 flex items-baseline">
                                <span className="text-5xl font-black text-zinc-900 dark:text-white">{key}€</span>
                                <span className="ml-1 text-zinc-500 font-medium">/mois</span>
                            </div>
                            <ul className="mb-8 flex-1 space-y-4">
                                {plan.features.map(f => (
                                    <li key={f} className="flex items-start text-sm text-zinc-600 dark:text-zinc-300">
                                        <IconCheck className="mr-3 h-5 w-5 text-blue-500 flex-shrink-0" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleCheckout(key)}
                                className={`w-full rounded-2xl bg-gradient-to-r ${plan.color} py-4 font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95`}
                            >
                                Choisir {plan.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const currentPlan = details[price] || details["20"];

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 p-4 dark:from-zinc-950 dark:to-zinc-900">
            <div className="w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white shadow-2xl ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                <div className="p-8 md:p-10">
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/payments" className="flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">
                            <IconArrowLeft className="mr-2 h-4 w-4" />
                            Retour
                        </Link>
                        <Badge className="bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
                            Récapitulatif
                        </Badge>
                    </div>

                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">
                        Finalisez votre abonnement
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mb-8">
                        Vous avez choisi le plan <span className="font-bold text-zinc-900 dark:text-white">{currentPlan.name}</span>.
                    </p>

                    <div className="rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 p-6 mb-8 flex items-center justify-between border border-zinc-100 dark:border-zinc-800">
                        <div>
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Total à payer</p>
                            <p className="text-4xl font-black text-zinc-900 dark:text-white">{price}€<span className="text-lg font-medium text-zinc-400">/mois</span></p>
                        </div>
                        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-r ${currentPlan.color} flex items-center justify-center text-white shadow-lg`}>
                            <IconCreditCard />
                        </div>
                    </div>

                    <div className="mb-10">
                        <p className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Inclus dans votre forfait :</p>
                        <ul className="grid grid-cols-1 gap-3">
                            {currentPlan.features.map((feature) => (
                                <li key={feature} className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                                    <IconCheck className="mr-3 h-4 w-4 text-green-500 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        onClick={() => handleCheckout(price)}
                        className={`w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r ${currentPlan.color} p-5 font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95`}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                            Confirmer et Payer
                        </span>
                    </button>

                    <div className="mt-8 flex items-center justify-center gap-4 text-zinc-400">
                        <div className="flex items-center gap-1.5">
                            <IconLock className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Sécurisé par Stripe</span>
                        </div>
                        <div className="h-1 w-1 rounded-full bg-zinc-300" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Annulation flexible</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentsPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="text-sm font-medium text-zinc-500 animate-pulse">
                        Chargement de la page de paiement...
                    </p>
                </div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${className}`}>
            {children}
        </span>
    );
}