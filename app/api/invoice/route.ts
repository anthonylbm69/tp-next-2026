import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("session_id");

        if (!sessionId) return NextResponse.json({ error: "Session ID manquant" }, { status: 400 });

        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["invoice"],
        });

        const invoice = session.invoice as any;

        const updatedOrder = await db.order.update({
            where: { stripeSessionId: sessionId },
            data: {
                stripeInvoiceId: invoice?.id,
                invoicePdfUrl: invoice?.invoice_pdf,
                status: "paid",
            },
        });

        return NextResponse.json({
            pdf: invoice?.invoice_pdf,
            orderNumber: updatedOrder.invoiceNumber,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}