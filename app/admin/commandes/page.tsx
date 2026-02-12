"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminNav } from "@/components/admin/admin-nav"
import Link from "next/link"
import { OrdersTable } from "@/components/admin/orders-table"

export default function AdminOrdersPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem("admin_authenticated")
    if (!auth) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!isAuthenticated) {
    return null
  }

  const orders = [
    {
      id: "1",
      order_number: "CMD-2024-001",
      customer_name: "Marie Dupont",
      customer_phone: "+237 6XX XX XX XX",
      customer_email: "marie@example.com",
      total_xaf: 45000,
      status: "paid",
      payment_status: "success",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      order_number: "CMD-2024-002",
      customer_name: "Jean Martin",
      customer_phone: "+237 6XX XX XX XX",
      customer_email: "jean@example.com",
      total_xaf: 32000,
      status: "pending",
      payment_status: "pending",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      order_number: "CMD-2024-003",
      customer_name: "Sophie Laurent",
      customer_phone: "+237 6XX XX XX XX",
      customer_email: "sophie@example.com",
      total_xaf: 78000,
      status: "completed",
      payment_status: "success",
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <span className="text-xl font-bold text-primary-foreground">KK</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none">Admin KK Jewelry</span>
              <span className="text-xs text-muted-foreground">Gestion des commandes</span>
            </div>
          </Link>
          <AdminNav />
        </div>
      </header>

      <main className="flex-1 bg-muted">
        <div className="container px-4 py-8">
          <div className="mb-8">
            <h1 className="text-balance text-3xl font-bold tracking-tight">Commandes</h1>
            <p className="text-muted-foreground">{orders.length} commande(s) au total</p>
          </div>

          <OrdersTable orders={orders} />
        </div>
      </main>
    </div>
  )
}
