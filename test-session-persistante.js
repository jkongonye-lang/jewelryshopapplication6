// Test de persistance de session
// Copiez-collez ce code dans la console après rechargement

console.log('🔍 Test persistance session...');

// Vérifier la session actuelle
const session = localStorage.getItem('admin_authenticated');
const user = localStorage.getItem('admin_user');

console.log('🔐 Session après rechargement:', session);
console.log('👤 Utilisateur après rechargement:', user);

if (session !== 'true') {
  console.log('❌ Session perdue, recréation...');
  localStorage.setItem('admin_authenticated', 'true');
  localStorage.setItem('admin_user', JSON.stringify({
    email: 'admin@kkjewelry.com',
    role: 'admin',
    full_name: 'Administrateur KK Jewelry'
  }));
  console.log('✅ Session recréée');
}

// Forcer le rechargement du dashboard
console.log('🔄 Rechargement du dashboard...');
setTimeout(() => {
  window.location.reload();
}, 1000);
