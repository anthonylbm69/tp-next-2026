"use client";

export default function CheckoutButton() {
    const handleCheckout = async () => {
        try {
            const res = await fetch("/api/checkout", { method: "POST" });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Une erreur est survenue");
            }

            if (data.url) {
                window.location.href = data.url; // Redirection vers Stripe
            } else {
                console.error("Pas d'URL reçue de l'API", data);
            }
        } catch (err) {
            console.error("Erreur lors du checkout:", err);
            alert("Erreur : regarde la console de ton navigateur");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-black">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-white/10">
                <div className="p-8">
                    <div className="mb-4 inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                        Premium Access
                    </div>
                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Accès Complet
                    </h1>
                    <p className="mb-6 text-zinc-500 dark:text-zinc-400">
                        Débloquez toutes les fonctionnalités et profitez d'une expérience illimitée.
                    </p>

                    <div className="mb-8 flex items-baseline">
                        <span className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                            19€
                        </span>
                        <span className="ml-2 text-xl font-medium text-zinc-500 dark:text-zinc-400">
                            /mois
                        </span>
                    </div>

                    <ul className="mb-8 space-y-4">
                        {[
                            "Accès illimité aux cours",
                            "Support prioritaire 24/7",
                            "Certificats de réussite",
                            "Projets pratiques inclus",
                        ].map((feature) => (
                            <li key={feature} className="flex items-center text-zinc-600 dark:text-zinc-300">
                                <svg
                                    className="mr-3 h-5 w-5 flex-shrink-0 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleCheckout}
                        className="w-full rounded-xl bg-zinc-900 px-4 py-4 text-center text-sm font-semibold text-white shadow-md transition-all hover:bg-zinc-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:focus:ring-white dark:focus:ring-offset-zinc-900"
                    >
                        Payer maintenant
                    </button>
                    <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-500">
                        Paiement sécurisé via Stripe
                    </p>
                </div>
            </div>
        </div>
    );
}