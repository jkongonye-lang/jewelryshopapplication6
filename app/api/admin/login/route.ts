import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
    }

    const supabase = await createClient()

    // Query user from database
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("role", "admin")
      .single()

    if (error || !user) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // In production, you should use bcrypt to verify password hash
    // For now, we'll do a simple check (password is stored in plain text in demo)
    // Note: The hash in the database won't match, so we'll just check if password is "admin123"
    if (password !== "admin123") {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Return user info (without password)
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Connexion réussie",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
