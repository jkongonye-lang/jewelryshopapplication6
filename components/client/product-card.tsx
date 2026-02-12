import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils/format"
import type { Product } from "@/lib/db/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : "/bijou.jpg"

  return (
    <Link href={`/produit/${product.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge variant="secondary">Rupture de stock</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-balance line-clamp-2 font-semibold text-foreground">{product.title}</h3>
          {product.category && <p className="mt-1 text-sm text-muted-foreground capitalize">{product.category.name}</p>}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex w-full items-center justify-between">
            <span className="text-lg font-bold text-primary">{formatPrice(product.price_xaf)}</span>
            {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
              <Badge variant="outline" className="text-xs">
                {product.stock_quantity} restant{product.stock_quantity > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
