"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminNav } from "@/components/admin/admin-nav"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ProductsTable } from "@/components/admin/products-table"
import { mockProducts } from "@/lib/data/mock-products"

export default function AdminProductsPage() {
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

  const products = mockProducts.map((p) => ({
    ...p,
    category: { id: p.id, name: p.category, slug: p.category },
  }))

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
              <span className="text-xs text-muted-foreground">Gestion des produits</span>
            </div>
          </Link>
          <AdminNav />
        </div>
      </header>

      <main className="flex-1 bg-muted">
        <div className="container px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-balance text-3xl font-bold tracking-tight">Produits</h1>
              <p className="text-muted-foreground">{products.length} produit(s) au total</p>
            </div>
            <Button asChild>
              <Link href="/admin/produits/nouveau">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un produit
              </Link>
            </Button>
          </div>

          <ProductsTable products={products} />
        </div>
      </main>
    </div>
  )
}
