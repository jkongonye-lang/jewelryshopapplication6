import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
    }

    // Utiliser l'API directe Supabase
    const supabaseUrl = 'https://dhcadcfrthoyicpoqktf.supabase.co'
    const supabaseKey = 'sb_publishable_bJRxARRfUDL3PRqcCv0Y8w_Eydz8fWP'

    // Query user from database
    const response = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(email)}&role=eq.admin`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    const users = await response.json()
    const user = users[0]

    if (!user) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Vérification du mot de passe (demo)
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
