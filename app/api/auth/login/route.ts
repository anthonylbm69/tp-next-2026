import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ArgonVerify } from "@/lib/argon2i";
import { createToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("🔐 Login attempt for:", email);

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: true, message: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

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
    console.log("🔑 Password valid:", isPasswordValid);
    

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: true, message: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    // JWT
    const token = createToken({
      userId: user.id,
      email: user.email,
    });

    console.log("🎫 Token created:", token.substring(0, 20) + "...");

    // Cookie HTTP-only
    await setAuthCookie(token);
    console.log("🍪 Cookie set successfully");

    return NextResponse.json({
      error: false,
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

  } catch (e) {
    console.error("💥 Login error:", e);
    return NextResponse.json(
      { error: true, message: "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
}
