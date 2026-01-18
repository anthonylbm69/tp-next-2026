"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { IconLock, IconEye, IconEyeOff } from "@tabler/icons-react";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Lien invalide");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
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
                            <IconLock className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
                            Mot de passe réinitialisé !
                        </h1>
                        <p className="mb-4 text-zinc-500 dark:text-zinc-400">
                            Redirection vers la page de connexion...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
            <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 p-8 shadow-xl ring-1 ring-zinc-900/5 dark:ring-white/10">
                <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    Nouveau mot de passe
                </h1>
                <p className="mb-8 text-zinc-500 dark:text-zinc-400">
                    Choisissez un nouveau mot de passe sécurisé pour votre compte.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
                            Nouveau mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Minimum 8 caractères"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                            >
                                {showPassword ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
                            Confirmer le mot de passe
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Répétez le mot de passe"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !token}
                        className="w-full rounded-xl bg-zinc-900 dark:bg-white px-4 py-3 font-semibold text-white dark:text-zinc-900 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                    </button>

                    <Link
                        href="/login"
                        className="block text-center text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    >
                        Retour à la connexion
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}