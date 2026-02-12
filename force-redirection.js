// Force la redirection vers le dashboard simple
// Copiez-collez ce code dans la console du login

console.log('🔍 Forcing redirection...');

// Créer la session
localStorage.setItem('admin_authenticated', 'true');
localStorage.setItem('admin_user', JSON.stringify({
  email: 'admin@kkjewelry.com',
  role: 'admin',
  full_name: 'Administrateur KK Jewelry'
}));

console.log('✅ Session created');

// Forcer la redirection
console.log('🔄 Redirecting to simple dashboard...');
window.location.href = '/admin/simple';
