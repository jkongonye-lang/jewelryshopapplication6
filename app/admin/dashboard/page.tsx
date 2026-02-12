"use client"

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">KK Jewelry</h1>
        <p className="text-center text-gray-600 mb-8">Administration</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Produits</h2>
            <p className="text-4xl font-bold text-blue-600">6</p>
            <p className="text-sm text-gray-500 mt-1">Articles en catalogue</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Commandes</h2>
            <p className="text-4xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-500 mt-1">Total des commandes</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Revenus</h2>
            <p className="text-4xl font-bold text-purple-600">0</p>
            <p className="text-sm text-gray-500 mt-1">XAF</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Produits en stock</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Collier Or Rose</h3>
              <p className="text-gray-600 text-sm mb-3">Bijoux Femme</p>
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold text-blue-600">25,000 XAF</p>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">Stock: 10</span>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Bracelet Enfant Coloré</h3>
              <p className="text-gray-600 text-sm mb-3">Bijoux Enfant</p>
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold text-blue-600">15,000 XAF</p>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">Stock: 15</span>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Boucles Argent Pierres</h3>
              <p className="text-gray-600 text-sm mb-3">Bijoux Femme</p>
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold text-blue-600">35,000 XAF</p>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">Stock: 8</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-green-800 mb-1">✅ Système opérationnel</h2>
              <p className="text-green-700">KK Jewelry est prêt pour les ventes • 6 produits disponibles • Site fonctionnel</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center space-x-4">
          <a href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            🏠 Voir le site
          </a>
          <a href="/admin/produits" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            📦 Gérer les produits
          </a>
        </div>
      </div>
    </div>
  )
}
