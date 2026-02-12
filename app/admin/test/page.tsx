"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createBrowserClient } from "@/lib/supabase/client"

export default function AdminTestPage() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const auth = localStorage.getItem("admin_authenticated")
    if (!auth) {
      router.push("/admin/login")
      return
    }

    loadStats()
  }, [router])

  const loadStats = async () => {
    try {
      const supabase = createBrowserClient()
      
      const { data: products } = await supabase
        .from("products")
        .select("count")
        .single()
      
      const { data: orders } = await supabase
        .from("orders")
        .select("count")
        .single()

      setStats({
        products: products?.count || 0,
        orders: orders?.count || 0,
        lastUpdate: new Date().toLocaleString()
      })
    } catch (error) {
      setStats({ error: error.message })
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Test Dashboard - Connexion Supabase</CardTitle>
        </CardHeader>
        <CardContent>
          {stats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded">
                  <h3 className="font-semibold text-green-800">Produits</h3>
                  <p className="text-2xl font-bold text-green-600">{stats.products}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded">
                  <h3 className="font-semibold text-blue-800">Commandes</h3>
                  <p className="text-2xl font-bold text-blue-600">{stats.orders}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Dernière mise à jour: {stats.lastUpdate}
              </div>
              {stats.error && (
                <div className="p-4 bg-red-50 rounded text-red-800">
                  Erreur: {stats.error}
                </div>
              )}
            </div>
          ) : (
            <div className="text-lg">Chargement...</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
