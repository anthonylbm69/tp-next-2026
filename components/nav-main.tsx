"use client"

import { IconCreditCard, IconReceipt2, IconCirclePlusFilled, IconMail } from "@tabler/icons-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* --- NAVIGATION PRINCIPALE --- */}
        <SidebarMenu>
          
          {/* Item : Abonnement */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Abonnement">
              <Link href="/subscriptions">
                <IconCreditCard />
                <span>Abonnement</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Item : Factures */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Factures">
              <Link href="/invoices">
                <IconReceipt2 />
                <span>Factures</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}