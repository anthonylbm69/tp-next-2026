import Link from "next/link";

export default function SuccessPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-black">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-white/10">
                <div className="flex flex-col items-center text-center">
                    {/* Animated Checkmark */}
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <svg
                            className="h-10 w-10 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Paiement Réussi !
                    </h1>
                    <p className="mb-8 text-zinc-500 dark:text-zinc-400">
                        Merci pour votre commande. Vous recevrez bientôt un email de confirmation.
                    </p>

                    <div className="w-full space-y-3">
                        <Link
                            href="/"
                            className="flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:focus:ring-white dark:focus:ring-offset-zinc-900"
                        >
                            Retour à l'accueil
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}