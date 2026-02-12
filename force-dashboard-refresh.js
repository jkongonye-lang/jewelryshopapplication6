// Forcer le rafraîchissement du dashboard
// Copiez-collez ce code dans la console du dashboard

console.log('🔄 Forcing dashboard refresh...');

// Forcer la mise à jour du state
const stats = {
  totalProducts: 6,
  activeProducts: 6,
  totalOrders: 0,
  pendingOrders: 0,
  totalRevenue: 0,
  recentOrders: []
};

// Simuler la mise à jour
if (window.setDashboardStats) {
  window.setDashboardStats(stats);
} else {
  // Forcer le re-rendu
  window.location.reload();
}

console.log('✅ Dashboard refresh forced!');
