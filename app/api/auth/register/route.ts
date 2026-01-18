import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ArgonHash } from "@/lib/argon2i";
import { createToken, setAuthCookie } from "@/lib/auth";
import { Mregister } from "@/middleware/register";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, confirmPassword, firstName, lastName } = body;

    // Validation des champs requis
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      return NextResponse.json(
        { error: true, message: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // ✅ Validation avec le middleware
    const validationErrors = Mregister(body);
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: true, 
          message: validationErrors[0].message,
          code: validationErrors[0].code,
          errors: validationErrors
        },
        { status: 400 }
      );
    }

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: true, message: "Cet email est déjà utilisé", code: "E03" },
        { status: 400 }
      );
    }

    // Hash le mot de passe avec Argon2
    const hashedPassword = await ArgonHash(password);

    if (!hashedPassword || hashedPassword === "false") {
      return NextResponse.json(
        { error: true, message: "Échec du hash du mot de passe", code: "E07" },
        { status: 500 }
      );
    }

    // Crée l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    // ✅ Crée un Order Free par défaut (productId: 4)
    await prisma.order.create({
      data: {
        userId: user.id,
        stripeSessionId: `free_${Date.now()}`,
        totalAmount: 0,
        productId: 4,
        status: "paid",
      },
    });

    // Crée le token JWT
    const token = createToken({
      userId: user.id,
      email: user.email,
    });

    // Set le cookie d'authentification
    await setAuthCookie(token);

    console.log("✅ User registered:", user.email);

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
    console.error("💥 Register error:", e);

    // Gestion des erreurs Prisma
    if (e.code === "P2002") {
      return NextResponse.json(
        { error: true, message: "Cet email est déjà utilisé", code: "E03" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: true, message: "Erreur lors de la création du compte", code: "E08" },
      { status: 500 }
    );
  }
}