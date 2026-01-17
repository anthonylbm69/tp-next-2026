"use client"

import * as React from "react"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUser,
  IconUsers,
  IconFileInvoice,
  IconCreditCard,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type User = {
  name: string
  email: string
  avatar: string
}

const navMain = [
  { title: "Dashboard", url: "#", icon: IconDashboard },
  { title: "Lifecycle", url: "#", icon: IconListDetails },
  { title: "Analytics", url: "#", icon: IconChartBar },
  { title: "Projects", url: "#", icon: IconFolder },
  { title: "Team", url: "#", icon: IconUsers },
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

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setUser(data)
        setIsLoading(false)
      })
      .catch(() => {
        setUser(null)
        setIsLoading(false)
      })
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CloudSync
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        {isLoading ? (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            Loading user...
          </div>
        ) : user ? (
          <NavUser user={user} />
        ) : (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            Not logged in
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}