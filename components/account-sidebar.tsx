"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconUser, IconFileInvoice, IconCreditCard } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

const accountLinks = [
  {
    title: "Account",
    url: "/dashboard/account",
    icon: IconUser,
  },
  {
    title: "Orders",
    url: "/dashboard/account/orders",
    icon: IconFileInvoice,
  },
  {
    title: "Payments",
    url: "/dashboard/account/payments",
    icon: IconCreditCard,
  },
]

export function AccountSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-sidebar h-full p-4">
      <div className="space-y-1">
        <h2 className="mb-4 px-4 text-lg font-semibold">Account Settings</h2>
        {accountLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.url

          return (
            <Link
              key={link.url}
              href={link.url}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                isActive && "bg-accent text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.title}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}