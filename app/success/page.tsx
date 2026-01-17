"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { IconDownload, IconCheck, IconArrowLeft, IconLoader2 } from "@tabler/icons-react";

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const [loading, setLoading] = useState(true);
    const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);

    useEffect(() => {
        if (sessionId) {
            fetch(`/api/invoice?session_id=${sessionId}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.pdf) {
                        setInvoiceUrl(data.pdf);
                    }
                })
                .catch((err) => console.error("Erreur facture:", err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [sessionId]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-black relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md rounded-[2.5rem] bg-white p-10 shadow-2xl ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-white/10">
                <div className="flex flex-col items-center text-center">
                    
                    <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <IconCheck className="h-12 w-12 text-green-600 dark:text-green-400" stroke={3} />
                    </div>

                    <h1 className="mb-3 text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                        C'est réglé !
                    </h1>
                    <p className="mb-10 text-zinc-500 dark:text-zinc-400 font-medium">
                        Votre paiement a été validé avec succès. Votre abonnement CloudSync est désormais actif.
                    </p>

                    <div className="w-full space-y-4">
                        
                        {loading ? (
                            <div className="flex items-center justify-center gap-3 py-4 text-sm font-bold text-zinc-400 animate-pulse">
                                <IconLoader2 className="animate-spin size-5" />
                                Génération de la facture...
                            </div>
                        ) : invoiceUrl ? (
                            <a
                                href={invoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex w-full items-center justify-center rounded-2xl border-2 border-zinc-100 bg-white px-6 py-4 text-sm font-bold text-zinc-900 transition-all hover:border-zinc-900 hover:bg-zinc-900 hover:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                            >
                                <IconDownload className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                Télécharger ma facture PDF
                            </a>
                        ) : (
                            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-500">
                                La facture sera disponible dans votre espace client d'ici quelques minutes.
                            </div>
                        )}

                        <Link
                            href="/dashboard"
                            className="flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-95"
                        >
                            Accéder à mon Dashboard
                        </Link>

                        <Link
                            href="/"
                            className="flex w-full items-center justify-center gap-2 py-2 text-sm font-semibold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                            <IconArrowLeft className="size-4" />
                            Retour au site
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}