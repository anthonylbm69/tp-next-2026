import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  
  if (!token) {
    redirect("/login");
  }

  let userId: number;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    userId = Number(payload.userId || payload.id);
  } catch (err) {
    redirect("/login");
  }

  const lastOrder = await db.order.findFirst({
    where: { 
      userId: userId,
      status: "paid" 
    },
    include: {
      product: true 
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  const product = lastOrder?.product; 
  const productId = product?.id;

  let subscriptionData = {
    planName: "Gratuit",
    storage: "500 Mo",
    usersLimit: "1",
    history: "7 jours",
    price: 0
  };

  if (productId === 1) {
    subscriptionData = {
      planName: "Starter",
      storage: "5 Go",
      usersLimit: "3",
      history: "30 jours",
      price: 20
    };
  } else if (productId === 2) {
    subscriptionData = {
      planName: "Pro",
      storage: "100 Go",
      usersLimit: "Illimité",
      history: "Illimité",
      price: 50
    };
  } else if (productId === 3) {
    subscriptionData = {
      planName: "Enterprise",
      storage: "Illimité",
      usersLimit: "Illimité",
      history: "Illimité",
      price: 100
    };
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards data={subscriptionData} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
