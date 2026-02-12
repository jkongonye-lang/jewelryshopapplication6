"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminDebugPage() {
  const router = useRouter()
  const [result, setResult] = useState<string>("Chargement...")

  useEffect(() => {
    const auth = localStorage.getItem("admin_authenticated")
    if (!auth) {
      router.push("/admin/login")
      return
    }

    testConnection()
  }, [router])

  const testConnection = async () => {
    try {
      setResult("🔄 Test de connexion...")
      
      const response = await fetch('https://dhcadcfrthoyicpoqktf.supabase.co/rest/v1/products?select=count', {
        headers: {
          'apikey': 'sb_publishable_bJRxARRfUDL3PRqcCv0Y8w_Eydz8fWP'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setResult(`✅ Succès! ${data[0]?.count || 0} produits trouvés`)
      } else {
        setResult(`❌ Erreur HTTP: ${response.status}`)
      }
    } catch (error) {
      setResult(`❌ Erreur: ${error.message}`)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Debug Supabase</h1>
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-semibold mb-2">Résultat du test:</h2>
            <p className="text-lg">{result}</p>
          </div>
          
          <button 
            onClick={testConnection}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retester la connexion
          </button>
          
          <div className="text-sm text-gray-600">
            <p>URL: https://dhcadcfrthoyicpoqktf.supabase.co</p>
            <p>Key: sb_publishable_bJRxARRfUDL3PRqcCv0Y8w_Eydz8fWP</p>
          </div>
        </div>
      </div>
    </div>
  )
}
