// Test direct du dashboard avec API Supabase
// Copiez-collez ce code dans la console

console.log('🔍 Test dashboard direct...');

// Test de connexion Supabase depuis le dashboard
fetch('https://dhcadcfrthoyicpoqktf.supabase.co/rest/v1/products?select=count', {
  headers: {
    'apikey': 'sb_publishable_bJRxARRfUDL3PRqcCv0Y8w_Eydz8fWP'
  }
})
.then(response => response.json())
.then(data => {
  console.log('✅ Supabase OK:', data);
  console.log('📊 Produits trouvés:', data[0]?.count || 0);
  
  // Redirection vers dashboard final
  console.log('🔄 Redirection vers dashboard final...');
  window.location.href = '/admin/final';
})
.catch(error => {
  console.error('❌ Erreur Supabase:', error);
});
