import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

import { db } from "@/lib/db"; 

export async function POST(req: Request) {
    try {
        const { amount, userId } = await req.json(); 

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
        });

        await db.order.create({
            data: {
                userId: userId, 
                stripeSessionId: session.id, 
                totalAmount: amount,
                status: "pending", 
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}