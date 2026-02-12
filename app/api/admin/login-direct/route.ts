import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log('🔍 Login API called')
  
  try {
    const body = await request.json()
    console.log('📧 Request body:', body)
    
    const { email, password } = body

    if (!email || !password) {
      console.log('❌ Missing email or password')
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
    }

    console.log('🔧 Credentials:', { email, password: '***' })

    // Utiliser l'API directe Supabase
    const supabaseUrl = 'https://dhcadcfrthoyicpoqktf.supabase.co'
    const supabaseKey = 'sb_publishable_bJRxARRfUDL3PRqcCv0Y8w_Eydz8fWP'
    
    console.log('🌐 Fetching from Supabase...')

    // Query user from database
    const response = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(email)}&role=eq.admin`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('📊 Supabase response status:', response.status)

    if (!response.ok) {
      console.error('❌ Supabase error:', response.status)
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    const users = await response.json()
    console.log('👤 Users found:', users.length)
    
    const user = users[0]

    if (!user) {
      console.log('❌ User not found')
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Vérification du mot de passe (demo)
    if (password !== "admin123") {
      console.log('❌ Password mismatch')
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Return user info (without password)
    const { password_hash, ...userWithoutPassword } = user

    console.log('✅ Login successful')
    return NextResponse.json({
      user: userWithoutPassword,
      message: "Connexion réussie",
    })
  } catch (error) {
    console.error("❌ Login error:", error)
    console.error("❌ Error stack:", error.stack)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
