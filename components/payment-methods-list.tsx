"use client"

import { useState, useEffect } from "react"
import { IconCreditCard, IconPlus, IconTrash, IconCheck } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
}

export function PaymentMethodsList() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  async function fetchPaymentMethods() {
    try {
      const response = await fetch("/api/payment/methods")
      if (response.ok) {
        const data = await response.json()
        setPaymentMethods(data)
      } else {
        setError("Failed to load payment methods")
      }
    } catch (error) {
      setError("Error loading payment methods")
    } finally {
      setLoading(false)
    }
  }

  async function handleSetDefault(id: string) {
    try {
      const response = await fetch(`/api/payment/methods/${id}/default`, {
        method: "PATCH",
      })

      if (response.ok) {
        await fetchPaymentMethods()
      }
    } catch (error) {
      console.error("Error updating payment method")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this payment method?")) {
      return
    }

    try {
      const response = await fetch(`/api/payment/methods/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchPaymentMethods()
      }
    } catch (error) {
      console.error("Error deleting payment method")
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading payment methods...</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Add Card
        </Button>
      </div>

      {paymentMethods.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <IconCreditCard className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No payment methods saved</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <Card key={method.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <IconCreditCard className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold capitalize">
                          {method.brand} •••• {method.last4}
                        </p>
                        {method.isDefault && (
                          <Badge variant="default" className="h-5">
                            <IconCheck className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expiryMonth.toString().padStart(2, "0")}/
                        {method.expiryYear}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(method.id)}
                    >
                      <IconTrash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Your payment information is securely stored and encrypted. We use Stripe
          to process payments.
        </p>
      </div>
    </div>
  )
}