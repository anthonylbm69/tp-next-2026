import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID manquant" }, { status: 400 });
        }

        // On demande à Stripe de nous donner la session ET la facture associée
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["invoice"],
        });

        const invoice = session.invoice as any;

        return NextResponse.json({
            pdf: invoice?.invoice_pdf || null,
            url: invoice?.hosted_invoice_url || null,
        });
    } catch (error: any) {
        console.error("Erreur API Invoice:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}