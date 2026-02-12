"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/client/header"
import { Footer } from "@/components/client/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createBrowserClient } from "@/lib/supabase/client"
import { formatPrice, formatDate } from "@/lib/utils/format"
import { toast } from "sonner"
import { Loader2, Package, Clock, CheckCircle, XCircle } from "lucide-react"
import type { Order } from "@/lib/db/types"

export default function TrackingPage({ params }: { params: { id: string } }) {
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

      setOrder(data)
      setIsLoading(false)
    }

    fetchOrder()

    // Set up real-time subscription for order updates
    const channel = supabase
      .channel(`order-${params.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${params.id}` },
        (payload) => {
          setOrder(payload.new as Order)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [params.id, router, supabase])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-8 w-8 text-yellow-600" />
      case "paid":
      case "processing":
        return <Package className="h-8 w-8 text-blue-600" />
      case "completed":
        return <CheckCircle className="h-8 w-8 text-green-600" />
      case "cancelled":
        return <XCircle className="h-8 w-8 text-red-600" />
      default:
        return <Package className="h-8 w-8 text-muted-foreground" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "En attente de paiement",
      paid: "Payé - En préparation",
      processing: "En cours de traitement",
      completed: "Livré",
      cancelled: "Annulé",
    }
    return labels[status] || status
  }

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
            <h1 className="text-balance mb-8 text-3xl font-bold tracking-tight">Suivi de commande</h1>

            {/* Order Status */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Commande {order.order_number}</CardTitle>
                    <CardDescription>Passée le {formatDate(order.created_at)}</CardDescription>
                  </div>
                  {getStatusIcon(order.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Statut actuel</span>
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "default"
                          : order.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-base"
                    >
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="font-medium">Montant total</span>
                    <span className="text-xl font-bold text-primary">{formatPrice(order.total_xaf)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Historique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.created_at && (
                    <div className="flex gap-4">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                          order.status !== "pending" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Commande passée</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                  )}

                  {order.payment_status === "success" && (
                    <div className="flex gap-4">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                          order.status === "paid" || order.status === "processing" || order.status === "completed"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Paiement confirmé</p>
                        <p className="text-sm text-muted-foreground">Votre paiement a été reçu</p>
                      </div>
                    </div>
                  )}

                  {(order.status === "processing" || order.status === "completed") && (
                    <div className="flex gap-4">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                          order.status === "completed" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">En préparation</p>
                        <p className="text-sm text-muted-foreground">Vos bijoux sont en cours de préparation</p>
                      </div>
                    </div>
                  )}

                  {order.status === "completed" && order.completed_at && (
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Commande livrée</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.completed_at)}</p>
                      </div>
                    </div>
                  )}

                  {order.status === "cancelled" && order.cancelled_at && (
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                        <XCircle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Commande annulée</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.cancelled_at)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="mt-6 border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <p className="text-sm leading-relaxed">
                  <strong>Des questions ?</strong> Contactez-nous au +237 670 000 000 avec votre numéro de commande{" "}
                  {order.order_number}
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
