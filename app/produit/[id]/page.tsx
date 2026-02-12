import { notFound } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/client/header"
import { Footer } from "@/components/client/footer"
import { formatPrice } from "@/lib/utils/format"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/client/add-to-cart-button"
import { Package, Ruler, Weight } from "lucide-react"
import { mockProducts } from "@/lib/data/mock-products"

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = mockProducts.find((p) => p.id === params.id && p.is_active)

  if (!product) {
    notFound()
  }

  const images = product.images && product.images.length > 0 ? product.images : ["/bijou.jpg"]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                  src={images[0] || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.slice(1, 5).map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.title} - Image ${index + 2}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 25vw, 12vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                {product.category && (
                  <Badge variant="secondary" className="mb-3">
                    {product.category.name}
                  </Badge>
                )}
                <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">{product.title}</h1>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-primary">{formatPrice(product.price_xaf)}</span>
                </div>
              </div>

              {product.description && (
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Description</h2>
                  <p className="leading-relaxed text-muted-foreground">{product.description}</p>
                </div>
              )}

              {/* Product Details */}
              <div className="space-y-3 border-t border-border pt-6">
                <h2 className="text-lg font-semibold">Détails du produit</h2>
                <div className="grid gap-3">
                  {product.material && (
                    <div className="flex items-center gap-3 text-sm">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Matériau:</span>
                      <span className="text-muted-foreground">{product.material}</span>
                    </div>
                  )}
                  {product.weight_grams && (
                    <div className="flex items-center gap-3 text-sm">
                      <Weight className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Poids:</span>
                      <span className="text-muted-foreground">{product.weight_grams}g</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex items-center gap-3 text-sm">
                      <Ruler className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Dimensions:</span>
                      <span className="text-muted-foreground">{product.dimensions}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Disponibilité:</span>
                    <span className={product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}>
                      {product.stock_quantity > 0 ? `En stock (${product.stock_quantity})` : "Rupture de stock"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="border-t border-border pt-6">
                <AddToCartButton product={product} />
              </div>

              {/* Payment Info */}
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Paiement sécurisé via <strong>Orange Money</strong> ou <strong>MTN Mobile Money</strong>. Livraison
                  dans tout le Cameroun.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
