import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/client/header"
import { Footer } from "@/components/client/footer"
import { ArrowRight, Sparkles, Shield, Truck } from "lucide-react"
import { ProductCard } from "@/components/client/product-card"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: featuredProducts, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6)

  // Fallback to mock data if database is not configured
  const products = error || !featuredProducts ? 
    (await import("@/lib/data/mock-products")).mockProducts.filter(p => p.is_active).slice(0, 6) :
    featuredProducts

  const isDemoMode = !!error

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-accent py-20 md:py-32">
          <div className="container relative z-10 px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight text-secondary-foreground md:text-6xl">
                Bijoux Modernes & Élégants
              </h1>
              <p className="text-pretty mt-6 text-lg leading-relaxed text-secondary-foreground/90 md:text-xl">
                Découvrez notre collection exclusive de bijoux pour homme, femme et enfant. Paiement sécurisé via Orange
                Money et MTN Mobile Money.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/bijoux">
                    Voir le Catalogue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-secondary-foreground/20 bg-card text-foreground hover:bg-card/90"
                >
                  <Link href="/bijoux?audience=femme">Collection Femme</Link>
                </Button>
              </div>
              {isDemoMode && (
                <div className="mt-6 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Mode démo: Configurez la base de données pour une expérience complète.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Decorative background */}
          <div className="absolute inset-0 -z-0 opacity-10">
            <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary blur-3xl" />
            <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-accent blur-3xl" />
          </div>
        </section>

        {/* Features Section */}
        <section className="border-y border-border bg-card py-12">
          <div className="container px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Qualité Premium</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Bijoux soigneusement sélectionnés pour leur qualité et leur élégance
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Paiement Sécurisé</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Orange Money et MTN Mobile Money pour des transactions en toute sécurité
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Livraison Rapide</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Livraison dans tout le Cameroun avec suivi de commande
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        {featuredProducts && featuredProducts.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="container px-4">
              <div className="mb-12 text-center">
                <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Nouveautés</h2>
                <p className="text-pretty mt-4 text-lg text-muted-foreground">
                  Découvrez nos derniers bijoux ajoutés à la collection
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Button asChild size="lg" variant="outline">
                  <Link href="/bijoux">
                    Voir Tous les Bijoux
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Categories Section */}
        <section className="border-t border-border bg-muted py-16 md:py-24">
          <div className="container px-4">
            <div className="mb-12 text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Parcourir par Catégorie</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/bijoux?audience=femme"
                className="group relative overflow-hidden rounded-lg bg-card p-8 shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    Bijoux Femme
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">Colliers, bracelets, boucles d'oreilles...</p>
                </div>
                <div className="absolute right-4 bottom-4 text-6xl opacity-5 group-hover:opacity-10 transition-opacity">
                  ♀
                </div>
              </Link>
              <Link
                href="/bijoux?audience=homme"
                className="group relative overflow-hidden rounded-lg bg-card p-8 shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    Bijoux Homme
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">Montres, bracelets, accessoires...</p>
                </div>
                <div className="absolute right-4 bottom-4 text-6xl opacity-5 group-hover:opacity-10 transition-opacity">
                  ♂
                </div>
              </Link>
              <Link
                href="/bijoux?audience=enfant"
                className="group relative overflow-hidden rounded-lg bg-card p-8 shadow-sm transition-all hover:shadow-md sm:col-span-2 lg:col-span-1"
              >
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    Bijoux Enfant
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">Bijoux adorables et sécurisés...</p>
                </div>
                <div className="absolute right-4 bottom-4 text-6xl opacity-5 group-hover:opacity-10 transition-opacity">
                  👶
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
