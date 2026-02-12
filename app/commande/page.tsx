"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/client/header"
import { Footer } from "@/components/client/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCartStore } from "@/lib/store/cart-store"
import { formatPrice, generateOrderNumber } from "@/lib/utils/format"
import { createBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    delivery_address: "",
    notes: "",
  })
  const router = useRouter()
  const supabase = createBrowserClient()

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container px-4 py-12">
            <Card className="mx-auto max-w-md">
              <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
                <p className="text-lg font-medium">Votre panier est vide</p>
                <Button asChild className="mt-4">
                  <Link href="/bijoux">Voir les bijoux</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderNumber = generateOrderNumber()
      const totalAmount = getTotalPrice()

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            order_number: orderNumber,
            ...formData,
            total_xaf: totalAmount,
            status: "pending",
            payment_status: "pending",
          },
        ])
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_title: item.product.title,
        product_image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : null,
        quantity: item.quantity,
        unit_price_xaf: item.product.price_xaf,
        subtotal_xaf: item.product.price_xaf * item.quantity,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      clearCart()
      toast.success("Commande créée avec succès!")
      router.push(`/commande/${order.id}/paiement`)
    } catch (error: any) {
      toast.error("Erreur lors de la création de la commande: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted">
        <div className="container px-4 py-12">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/panier">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au panier
            </Link>
          </Button>

          <h1 className="text-balance mb-8 text-3xl font-bold tracking-tight">Finaliser la commande</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de livraison</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        value={formData.customer_name}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                        required
                        placeholder="Votre nom complet"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                        required
                        placeholder="+237 6XX XXX XXX"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.customer_email}
                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                        placeholder="votre@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse de livraison *</Label>
                      <Textarea
                        id="address"
                        value={formData.delivery_address}
                        onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                        required
                        placeholder="Votre adresse complète"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (optionnel)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Instructions spéciales pour la livraison..."
                        rows={2}
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Traitement..." : "Continuer vers le paiement"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-muted">
                          <Image
                            src={
                              item.product.images && item.product.images.length > 0
                                ? item.product.images[0]
                                : "/bijou.jpg"
                            }
                            alt={item.product.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium line-clamp-1">{item.product.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {formatPrice(item.product.price_xaf)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(getTotalPrice())}</span>
                    </div>
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
