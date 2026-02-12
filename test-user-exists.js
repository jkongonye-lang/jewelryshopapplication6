// Test si l'utilisateur admin existe dans Supabase
// Copiez-collez ce code dans la console

console.log('🔍 Vérification de l\'utilisateur admin...');

const supabaseUrl = 'https://dhcadcfrthoyicpoqktf.supabase.co';
const supabaseKey = 'sb_publishable_bJRxARRfUDL3PRqcCv0Y8w_Eydz8fWP';

// Test avec différents emails possibles
const emailsToTest = [
  'admin@kkjewelry.com',
  'Admin@kkjewelry.com',  // Test casse
  'ADMIN@kkjewelry.com',  // Test casse
  'nelly@kkjewelry.com'   // Email original du formulaire
];

for (const email of emailsToTest) {
  fetch(`${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(email)}&role=eq.admin`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(users => {
    const user = users[0];
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Utilisateur trouvé: ${user ? 'OUI' : 'NON'}`);
    if (user) {
      console.log(`🔑 Hash: ${user.password_hash}`);
      console.log(`📝 Rôle: ${user.role}`);
    }
  })
  .catch(error => console.error(`❌ Erreur pour ${email}:`, error));
}

console.log('🏁 Test terminé');
