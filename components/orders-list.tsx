"use client"

import { useState, useEffect } from "react"
import { IconDownload, IconFileInvoice } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Order {
  id: number
  stripeSessionId: string
  stripeInvoiceId: string | null
  invoicePdfUrl: string | null
  invoiceNumber: string | null
  status: string
  totalAmount: number
  createdAt: string
}

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/orders")
        if (response.ok) {
          const data = await response.json()
          setOrders(data)
        } else {
          setError("Failed to load orders")
        }
      } catch (error) {
        setError("Error loading orders")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  function getStatusBadge(status: string) {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
    }

    return (
      <Badge variant={variants[status] || "secondary"}>
        {status}
      </Badge>
    )
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading orders...</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <IconFileInvoice className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No orders yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold">Order #{order.id}</p>
              {getStatusBadge(order.status)}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(order.createdAt)}
            </p>
            {order.invoiceNumber && (
              <p className="text-xs text-muted-foreground">
                Invoice: {order.invoiceNumber}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <p className="text-lg font-bold">€{order.totalAmount.toFixed(2)}</p>
            {order.invoicePdfUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(order.invoicePdfUrl!, "_blank")}
              >
                <IconDownload className="h-4 w-4 mr-2" />
                Invoice
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}