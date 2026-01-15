import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import type { NextRequest } from "next/server"

// GET - Récupérer le profil utilisateur
export async function GET(req: NextRequest) {
  try {
    console.log("🔍 Fetching profile...")
    
    // Récupérer l'utilisateur connecté depuis le JWT
    const currentUser = await getCurrentUser()
    console.log("👤 Current user:", currentUser)

    if (!currentUser) {
      console.log("❌ No user found in JWT")
      return Response.json(
        { error: true, message: "Not authenticated" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    })

    console.log("✅ User from DB:", user)

    if (!user) {
      return Response.json(
        { error: true, message: "User not found" },
        { status: 404 }
      )
    }

    return Response.json(user)
  } catch (error) {
    console.error("💥 Error:", error)
    return Response.json(
      { error: true, message: "Server error" },
      { status: 500 }
    )
  }
}

// PATCH - Modifier le profil utilisateur
export async function PATCH(req: NextRequest) {
  try {
    console.log("🔍 Updating profile...")
    
    // Récupérer l'utilisateur connecté depuis le JWT
    const currentUser = await getCurrentUser()
    console.log("👤 Current user:", currentUser)

    if (!currentUser) {
      console.log("❌ No user found in JWT")
      return Response.json(
        { error: true, message: "Not authenticated" },
        { status: 401 }
      )
    }

    const { firstName, lastName, email } = await req.json()

    // Validation simple
    if (!firstName || !lastName || !email) {
      return Response.json(
        { error: true, message: "All fields are required" },
        { status: 400 }
      )
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
        NOT: { id: currentUser.userId },
      },
    })

    if (existingUser) {
      return Response.json(
        { error: true, message: "Email already in use" },
        { status: 400 }
      )
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.userId },
      data: { firstName, lastName, email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    })

    console.log("✅ Updated user:", updatedUser)

    return Response.json({
      error: false,
      message: "Profile updated successfully",
      data: updatedUser,
    })
  } catch (error: any) {
    console.error("💥 Error:", error)

    if (error.code === "P2002") {
      return Response.json(
        { error: true, message: "Email already in use" },
        { status: 400 }
      )
    }

    return Response.json(
      { error: true, message: "Server error" },
      { status: 500 }
    )
  }
}