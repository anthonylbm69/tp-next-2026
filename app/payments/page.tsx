"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutButton() {
    const searchParams = useSearchParams();

    // On récupère le prix depuis l'URL (ex: ?price=50), par défaut 20
    const price = searchParams.get("price") || "20";

    // On définit les détails en fonction du prix
    const details: Record<string, { name: string, features: string[] }> = {
        "20": {
            name: "Pack Starter",
            features: ["5 Go de stockage", "3 utilisateurs", "Support email"],
        },
        "50": {
            name: "Pack Pro",
            features: ["100 Go de stockage", "Utilisateurs illimités", "Support 24/7"],
        },
        "100": {
            name: "Pack Enterprise",
            features: ["Stockage illimité", "SLA garantis", "Formation équipe"],
        }
    };

    const currentPlan = details[price] || details["20"];

    const handleCheckout = async () => {
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // ON ENVOIE LE PRIX DYNAMIQUE À L'API
                body: JSON.stringify({ amount: parseInt(price) })
            });

            const data = await res.json();
            if (data.url) window.location.href = data.url;
        } catch (err) {
            console.error("Erreur:", err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-black">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-white/10">
                <div className="p-8">
                    <div className="mb-4 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {currentPlan.name}
                    </div>
                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Votre Abonnement
                    </h1>

                    <div className="mb-8 flex items-baseline">
                        <span className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                            {price}€
                        </span>
                        <span className="ml-2 text-xl font-medium text-zinc-500 dark:text-zinc-400">
                            /mois
                        </span>
                    </div>

                    <ul className="mb-8 space-y-4">
                        {currentPlan.features.map((feature) => (
                            <li key={feature} className="flex items-center text-zinc-600 dark:text-zinc-300">
                                <svg className="mr-3 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleCheckout}
                        className="w-full rounded-xl bg-blue-600 px-4 py-4 text-center text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 dark:bg-white dark:text-zinc-900"
                    >
                        Payer {price}€ maintenant
                    </button>
                </div>
            </div>
        </div>
    );
}