import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  IconCheck, 
  IconCrown, 
  IconAlertCircle, 
  IconArrowUpRight, 
  IconArrowLeft 
} from "@tabler/icons-react";

export default async function SubscriptionPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) redirect("/login");

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  const userId = Number(payload.userId || payload.id);

  const lastOrder = await db.order.findFirst({
    where: { userId, status: "paid" },
    include: { product: true },
    orderBy: { createdAt: 'desc' }
  });

  const currentProduct = lastOrder?.product;
  const planId = currentProduct?.id || 0;

  const plans = [
    { id: 1, name: "Starter", price: 20, features: ["5 Go Stockage", "3 Utilisateurs"] },
    { id: 2, name: "Pro", price: 50, features: ["100 Go Stockage", "Utilisateurs illimités"] },
    { id: 3, name: "Enterprise", price: 100, features: ["Stockage illimité", "Support dédié"] }
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
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

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Mon Abonnement</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Gérez votre forfait et vos préférences de facturation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                  <IconCrown className="text-blue-600 dark:text-blue-400 size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{currentProduct?.name || "Plan Gratuit"}</h2>
                  <p className="text-sm text-zinc-500">Forfait {currentProduct ? "mensuel" : "de base"}</p>
                </div>
              </div>
              <span className="text-2xl font-black">{currentProduct?.price || 0}€<span className="text-sm font-normal text-zinc-500">/mois</span></span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-zinc-100 dark:border-zinc-800">
              {currentProduct ? (
                plans.find(p => p.id === planId)?.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                    <IconCheck className="text-green-500 size-4" /> {f}
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500 italic">Aucune fonctionnalité premium active.</p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              {currentProduct && (
                <button className="px-6 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors">
                  Annuler l'abonnement
                </button>
              )}
              <Link href="/payments" className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                {currentProduct ? "Changer de forfait" : "Prendre un abonnement"} <IconArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 flex gap-3">
            <IconAlertCircle className="text-amber-600 dark:text-amber-500 shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-400">
              L'annulation prendra effet à la fin de votre période de facturation actuelle. Vous conserverez vos accès premium jusqu'à cette date.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-400">Upgrades disponibles</h3>
          {plans.filter(p => p.id > planId).map(p => (
            <div key={p.id} className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:border-blue-500 transition-colors group">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">{p.name}</span>
                <span className="font-black text-blue-600">{p.price}€</span>
              </div>
              <p className="text-xs text-zinc-500 mb-4">Passez à la vitesse supérieure avec plus de puissance.</p>
              <Link href={`/payments?price=${p.price}`} className="block w-full text-center py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                Upgrade vers {p.name}
              </Link>
            </div>
          ))}
          {planId === 3 && (
            <p className="text-center text-sm text-zinc-500 p-8 border-2 border-dashed rounded-3xl">
              Vous avez déjà le meilleur forfait ! 🚀
            </p>
          )}
        </div>
      </div>
    </div>
  );
}