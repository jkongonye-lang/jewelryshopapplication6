import { Suspense } from "react"
import { Header } from "@/components/client/header"
import { Footer } from "@/components/client/footer"
import { ProductCard } from "@/components/client/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/server"

interface SearchParams {
  audience?: string
  category?: string
}

async function CatalogContent({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient()

  let query = supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*)
    `,
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  // Filter by audience if specified
  if (searchParams.audience) {
    query = query.eq("categories.target_audience", searchParams.audience)
  }

  // Filter by category if specified
  if (searchParams.category) {
    query = query.eq("category_id", searchParams.category)
  }

  const { data: products, error } = await query

  // Fallback to mock data if database is not configured
  if (error || !products) {
    console.warn("Database not configured, using mock data:", error?.message)
    const { mockProducts } = await import("@/lib/data/mock-products")
    
    let filteredProducts = mockProducts.filter(p => p.is_active)
    
    if (searchParams.audience) {
      filteredProducts = filteredProducts.filter(p => 
        p.category?.target_audience === searchParams.audience
      )
    }
    
    return (
      <div className="container px-4 py-12">
        <div className="mb-8">
          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            {searchParams.audience
              ? `Bijoux ${searchParams.audience.charAt(0).toUpperCase() + searchParams.audience.slice(1)}`
              : "Notre Catalogue"}
          </h1>
          <p className="text-pretty mt-2 text-muted-foreground">
            {filteredProducts.length} bijou{filteredProducts.length > 1 ? "x" : ""} disponible
            {filteredProducts.length > 1 ? "s" : ""}
          </p>
          <div className="mt-4 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ Mode démo: Utilisation des données de démonstration. 
              <a href="/DATABASE_SETUP.md" className="underline ml-1">Configurez la base de données</a> pour une expérience complète.
            </p>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-lg font-medium text-muted-foreground">Aucun bijou disponible pour le moment</p>
            <p className="mt-2 text-sm text-muted-foreground">Revenez bientôt pour découvrir nos nouveautés</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container px-4 py-12">
      <div className="mb-8">
        <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
          {searchParams.audience
            ? `Bijoux ${searchParams.audience.charAt(0).toUpperCase() + searchParams.audience.slice(1)}`
            : "Notre Catalogue"}
        </h1>
        <p className="text-pretty mt-2 text-muted-foreground">
          {products?.length || 0} bijou{(products?.length || 0) > 1 ? "x" : ""} disponible
          {(products?.length || 0) > 1 ? "s" : ""}
        </p>
      </div>

      {products && products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-lg font-medium text-muted-foreground">Aucun bijou disponible pour le moment</p>
          <p className="mt-2 text-sm text-muted-foreground">Revenez bientôt pour découvrir nos nouveautés</p>
        </div>
      )}
    </div>
  )
}

function CatalogSkeleton() {
  return (
    <div className="container px-4 py-12">
      <div className="mb-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-2 h-6 w-40" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function CatalogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogContent searchParams={resolvedSearchParams} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
