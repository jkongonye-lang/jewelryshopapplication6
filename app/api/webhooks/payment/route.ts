import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const supabase = await createServerSupabaseClient()

    // This webhook would be called by NotchPay or the payment provider
    // For production, you should verify the webhook signature

    const { transaction_id, status, order_id, amount } = payload

    if (status === "success" || status === "completed") {
      // Update payment status
      const { error: paymentError } = await supabase
        .from("payments")
        .update({
          status: "success",
          transaction_id,
          confirmed_at: new Date().toISOString(),
          provider_response: payload,
        })
        .eq("order_id", order_id)

      if (paymentError) throw paymentError

      // Update order status
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          status: "paid",
          payment_status: "success",
        })
        .eq("id", order_id)

      if (orderError) throw orderError

      // Update product stock
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("product_id, quantity")
        .eq("order_id", order_id)

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

      return NextResponse.json({ success: true, message: "Payment processed" })
    } else if (status === "failed" || status === "cancelled") {
      // Update payment status to failed
      const { error } = await supabase
        .from("payments")
        .update({
          status: "failed",
          provider_response: payload,
        })
        .eq("order_id", order_id)

      if (error) throw error

      return NextResponse.json({ success: true, message: "Payment failed recorded" })
    }

    return NextResponse.json({ success: false, message: "Unknown status" }, { status: 400 })
  } catch (error: any) {
    console.error("[v0] Payment webhook error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
