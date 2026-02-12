// Test complet du client Supabase
// Copiez-collez ce code dans la console

console.log('🔍 Début du test Supabase...');

// Test 1: Import du client
try {
  const { createBrowserClient } = await import('@/lib/supabase/client');
  console.log('✅ Client Supabase importé');
  
  // Test 2: Création du client
  const supabase = createBrowserClient();
  console.log('✅ Client Supabase créé');
  
  // Test 3: Connexion simple
  const { data, error } = await supabase
    .from('products')
    .select('count')
    .single();
    
  if (error) {
    console.error('❌ Erreur Supabase:', error);
  } else {
    console.log('✅ Connexion Supabase réussie:', data);
  }
  
  // Test 4: Variables d'environnement
  console.log('📋 Variables d\'environnement:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  });
  
} catch (err) {
  console.error('❌ Erreur critique:', err);
}

console.log('🏁 Test terminé');
