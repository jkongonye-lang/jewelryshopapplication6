"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/lib/store/cart-store"
import type { Product } from "@/lib/db/types"
import { useRouter } from "next/navigation"

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const router = useRouter()

  const handleAddToCart = () => {
    setIsAdding(true)
    addItem(product, quantity)

    setTimeout(() => {
      setIsAdding(false)
      router.push("/panier")
    }, 300)
  }

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (product.stock_quantity === 0) {
    return (
      <Button disabled className="w-full" size="lg">
        Rupture de stock
      </Button>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Quantité:</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => {
              const value = Number.parseInt(e.target.value)
              if (value >= 1 && value <= product.stock_quantity) {
                setQuantity(value)
              }
            }}
            className="w-20 text-center"
            min={1}
            max={product.stock_quantity}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={incrementQuantity}
            disabled={quantity >= product.stock_quantity}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {product.stock_quantity <= 5 && (
          <span className="text-sm text-muted-foreground">
            ({product.stock_quantity} disponible{product.stock_quantity > 1 ? "s" : ""})
          </span>
        )}
      </div>

      <Button onClick={handleAddToCart} disabled={isAdding} className="w-full" size="lg">
        <ShoppingCart className="mr-2 h-5 w-5" />
        {isAdding ? "Ajout en cours..." : "Ajouter au panier"}
      </Button>
    </div>
  )
}
