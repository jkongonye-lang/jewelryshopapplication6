// Test simple de session
console.log('Session:', localStorage.getItem('admin_authenticated'));
console.log('User:', localStorage.getItem('admin_user'));

// Créer session manuellement
localStorage.setItem('admin_authenticated', 'true');
localStorage.setItem('admin_user', JSON.stringify({email: 'admin@kkjewelry.com', role: 'admin'}));

// Redirection
window.location.href = '/admin/dashboard-simple';
