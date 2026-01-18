import { db } from "@/lib/db";
import { resend } from "@/lib/resend";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = parseInt((payload.sub || payload.id || payload.userId) as string);

        if (!userId) {
            return NextResponse.json({ error: "ID utilisateur invalide" }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
        }

        
        const currentOrder = await db.order.findFirst({
            where: {
                userId: userId,
                status: "paid",
                productId: { not: 4 },
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                product: true,
            },
        });

        if (!currentOrder) {
            return NextResponse.json({ error: "Aucun abonnement actif à annuler" }, { status: 404 });
        }

        const planName = currentOrder.product?.name || "Premium";

        
        await db.order.update({
            where: { id: currentOrder.id },
            data: { status: "cancelled" },
        });

        
        await db.order.create({
            data: {
                userId: userId,
                stripeSessionId: `free_${Date.now()}`,
                totalAmount: 0,
                productId: 4, // Plan Free
                status: "paid",
            },
        });

        console.log("✅ Abonnement annulé et repasse en Free pour l'utilisateur:", userId);

        
        try {
            console.log("📧 Tentative d'envoi email d'annulation à:", user.email);

            const emailResult = await resend.emails.send({
                from: "noreply@kemyl.fr", // ✅ Change par "onboarding@resend.dev" si ton domaine n'est pas vérifié
                to: user.email,
                subject: "Annulation de votre abonnement",
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { 
                                background: linear-gradient(135deg, #6b7280 0%, #374151 100%); 
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
                            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
                            .button { 
                                display: inline-block; 
                                background: #667eea; 
                                color: white; 
                                padding: 12px 30px; 
                                text-decoration: none; 
                                border-radius: 6px; 
                                margin: 20px 0; 
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1 style="margin: 0;">Abonnement annulé</h1>
                            </div>
                            
                            <div class="content">
                                <p>Bonjour <strong>${user.firstName} ${user.lastName}</strong>,</p>
                                
                                <p>Votre abonnement <strong>${planName}</strong> a été annulé avec succès.</p>
                                
                                <div class="info-box">
                                    <p style="margin: 0;"><strong>✅ Vous êtes maintenant sur le forfait Free</strong></p>
                                    <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">
                                        Vous pouvez continuer à utiliser nos services de base gratuitement.
                                    </p>
                                </div>
                                
                                <p>Si vous souhaitez reprendre un abonnement premium, vous pouvez le faire à tout moment depuis votre espace client.</p>
                                
                                <div style="text-align: center;">
                                    <a href="${process.env.NEXT_PUBLIC_URL}/payments" class="button">Voir mes abonnements</a>
                                </div>
                                
                                <p>Merci de nous avoir fait confiance !</p>
                                
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
            });

            console.log("✅ Email d'annulation envoyé avec succès:", emailResult);

        } catch (emailError: any) {
            console.error("❌ ERREUR ENVOI EMAIL D'ANNULATION:");
            console.error("Message:", emailError.message);
            console.error("Status:", emailError.statusCode);
            console.error("Details:", JSON.stringify(emailError, null, 2));
        }

        return NextResponse.json({ 
            success: true,
            message: "Abonnement annulé, vous êtes maintenant en Free"
        });

    } catch (error: any) {
        console.error("❌ Erreur annulation:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}