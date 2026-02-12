"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminNav } from "@/components/admin/admin-nav"
import Link from "next/link"
import { ProductForm } from "@/components/admin/product-form"

export default function NewProductPage() {
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

  const categories = [
    { id: "1", name: "Colliers", slug: "colliers" },
    { id: "2", name: "Bracelets", slug: "bracelets" },
    { id: "3", name: "Boucles d'oreilles", slug: "boucles-oreilles" },
    { id: "4", name: "Bagues", slug: "bagues" },
    { id: "5", name: "Montres", slug: "montres" },
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
              <span className="text-xs text-muted-foreground">Nouveau produit</span>
            </div>
          </Link>
          <AdminNav />
        </div>
      </header>

      <main className="flex-1 bg-muted">
        <div className="container px-4 py-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <h1 className="text-balance text-3xl font-bold tracking-tight">Ajouter un produit</h1>
              <p className="text-muted-foreground">Créez un nouveau bijou pour votre catalogue</p>
            </div>
            <ProductForm categories={categories} />
          </div>
        </div>
      </main>
    </div>
  )
}
