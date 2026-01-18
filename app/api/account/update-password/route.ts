import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { ArgonVerify, ArgonHash } from "@/lib/argon2i";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: true, message: "Non authentifié" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = Number(payload.userId || payload.id);

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: true, message: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: true, message: "Les mots de passe ne correspondent pas" },
        { status: 400 }
      );
    }

    // Récupère l'utilisateur
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: true, message: "Utilisateur introuvable" }, { status: 404 });
    }

    // Vérifie le mot de passe actuel
    const isPasswordValid = await ArgonVerify(user.password, currentPassword);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: true, message: "Mot de passe actuel incorrect" },
        { status: 401 }
      );
    }

    // Hash le nouveau mot de passe
    const hashedPassword = await ArgonHash(newPassword);

    // ✅ Vérifie que le hash a réussi
    if (!hashedPassword || hashedPassword === "false") {
      return NextResponse.json(
        { error: true, message: "Erreur lors du hachage du mot de passe" },
        { status: 500 }
      );
    }

    // Met à jour le mot de passe
    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword }, // ✅ TypeScript sait maintenant que c'est un string
    });

    return NextResponse.json({
      success: true,
      message: "Mot de passe mis à jour avec succès",
    });
  } catch (error) {
    console.error("❌ Update password error:", error);
    return NextResponse.json({ error: true, message: "Erreur serveur" }, { status: 500 });
  }
}