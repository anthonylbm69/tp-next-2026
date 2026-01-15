import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ArgonHash } from "@/lib/argon2i";
import { createToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, confirmPassword, firstName, lastName } = body;

    // Validation
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      return NextResponse.json(
        { error: true, message: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: true, message: "Les mots de passe ne correspondent pas" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: true, message: "Le mot de passe doit contenir au moins 6 caractères" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: true, message: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }
    
    const hashedPassword = await ArgonHash(password);

    if (!hashedPassword || hashedPassword === "false") {
      return NextResponse.json(
        { error: true, message: "Échec du hash du mot de passe", code: "E02" },
        { status: 500 }
      );
    }

    // Création utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    // JWT
    const token = createToken({
      userId: user.id,
      email: user.email,
    });

    // Cookie HTTP-only
    await setAuthCookie(token);

    return NextResponse.json({
      error: false,
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    }, { status: 201 });

  } catch (e: any) {
    console.error("Register error:", e);

    if (e.code === "P2002") {
      return NextResponse.json(
        { error: true, message: "Cet email est déjà utilisé", code: "E03" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: true, message: "Erreur serveur", code: "E02" },
      { status: 500 }
    );
  }
}
