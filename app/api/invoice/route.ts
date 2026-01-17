import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID manquant" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["invoice"],
    });

    const invoice = session.invoice as any;

    if (!invoice || !invoice.invoice_pdf) {
      return NextResponse.json({ error: "Facture en cours de génération par Stripe..." }, { status: 202 });
    }

    await db.order.update({
      where: { stripeSessionId: sessionId },
      data: {
        status: "paid",
        stripeInvoiceId: invoice.id,
        invoiceNumber: invoice.number,
        invoicePdfUrl: invoice.invoice_pdf,
      },
    });

    return NextResponse.json({
      pdf: invoice.invoice_pdf,
      orderNumber: invoice.number,
    });

  } catch (error: any) {
    console.error("Erreur API Invoice:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}