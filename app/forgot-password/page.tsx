"use client";

import { useState } from "react";
import Link from "next/link";
import { IconArrowLeft, IconMail } from "@tabler/icons-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.error || "Une erreur est survenue");
            }
        } catch (err) {
            setError("Erreur de connexion au serveur");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
                <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 p-8 shadow-xl ring-1 ring-zinc-900/5 dark:ring-white/10">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                            <IconMail className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
                            Email envoyé !
                        </h1>
                        <p className="mb-8 text-zinc-500 dark:text-zinc-400">
                            Si un compte existe avec cet email, vous recevrez un lien de réinitialisation dans quelques instants.
                        </p>
                        <Link
                            href="/login"
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Retour à la connexion
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
            <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 p-8 shadow-xl ring-1 ring-zinc-900/5 dark:ring-white/10">
                <Link
                    href="/login"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                >
                    <IconArrowLeft className="h-4 w-4" />
                    Retour
                </Link>

                <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    Mot de passe oublié ?
                </h1>
                <p className="mb-8 text-zinc-500 dark:text-zinc-400">
                    Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="vous@exemple.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-zinc-900 dark:bg-white px-4 py-3 font-semibold text-white dark:text-zinc-900 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? "Envoi..." : "Envoyer le lien"}
                    </button>
                </form>
            </div>
        </div>
    );
}