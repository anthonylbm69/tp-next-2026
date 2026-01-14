import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export async function POST(req: Request) {
    try {
        // --- 1. Récupérer le montant envoyé par le frontend ---
        const { amount } = await req.json(); // On attend 20, 50 ou 100

        // Validation simple
        if (![20, 50, 100].includes(amount)) {
            return NextResponse.json({ error: "Prix invalide" }, { status: 400 });
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
                        // --- 2. Multiplier par 100 car Stripe compte en centimes ---
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            invoice_creation: {
                enabled: true,
            },
            success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Erreur Stripe détaillée:", error);
        return NextResponse.json(
            { error: error.message || "Erreur interne" },
            { status: 500 }
        );
    }
}