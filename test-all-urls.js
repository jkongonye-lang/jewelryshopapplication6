// Test de toutes les URLs disponibles
// Copiez-collez ce code dans la console

console.log('🔍 Test de toutes les URLs...');

const urls = [
  '/admin/simple',
  '/admin/final',
  '/admin/produits',
  '/admin/commandes',
  '/',
  '/bijoux'
];

urls.forEach((url, index) => {
  setTimeout(() => {
    console.log(`🔄 Test ${index + 1}: ${url}`);
    window.location.href = url;
  }, index * 2000); // Test chaque URL toutes les 2 secondes
});

console.log('🏁 Tests démarrés...');
