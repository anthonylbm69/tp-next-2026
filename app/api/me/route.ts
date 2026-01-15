import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    console.log("📍 /api/me called");
    
    // Récupérer l'utilisateur connecté depuis le JWT
    const currentUser = await getCurrentUser();
    console.log("🔐 Current user from JWT:", currentUser);

    if (!currentUser) {
      console.log("❌ No current user found");
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer les données complètes depuis Prisma
    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    console.log("👤 User from database:", user);

    if (!user) {
      console.log("❌ User not found in database");
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Retourner les données formatées pour NavUser
    const response = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
    };

    console.log("✅ Sending response:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("💥 Get user error:", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, OPTIONS',
    },
  });
}