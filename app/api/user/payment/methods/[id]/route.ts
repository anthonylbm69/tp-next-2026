import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import type { NextRequest } from "next/server"

// PATCH - Définir une méthode de paiement comme défaut
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récupérer l'utilisateur connecté depuis le JWT
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return Response.json(
        { error: true, message: "Not authenticated" },
        { status: 401 }
      )
    }

    const paymentMethodId = params.id

    // TODO: Mettre à jour les méthodes de paiement
    // 1. Mettre toutes les cartes à isDefault = false
    // 2. Mettre la carte sélectionnée à isDefault = true

    return Response.json({
      error: false,
      message: "Default payment method updated",
    })
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: true, message: "Server error" },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une méthode de paiement
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récupérer l'utilisateur connecté depuis le JWT
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return Response.json(
        { error: true, message: "Not authenticated" },
        { status: 401 }
      )
    }

    const paymentMethodId = params.id

    // TODO: Supprimer la méthode de paiement
    // await prisma.paymentMethod.delete({ where: { id: paymentMethodId } })

    return Response.json({
      error: false,
      message: "Payment method deleted",
    })
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: true, message: "Server error" },
      { status: 500 }
    )
  }
}