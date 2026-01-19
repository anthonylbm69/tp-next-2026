import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const baseUrl = "https://tp-next-2026.vercel.app";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
        }
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        
        const userId = (payload.sub || payload.id || payload.userId) as string;

        if (!userId) {
            return NextResponse.json({ error: "ID utilisateur introuvable dans le token" }, { status: 401 });
        }

        const { amount } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
        }

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
                userId: userId,
            },
        });

        let productId = 1; 
        if (amount === 50) productId = 2;
        if (amount === 100) productId = 3;

        const order = await db.order.create({
            data: {
                stripeSessionId: session.id,
                userId: parseInt(userId),
                invoiceNumber: session.invoice as string | null,
                totalAmount: (session.amount_total || 0) / 100,
                productId: productId,
                status: "pending",
            },
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error("[CHECKOUT_ERROR]:", error);
        
        if (error.code === "ERR_JWT_EXPIRED") {
            return NextResponse.json({ error: "Session expirée" }, { status: 401 });
        }

        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
    }
}