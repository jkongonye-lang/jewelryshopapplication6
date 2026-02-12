import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test simple connection
    const { data: products, error } = await supabase
      .from("products")
      .select("count")
      .single()
    
    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          details: "Supabase connection failed" 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Supabase connection successful",
        products_count: products?.count || 0
      },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Server error",
        details: err.message 
      },
      { status: 500 }
    )
  }
}
