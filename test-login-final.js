// Test final de l'API corrigée
// Copiez-collez ce code dans la console du login

console.log('🔍 Test API corrigée...');

fetch('/api/admin/login-direct', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@kkjewelry.com',
    password: 'admin123'
  })
})
.then(response => {
  console.log('📊 Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Login API Response:', data);
  
  if (data.user) {
    // Stocker la session manuellement
    localStorage.setItem('admin_authenticated', 'true');
    localStorage.setItem('admin_user', JSON.stringify(data.user));
    console.log('✅ Session stockée');
    
    // Redirection manuelle
    window.location.href = '/admin/final';
  } else {
    console.log('❌ Login failed:', data);
  }
})
.catch(error => {
  console.error('❌ Login error:', error);
});

console.log('🏁 Test envoyé');
