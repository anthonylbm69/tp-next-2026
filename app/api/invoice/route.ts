import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { resend } from "@/lib/resend";
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

    if (!invoice?.invoice_pdf) {
      return NextResponse.json(
        { error: "Facture en cours de génération par Stripe..." },
        { status: 202 }
      );
    }

    const order = await db.order.update({
      where: { stripeSessionId: sessionId },
      data: {
        status: "paid",
        stripeInvoiceId: invoice.id,
        invoiceNumber: invoice.number,
        invoicePdfUrl: invoice.invoice_pdf,
      },
      include: {
        user: true,
      },
    });

    console.log("✅ Order mis à jour en 'paid':", order.id);

    let pdfBase64: string | null = null;
    try {
      const pdfResponse = await fetch(invoice.invoice_pdf);
      const pdfBuffer = await pdfResponse.arrayBuffer();
      pdfBase64 = Buffer.from(pdfBuffer).toString("base64");
    } catch (pdfError) {
      console.error("❌ Erreur téléchargement PDF:", pdfError);
    }

    const planName =
      order.totalAmount === 20
        ? "Starter"
        : order.totalAmount === 50
        ? "Pro"
        : "Enterprise";

    // Envoie l'email avec la facture en pièce jointe
    try {
      await resend.emails.send({
        from: "noreply@kemyl.fr",
        to: order.user.email,
        subject: `✅ Paiement confirmé - Facture n°${invoice.number}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 30px; 
                border-radius: 10px 10px 0 0; 
                text-align: center; 
              }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .info-box { 
                background: white; 
                border: 1px solid #e5e7eb; 
                border-radius: 8px; 
                padding: 20px; 
                margin: 20px 0; 
              }
              .info-row { 
                display: flex; 
                justify-content: space-between; 
                margin: 10px 0; 
                padding: 10px 0; 
                border-bottom: 1px solid #f3f4f6; 
              }
              .info-label { font-weight: 600; color: #6b7280; }
              .info-value { color: #111827; font-weight: 500; }
              .button { 
                display: inline-block; 
                background: #667eea; 
                color: white; 
                padding: 12px 30px; 
                text-decoration: none; 
                border-radius: 6px; 
                margin: 20px 0; 
              }
              .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">✅ Paiement confirmé !</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Merci pour votre confiance</p>
              </div>
              
              <div class="content">
                <p>Bonjour <strong>${order.user.firstName} ${order.user.lastName}</strong>,</p>
                
                <p>Votre paiement a bien été reçu et traité avec succès. Voici le récapitulatif de votre commande :</p>
                
                <div class="info-box">
                  <div class="info-row">
                    <span class="info-label">Plan choisi</span>
                    <span class="info-value"> ${planName}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Montant</span>
                    <span class="info-value"> ${order.totalAmount}€</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Numéro de commande</span>
                    <span class="info-value"> #${order.id}</span>
                  </div>
                  <div class="info-row" style="border-bottom: none;">
                    <span class="info-label">Numéro de facture</span>
                    <span class="info-value"> ${invoice.number}</span>
                  </div>
                </div>
                
                <p style="margin-top: 30px;">
                  Votre facture est jointe à cet email en format PDF. 
                  Vous pouvez également la télécharger à tout moment depuis votre espace client.
                </p>
                
                <div style="text-align: center;">
                  <a href="${invoice.invoice_pdf}" class="button">📄 Télécharger la facture</a>
                </div>
                
                <p style="margin-top: 30px;">Si vous avez des questions, n'hésitez pas à nous contacter.</p>
                
                <p>Cordialement,<br><strong>L'équipe CloudSync</strong></p>
              </div>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} CloudSync - Tous droits réservés</p>
                <p style="font-size: 12px; margin-top: 10px;">
                  Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
        attachments: pdfBase64
          ? [
              {
                filename: `facture_${invoice.number}.pdf`,
                content: pdfBase64,
              },
            ]
          : [],
      });

      console.log("📧 Email envoyé à", order.user.email);
    } catch (emailError: any) {
      console.error("❌ Erreur envoi email:", emailError);
    }

    return NextResponse.json({
      pdf: invoice.invoice_pdf,
      invoiceNumber: invoice.number,
      orderNumber: order.id,
      total: invoice.amount_paid / 100,
      status: invoice.status,
    });
  } catch (error: any) {
    console.error("❌ Erreur API Invoice:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}