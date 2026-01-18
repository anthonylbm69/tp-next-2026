import { db } from "@/lib/db";
import { resend } from "@/lib/resend";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email requis" }, { status: 400 });
        }

        // Vérifie si l'utilisateur existe
        const user = await db.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        // ⚠️ Pour la sécurité, on ne dit pas si l'email existe ou non
        if (!user) {
            console.log("❌ Email non trouvé:", email);
            return NextResponse.json({ 
                success: true,
                message: "Si cet email existe, un lien de réinitialisation a été envoyé"
            });
        }

        // Génère un token sécurisé
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 3600000); // 1 heure

        // Sauvegarde le token
        await db.passwordResetToken.create({
            data: {
                token: resetToken,
                userId: user.id,
                expiresAt: expiresAt,
            },
        });

        // URL de réinitialisation
        const resetUrl = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${resetToken}`;

        // Envoie l'email
        try {
            await resend.emails.send({
                from: "noreply@kemyl.fr",
                to: user.email,
                subject: "Réinitialisation de votre mot de passe",
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
                            .button { 
                                display: inline-block; 
                                background: #667eea; 
                                color: white !important; 
                                padding: 14px 30px; 
                                text-decoration: none; 
                                border-radius: 8px; 
                                margin: 20px 0;
                                font-weight: bold;
                            }
                            .warning { 
                                background: #fef3c7; 
                                border: 1px solid #fbbf24; 
                                border-radius: 8px; 
                                padding: 15px; 
                                margin: 20px 0;
                                font-size: 14px;
                            }
                            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1 style="margin: 0;">🔐 Réinitialisation de mot de passe</h1>
                            </div>
                            
                            <div class="content">
                                <p>Bonjour <strong>${user.firstName} ${user.lastName}</strong>,</p>
                                
                                <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
                                
                                <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
                                
                                <div style="text-align: center;">
                                    <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
                                </div>
                                
                                <div class="warning">
                                    ⏱️ <strong>Ce lien expire dans 1 heure.</strong><br>
                                    Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
                                </div>
                                
                                <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
                                    Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
                                    <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
                                </p>
                                
                                <p>Cordialement,<br><strong>L'équipe Kemyl</strong></p>
                            </div>
                            
                            <div class="footer">
                                <p>© ${new Date().getFullYear()} Kemyl - Tous droits réservés</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
            });

            console.log("✅ Email de réinitialisation envoyé à:", user.email);

        } catch (emailError: any) {
            console.error("❌ Erreur envoi email:", emailError);
            return NextResponse.json({ 
                error: "Erreur lors de l'envoi de l'email" 
            }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true,
            message: "Si cet email existe, un lien de réinitialisation a été envoyé"
        });

    } catch (error: any) {
        console.error("❌ Erreur forgot-password:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}