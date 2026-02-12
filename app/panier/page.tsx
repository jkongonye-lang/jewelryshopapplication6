"use client"

import { Header } from "@/components/client/header"
import { Footer } from "@/components/client/footer"
import { useCartStore } from "@/lib/store/cart-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils/format"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container px-4 py-12">
            <div className="mx-auto max-w-2xl">
              <h1 className="text-balance mb-8 text-3xl font-bold tracking-tight">Votre Panier</h1>
              <Card>
                <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
                  <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
                  <h2 className="mb-2 text-xl font-semibold">Votre panier est vide</h2>
                  <p className="mb-6 text-muted-foreground">Ajoutez des bijoux pour commencer vos achats</p>
                  <Button asChild>
                    <Link href="/bijoux">Découvrir nos bijoux</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-12">
          <h1 className="text-balance mb-8 text-3xl font-bold tracking-tight">Votre Panier</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <Card key={item.product.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={
                            item.product.images && item.product.images.length > 0
                              ? item.product.images[0]
                              : "/bijou.jpg"
                          }
                          alt={item.product.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link
                            href={`/produit/${item.product.id}`}
                            className="font-semibold hover:text-primary transition-colors"
                          >
                            {item.product.title}
                          </Link>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatPrice(item.product.price_xaf)} x {item.quantity}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const value = Number.parseInt(e.target.value)
                                if (value >= 1 && value <= item.product.stock_quantity) {
                                  updateQuantity(item.product.id, value)
                                }
                              }}
                              className="h-8 w-16 text-center"
                              min={1}
                              max={item.product.stock_quantity}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock_quantity}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-semibold">{formatPrice(item.product.price_xaf * item.quantity)}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => removeItem(item.product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Supprimer</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-bold">Récapitulatif</h2>

                  <div className="space-y-3 border-b border-border pb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Articles ({getTotalItems()})</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Livraison</span>
                      <span className="text-muted-foreground">À calculer</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between border-b border-border pb-4">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold text-primary">{formatPrice(getTotalPrice())}</span>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button asChild className="w-full" size="lg">
                      <Link href="/commande">Passer la commande</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href="/bijoux">Continuer mes achats</Link>
                    </Button>
                  </div>

                  <div className="mt-6 rounded-lg bg-muted p-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Paiement sécurisé via <strong>Orange Money</strong> ou <strong>MTN Mobile Money</strong>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
