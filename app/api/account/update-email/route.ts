import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

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

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: true, message: "Email requis" }, { status: 400 });
    }

    // Vérifie si l'email est déjà utilisé
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json(
        { error: true, message: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    await db.user.update({
      where: { id: userId },
      data: { email: email.toLowerCase() },
    });

    return NextResponse.json({
      success: true,
      message: "Email mis à jour avec succès",
    });
  } catch (error) {
    console.error("❌ Update email error:", error);
    return NextResponse.json({ error: true, message: "Erreur serveur" }, { status: 500 });
  }
}