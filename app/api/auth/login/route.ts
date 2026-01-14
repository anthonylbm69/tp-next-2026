import { prisma } from "@/lib/prisma";
import { ArgonVerify } from "@/lib/argon2i";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // 1. Trouver l'utilisateur par email
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return Response.json(
                { error: true, message: "Identifiants invalides" },
                { status: 401 }
            );
        }

        // 2. Vérifier le mot de passe
        // ArgonVerify(hash_en_base, mot_de_passe_saisi)
        const isPasswordValid = await ArgonVerify(user.password, password);

        if (!isPasswordValid) {
            return Response.json(
                { error: true, message: "Identifiants invalides" },
                { status: 401 }
            );
        }

        // 3. Succès (Ici, tu devras plus tard générer un Cookie ou un JWT)
        return Response.json({
            error: false,
            message: "Connexion réussie",
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
            },
        });

    } catch (e) {
        console.error(e);
        return Response.json(
            { error: true, message: "Erreur serveur" },
            { status: 500 }
        );
    }
}