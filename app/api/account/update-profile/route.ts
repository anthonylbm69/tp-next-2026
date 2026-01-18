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

    const { firstName, lastName } = await req.json();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: true, message: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    await db.user.update({
      where: { id: userId },
      data: { firstName, lastName },
    });

    return NextResponse.json({
      success: true,
      message: "Informations mises à jour avec succès",
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);
    return NextResponse.json({ error: true, message: "Erreur serveur" }, { status: 500 });
  }
}