"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react"
import { formatPrice } from "@/lib/utils/format"
import { AdminNav } from "@/components/admin/admin-nav"
import Link from "next/link"

export default function AdminDashboardSimplePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    loading: true
  })

  useEffect(() => {
    const auth = localStorage.getItem("admin_authenticated")
    if (!auth) {
      router.push("/admin/login")
      return
    }
    setIsAuthenticated(true)
    loadStats()
  }, [router])

  const loadStats = async () => {
    try {
      const supabaseUrl = 'https://dhcadcfrthoyicpoqktf.supabase.co'
      const supabaseKey = 'sb_publishable_bJRxARRfUDL3PRqcCv0Y8w_Eydz8fWP'
      
      // Load products
      const productsResponse = await fetch(`${supabaseUrl}/rest/v1/products`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      })
      
      const products = productsResponse.ok ? await productsResponse.json() : []
      
      // Load orders
      const ordersResponse = await fetch(`${supabaseUrl}/rest/v1/orders`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      })
      
      const orders = ordersResponse.ok ? await ordersResponse.json() : []
      
      const totalProducts = products.length
      const activeProducts = products.filter(p => p.is_active && p.stock_quantity > 0).length
      const totalOrders = orders.length
      const pendingOrders = orders.filter(o => o.status === 'pending').length
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_xaf, 0)
      
      setStats({
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        totalRevenue,
        loading: false
      })
    } catch (error) {
      console.error('Dashboard error:', error)
      setStats(prev => ({ ...prev, loading: false }))
    }
  }

  if (!isAuthenticated) {
    return <div className="flex min-h-screen items-center justify-center">Chargement...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/admin/dashboard-simple" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <span className="text-xl font-bold text-primary-foreground">KK</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none">Admin KK Jewelry</span>
              <span className="text-xs text-muted-foreground">Tableau de bord</span>
            </div>
          </Link>
          <AdminNav />
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits totaux</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.loading ? "..." : stats.totalProducts}
              </div>
              <p className="text-xs text-muted-foreground">
                Produits dans le catalogue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits actifs</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.loading ? "..." : stats.activeProducts}
              </div>
              <p className="text-xs text-muted-foreground">
                En stock et disponibles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes totales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.loading ? "..." : stats.totalOrders}
              </div>
              <p className="text-xs text-muted-foreground">
                Toutes les commandes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenu total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.loading ? "..." : formatPrice(stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Depuis le début
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>État de la connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stats.loading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                <span className="text-sm">
                  {stats.loading ? 'Chargement...' : 'Connecté à Supabase'}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Dernière mise à jour: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
