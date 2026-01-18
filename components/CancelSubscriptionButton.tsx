"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelSubscriptionButton({ productName }: { productName: string }) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const router = useRouter();

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      const res = await fetch("/api/subscription/cancel", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Abonnement annulé avec succès. Vous êtes maintenant en Free.");
        router.refresh(); // Rafraîchit la page pour voir les changements
      } else {
        alert(`❌ Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("❌ Une erreur est survenue");
    } finally {
      setCancelling(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmDialog(true)}
        disabled={cancelling}
        className="px-6 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cancelling ? "Annulation..." : "Annuler l'abonnement"}
      </button>

      {/* Modal de confirmation */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowConfirmDialog(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Confirmer l'annulation</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Êtes-vous sûr de vouloir annuler votre abonnement{" "}
              <strong className="text-zinc-900 dark:text-white">{productName}</strong> ?
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-400">
                ℹ️ Vous serez automatiquement transféré vers le <strong>forfait Free</strong> et pourrez continuer à utiliser les fonctionnalités de base.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? "Annulation..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}