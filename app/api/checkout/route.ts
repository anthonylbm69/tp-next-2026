import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

// Définis la base URL ici, mais ne crée pas de session ici !
const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export async function POST(req: Request) {
    try {
        // 1. Récupère éventuellement des données du body (ex: prix, id produit)
        // const body = await req.json();

        // 2. Crée la session UNIQUEMENT ici
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
            success_url: `${baseUrl}/success`,
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