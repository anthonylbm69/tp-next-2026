import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

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

try {
    // 1. D'abord, vérifie quels utilisateurs existent
    const users = await db.user.findMany();
    console.log("📋 Utilisateurs existants:", users);

    // 2. Si tu as des utilisateurs, utilise le premier
    if (users.length > 0) {
        const firstUserId = users[0].id;
        console.log(`Création d'une commande pour l'utilisateur ID: ${firstUserId}`);
        
        const result = await db.order.create({
            data: {
                userId: firstUserId, // Utilise un ID qui existe vraiment
                stripeSessionId: "test_" + Date.now(),
                totalAmount: 20,
                status: "pending"
            }
        });
        console.log("✅ SUCCÈS PRISMA :", result);
    } else {
        console.log("⚠️ Aucun utilisateur trouvé, créons-en un d'abord");
        
        // Crée un utilisateur d'abord
        const newUser = await db.user.create({
            data: {
                email: "test@example.com",
                firstName: "Test",
                lastName: "User",
                password: "hashedpassword123"
            }
        });
        console.log("✅ Utilisateur créé:", newUser);
        
        // Ensuite crée la commande
        const result = await db.order.create({
            data: {
                userId: newUser.id,
                stripeSessionId: "test_" + Date.now(),
                totalAmount: 20,
                status: "pending"
            }
        });
        console.log("✅ Commande créée:", result);
    }
} catch (error: any) {
    console.error("❌ ERREUR PRISMA DÉTAILLÉE :");
    console.error("Message:", error.message);
    console.error("Code erreur:", error.code);
    console.error("Meta:", error.meta);
}