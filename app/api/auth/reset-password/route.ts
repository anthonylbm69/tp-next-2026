import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { ArgonHash } from "@/lib/argon2i";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({
                error: "Token et mot de passe requis"
            }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({
                error: "Le mot de passe doit contenir au moins 8 caractères"
            }, { status: 400 });
        }

        // Récupère le token
        const resetToken = await db.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });

        // Vérifie si le token existe et est valide
        if (!resetToken) {
            return NextResponse.json({
                error: "Lien invalide ou expiré"
            }, { status: 400 });
        }

        if (resetToken.used) {
            return NextResponse.json({
                error: "Ce lien a déjà été utilisé"
            }, { status: 400 });
        }

        if (new Date() > resetToken.expiresAt) {
            return NextResponse.json({
                error: "Ce lien a expiré"
            }, { status: 400 });
        }

        const hashedPassword = await ArgonHash(password);

        if (!hashedPassword || hashedPassword === "false") {
            return NextResponse.json(
                { error: true, message: "Échec du hash du mot de passe", code: "E02" },
                { status: 500 }
            );
        }

        // Met à jour le mot de passe
        await db.user.update({
            where: { id: resetToken.userId },
            data: { password: hashedPassword },
        });

        // Marque le token comme utilisé
        await db.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { used: true },
        });

        console.log("✅ Mot de passe réinitialisé pour:", resetToken.user.email);

        return NextResponse.json({
            success: true,
            message: "Mot de passe réinitialisé avec succès"
        });

    } catch (error: any) {
        console.error("❌ Erreur reset-password:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}