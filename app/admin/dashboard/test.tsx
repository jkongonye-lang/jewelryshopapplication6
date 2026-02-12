"use client"

export default function AdminDashboardTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">KK Jewelry - Dashboard Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">✅ Page de test fonctionnelle</h2>
          <p className="text-gray-700 mb-4">Si vous voyez cette page, le routing fonctionne !</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <h3 className="font-semibold text-blue-800">Produits</h3>
              <p className="text-2xl font-bold text-blue-600">6</p>
            </div>
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <h3 className="font-semibold text-green-800">Commandes</h3>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-purple-50 p-4 rounded border border-purple-200">
              <h3 className="font-semibold text-purple-800">Revenus</h3>
              <p className="text-2xl font-bold text-purple-600">0 XAF</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Status du système</h3>
            <ul className="space-y-1 text-sm">
              <li>✅ Routing Next.js: Fonctionnel</li>
              <li>✅ Page dashboard: Accessible</li>
              <li>✅ Styles CSS: Appliqués</li>
              <li>✅ Composant React: Rendu</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center">
          <a href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            🏠 Retour au site
          </a>
        </div>
      </div>
    </div>
  )
}
