import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { 
  IconReceipt2, 
  IconDownload, 
  IconExternalLink, 
  IconCircleCheck,
  IconFileText
} from "@tabler/icons-react";

export default async function InvoicesPage() {
  // 1. Authentification sécurisée
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) redirect("/login");

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  const userId = Number(payload.userId || payload.id);

  // 2. Récupération des factures dans Neon
  // On récupère toutes les commandes payées, classées par date
  const invoices = await db.order.findMany({
    where: { 
      userId: userId,
      status: "paid" 
    },
    include: {
      product: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            <IconReceipt2 className="text-blue-600 size-8" /> Mes Factures
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Consultez et téléchargez l'historique de vos paiements CloudSync.
          </p>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-800/50 px-4 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-sm font-medium">
          Total facturé : {invoices.reduce((acc, inv) => acc + inv.totalAmount, 0)}€
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem]">
          <div className="bg-zinc-100 dark:bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconFileText className="text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold">Aucune facture trouvée</h3>
          <p className="text-zinc-500 max-w-xs mx-auto mt-2">
            Vos factures apparaîtront ici dès que vous aurez effectué votre premier achat.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 text-xs uppercase tracking-widest font-bold">
                <th className="px-6 py-4">N° Facture</th>
                <th className="px-6 py-4">Produit</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                    #{invoice.stripeSessionId.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                    {invoice.product?.name || "Abonnement"}
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {new Date(invoice.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                    {invoice.totalAmount}€
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold border border-green-100 dark:border-green-800">
                      <IconCircleCheck className="size-3" /> Payé
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold transition-colors"
                      title="Bientôt disponible : Téléchargement PDF"
                    >
                      <IconDownload className="size-4" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 flex items-center gap-2 p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl">
        <IconExternalLink className="text-blue-600 size-5 shrink-0" />
        <p className="text-xs text-blue-800 dark:text-blue-300">
          Besoin de modifier vos informations de facturation ? Accédez au <span className="underline cursor-pointer font-bold">Portail Client Stripe</span> pour gérer vos coordonnées.
        </p>
      </div>
    </div>
  );
}