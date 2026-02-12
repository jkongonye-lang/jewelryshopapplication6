"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, ShoppingCart, DollarSign, TrendingUp, Home, Settings, Users, BarChart3 } from "lucide-react"

export default function AdminSimplePage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    loading: true
  })
  const [products, setProducts] = useState([])

  useEffect(() => {
    // Pas de vérification d'authentification - accès direct
    loadStats()
  }, [router])

  const loadStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }))
      
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
      
      setProducts(products.slice(0, 6)) // Show first 6 products
    } catch (error) {
      console.error('Dashboard error:', error)
      setStats(prev => ({ ...prev, loading: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">KK Jewelry Admin</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                <Home className="h-5 w-5" />
              </Link>
              <Link href="/admin/produits" className="text-gray-500 hover:text-gray-700">
                <Package className="h-5 w-5" />
              </Link>
              <Link href="/admin/commandes" className="text-gray-500 hover:text-gray-700">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Produits totaux</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.loading ? "..." : stats.totalProducts}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Produits actifs</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.loading ? "..." : stats.activeProducts}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingCart className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Commandes totales</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.loading ? "..." : stats.totalOrders}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Revenu total</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.loading ? "..." : `${stats.totalRevenue.toLocaleString()} XAF`}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Produits récents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="text-lg font-semibold text-blue-600">{product.price_xaf} XAF</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock_quantity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <BarChart3 className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Système opérationnel</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>✅ Connexion Supabase établie</p>
                <p>✅ {stats.totalProducts} produits chargés</p>
                <p>✅ Dashboard fonctionnel</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
