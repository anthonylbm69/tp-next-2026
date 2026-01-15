import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import type { NextRequest } from "next/server"

// GET - Récupérer toutes les méthodes de paiement de l'utilisateur
export async function GET(req: NextRequest) {
  try {
    // Récupérer l'utilisateur connecté depuis le JWT
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return Response.json(
        { error: true, message: "Not authenticated" },
        { status: 401 }
      )
    }

    // Pour l'instant, on retourne un tableau vide
    // Tu devras créer une table PaymentMethod dans Prisma
    const paymentMethods: any[] = []

    return Response.json(paymentMethods)
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: true, message: "Server error" },
      { status: 500 }
    )
  }
}

// POST - Ajouter une nouvelle méthode de paiement
export async function POST(req: NextRequest) {
  try {
    // Récupérer l'utilisateur connecté depuis le JWT
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return Response.json(
        { error: true, message: "Not authenticated" },
        { status: 401 }
      )
    }

    const { stripePaymentMethodId, brand, last4, expiryMonth, expiryYear } =
      await req.json()

    // TODO: Créer la méthode de paiement dans la base
    // const paymentMethod = await prisma.paymentMethod.create({ ... })

    return Response.json({
      error: false,
      message: "Payment method added successfully",
    })
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: true, message: "Server error" },
      { status: 500 }
    )
  }
}