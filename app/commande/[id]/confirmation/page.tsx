"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/client/header"
import { Footer } from "@/components/client/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createBrowserClient } from "@/lib/supabase/client"
import { formatPrice, formatDate } from "@/lib/utils/format"
import { toast } from "sonner"
import { CheckCircle, Loader2, Package, Phone, MapPin } from "lucide-react"
import type { Order } from "@/lib/db/types"
import Link from "next/link"

export default function ConfirmationPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    async function fetchOrder() {
      const { data, error } = await supabase.from("orders").select("*").eq("id", params.id).single()

      if (error || !data) {
        toast.error("Commande introuvable")
        router.push("/")
        return
      }

      if (data.payment_status !== "success") {
        toast.error("Paiement non confirmé")
        router.push(`/commande/${params.id}/paiement`)
        return
      }

      setOrder(data)
      setIsLoading(false)
    }

    fetchOrder()
  }, [params.id, router, supabase])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted">
        <div className="container px-4 py-12">
          <div className="mx-auto max-w-2xl">
            {/* Success Message */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-balance text-3xl font-bold tracking-tight">Commande confirmée !</h1>
              <p className="mt-2 text-muted-foreground">Merci pour votre achat</p>
            </div>

            {/* Order Details */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Détails de la commande</CardTitle>
                <CardDescription>Commande {order.order_number}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="font-medium">Montant payé</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(order.total_xaf)}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Package className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">Statut</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {order.status === "paid" ? "Payé - En préparation" : order.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">Contact</p>
                      <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                      {order.customer_email && <p className="text-sm text-muted-foreground">{order.customer_email}</p>}
                    </div>
                  </div>

                  {order.delivery_address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">Adresse de livraison</p>
                        <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground">Date de commande: {formatDate(order.created_at)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Prochaines étapes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Préparation de votre commande</p>
                    <p className="text-sm text-muted-foreground">Nous préparons soigneusement vos bijoux</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Livraison</p>
                    <p className="text-sm text-muted-foreground">Nous vous contacterons pour organiser la livraison</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Profitez de vos bijoux</p>
                    <p className="text-sm text-muted-foreground">Recevez et admirez vos nouveaux bijoux</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="flex-1" size="lg">
                <Link href="/bijoux">Continuer mes achats</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent" size="lg">
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </div>

            {/* Contact Info */}
            <Card className="mt-6 border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <p className="text-sm leading-relaxed">
                  <strong>Besoin d'aide ?</strong> Contactez-nous au +237 670 000 000 ou par email à
                  contact@kkjewelry.com
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
