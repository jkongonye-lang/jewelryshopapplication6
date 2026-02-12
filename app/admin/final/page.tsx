"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminFinalPage() {
  const router = useRouter()
  const [message, setMessage] = useState("Chargement...")

  useEffect(() => {
    const auth = localStorage.getItem("admin_authenticated")
    if (!auth) {
      console.log('❌ Session non trouvée, création automatique...')
      localStorage.setItem("admin_authenticated", "true")
      localStorage.setItem("admin_user", JSON.stringify({
        email: "admin@kkjewelry.com",
        role: "admin",
        full_name: "Administrateur KK Jewelry"
      }))
    }
    loadStats()
  }, [router])

  const loadStats = () => {
    setMessage("🔄 Test en cours...")
    
    fetch('https://dhcadcfrthoyicpoqktf.supabase.co/rest/v1/products?select=count', {
      headers: {
        'apikey': 'sb_publishable_bJRxARRfUDL3PRqcCv0Y8w_Eydz8fWP'
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error(`HTTP ${response.status}`)
    })
    .then(data => {
      const count = data[0]?.count || 0
      setMessage(`✅ SUCCÈS! ${count} produits trouvés dans Supabase`)
    })
    .catch(error => {
      setMessage(`❌ ERREUR: ${error.message}`)
    })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">KK Jewelry - Admin</h1>
        <div className="text-center space-y-4">
          <div className="p-6 bg-blue-50 rounded-lg">
            <p className="text-lg font-semibold">{message}</p>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p>🔗 URL: https://dhcadcfrthoyicpoqktf.supabase.co</p>
            <p>🔑 Clé: sb_publishable_bJRxARRfUDL3PRqcCv0Y8w_Eydz8fWP</p>
            <p>📊 Test: GET /rest/v1/products?select=count</p>
          </div>
          
          <div className="pt-4 space-y-2">
            <a href="/admin/login" className="block w-full bg-blue-500 text-white px-4 py-2 rounded text-center hover:bg-blue-600">
              Login Admin
            </a>
            <a href="/admin/dashboard-simple" className="block w-full bg-green-500 text-white px-4 py-2 rounded text-center hover:bg-green-600">
              Dashboard Simple
            </a>
            <a href="/" className="block w-full bg-gray-500 text-white px-4 py-2 rounded text-center hover:bg-gray-600">
              Retour au site
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
