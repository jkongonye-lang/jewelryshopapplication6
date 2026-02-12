// Test de la session admin
// Copiez-collez ce code dans la console

console.log('🔍 Test de la session admin...');

// Vérifier si la session est stockée
const isAuthenticated = localStorage.getItem('admin_authenticated');
const adminUser = localStorage.getItem('admin_user');

console.log('🔐 Authentifié:', isAuthenticated);
console.log('👤 Utilisateur:', adminUser);

if (isAuthenticated === 'true' && adminUser) {
  console.log('✅ Session admin trouvée !');
  console.log('📊 Données utilisateur:', JSON.parse(adminUser));
  
  // Test direct du dashboard simple
  console.log('🔄 Redirection vers dashboard-simple...');
  window.location.href = '/admin/dashboard-simple';
} else {
  console.log('❌ Session admin non trouvée');
  console.log('🔧 Tentative de création manuelle...');
  
  // Créer la session manuellement
  localStorage.setItem('admin_authenticated', 'true');
  localStorage.setItem('admin_user', JSON.stringify({
    id: 'admin-id',
    email: 'admin@kkjewelry.com',
    role: 'admin',
    full_name: 'Administrateur KK Jewelry'
  }));
  
  console.log('✅ Session créée manuellement');
  console.log('🔄 Redirection vers dashboard...');
  window.location.href = '/admin/dashboard-simple';
}

console.log('🏁 Test terminé');
