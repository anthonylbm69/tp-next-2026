import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export async function POST(req: Request) {
    try {
        // --- 1. RÉCUPÉRATION SÉCURISÉE DU USER ID VIA JWT ---
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value; // Remplace "token" par le nom de ton cookie

        if (!token) {
            return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
        }
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        
        // On récupère l'ID depuis le payload (souvent 'sub' ou 'id')
        const userId = (payload.sub || payload.id || payload.userId) as string;

        if (!userId) {
            return NextResponse.json({ error: "ID utilisateur introuvable dans le token" }, { status: 401 });
        }

        // --- 2. RÉCUPÉRATION DES DONNÉES DU CORPS ---
        const { amount } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
        }

        // --- 3. CRÉATION DE LA SESSION STRIPE ---
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: `Abonnement - Formule ${amount}€`,
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            invoice_creation: { enabled: true },
            success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}`,
            metadata: {
                userId: userId, // On stocke l'ID dans Stripe pour le webhook plus tard
            },
        });

        // --- 4. CRÉATION DE LA COMMANDE DANS NEON (VIA POOLING) ---
        // Grâce au pooler (port 6543), cette opération est ultra rapide
        const order = await db.order.create({
            data: {
                userId: parseInt(userId),
                stripeSessionId: session.id,
                stripeInvoiceId: session.invoice as string | null,
                invoiceNumber: session.invoice as string | null,
                totalAmount: (session.amount_total || 0) / 100,
                status: "pending", // On met "pending" car le paiement n'est pas encore confirmé par Stripe
            },
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error("[CHECKOUT_ERROR]:", error);
        
        // Gestion spécifique des erreurs JWT
        if (error.code === "ERR_JWT_EXPIRED") {
            return NextResponse.json({ error: "Session expirée" }, { status: 401 });
        }

        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
    }
}