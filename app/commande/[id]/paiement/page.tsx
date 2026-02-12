"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/client/header"
import { Footer } from "@/components/client/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { createBrowserClient } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils/format"
import { toast } from "sonner"
import { Loader2, CreditCard, Smartphone } from "lucide-react"
import type { Order } from "@/lib/db/types"

export default function PaymentPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<"orange_money" | "mtn_money">("orange_money")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
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
      setPhoneNumber(data.customer_phone || "")
      setIsLoading(false)
    }

    fetchOrder()
  }, [params.id, router, supabase])

  const handlePayment = async () => {
    if (!order) return

    if (!phoneNumber || phoneNumber.length < 9) {
      toast.error("Veuillez entrer un numéro de téléphone valide")
      return
    }

    setIsProcessing(true)

    try {
      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert([
          {
            order_id: order.id,
            payment_method: paymentMethod,
            amount_xaf: order.total_xaf,
            phone_number: phoneNumber,
            status: "pending",
          },
        ])
        .select()
        .single()

      if (paymentError) throw paymentError

      // Simulate payment processing
      // In production, this would integrate with NotchPay or direct Mobile Money API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For demo purposes, we'll simulate a successful payment
      // In production, this would be handled by webhooks from the payment provider
      const { error: updatePaymentError } = await supabase
        .from("payments")
        .update({
          status: "success",
          transaction_id: `TXN${Date.now()}`,
          confirmed_at: new Date().toISOString(),
        })
        .eq("id", payment.id)

      if (updatePaymentError) throw updatePaymentError

      const { error: updateOrderError } = await supabase
        .from("orders")
        .update({
          status: "paid",
          payment_status: "success",
        })
        .eq("id", order.id)

      if (updateOrderError) throw updateOrderError

      // Update product stock
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("product_id, quantity")
        .eq("order_id", order.id)

      if (orderItems) {
        for (const item of orderItems) {
          if (item.product_id) {
            await supabase.rpc("decrement_product_stock", {
              product_id: item.product_id,
              quantity_to_subtract: item.quantity,
            })
          }
        }
      }

      toast.success("Paiement effectué avec succès!")
      router.push(`/commande/${order.id}/confirmation`)
    } catch (error: any) {
      toast.error("Erreur lors du paiement: " + error.message)
    } finally {
      setIsProcessing(false)
    }
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
            <h1 className="text-balance mb-8 text-3xl font-bold tracking-tight">Paiement</h1>

            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Commande {order.order_number}</CardTitle>
                  <CardDescription>Montant à payer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-3xl font-bold text-primary">{formatPrice(order.total_xaf)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Mode de paiement</CardTitle>
                  <CardDescription>Sélectionnez votre méthode de paiement mobile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                    <div className="flex items-center space-x-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                      <RadioGroupItem value="orange_money" id="orange" />
                      <Label htmlFor="orange" className="flex flex-1 cursor-pointer items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                          <Smartphone className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">Orange Money</p>
                          <p className="text-sm text-muted-foreground">Paiement via Orange Money</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                      <RadioGroupItem value="mtn_money" id="mtn" />
                      <Label htmlFor="mtn" className="flex flex-1 cursor-pointer items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                          <CreditCard className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">MTN Mobile Money</p>
                          <p className="text-sm text-muted-foreground">Paiement via MTN MoMo</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Numéro de téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+237 6XX XXX XXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={isProcessing}
                    />
                    <p className="text-sm text-muted-foreground">
                      Le numéro associé à votre compte{" "}
                      {paymentMethod === "orange_money" ? "Orange Money" : "MTN Mobile Money"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Après avoir cliqué sur "Payer maintenant", vous recevrez une notification sur votre téléphone pour
                      confirmer le paiement en entrant votre code secret.
                    </p>
                  </div>

                  <Button onClick={handlePayment} disabled={isProcessing} className="w-full" size="lg">
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Traitement en cours...
                      </>
                    ) : (
                      <>Payer maintenant - {formatPrice(order.total_xaf)}</>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed text-foreground">
                    Paiement 100% sécurisé. Vos informations de paiement sont traitées de manière sécurisée par votre
                    opérateur mobile.
                  </p>
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
