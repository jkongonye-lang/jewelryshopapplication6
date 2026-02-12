// Test direct avec le client Supabase
// Copiez-collez ce code dans la console

console.log('🔍 Test direct Supabase...');

// Test avec le client Supabase direct
try {
  // Créer le client manuellement
  const supabaseUrl = 'https://dhcadcfrthoyicpoqktf.supabase.co';
  const supabaseKey = 'sb_publishable_bJRxARRfUDL3PRqcCv0Y8w_Eydz8fWP';
  
  // Test simple
  const response = await fetch(`${supabaseUrl}/rest/v1/products?select=count`, {
    method: 'GET',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log('✅ Supabase direct OK:', data);
    console.log('📊 Nombre de produits:', data[0]?.count || 0);
  } else {
    console.error('❌ Erreur HTTP:', response.status, response.statusText);
    const errorText = await response.text();
    console.error('❌ Détails:', errorText);
  }
  
} catch (err) {
  console.error('❌ Erreur critique:', err);
}

console.log('🏁 Test direct terminé');
