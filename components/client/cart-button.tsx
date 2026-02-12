"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart-store"
import Link from "next/link"

export function CartButton() {
  const totalItems = useCartStore((state) => state.getTotalItems())

  return (
    <Link href="/panier">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
        <span className="sr-only">Panier ({totalItems})</span>
      </Button>
    </Link>
  )
}
