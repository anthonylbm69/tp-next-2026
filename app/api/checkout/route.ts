import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export async function POST(req: Request) {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: "Mon super produit",
                        },
                        unit_amount: 2000, // 20.00€
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            // --- AJOUT : Active la génération de facture pour un achat unique ---
            invoice_creation: {
                enabled: true,
            },
            // --- MODIFICATION : Ajoute l'ID de session à l'URL de succès ---
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