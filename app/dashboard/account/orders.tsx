import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OrdersList } from "@/components/orders-list"

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Orders & Invoices</CardTitle>
          <CardDescription>
            View your order history and download invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersList />
        </CardContent>
      </Card>
    </div>
  )
}