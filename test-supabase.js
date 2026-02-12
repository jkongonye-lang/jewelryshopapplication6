// Test de connexion Supabase
async function testSupabaseConnection() {
  try {
    const response = await fetch('https://dhcadcfrthoyicpoqktf.supabase.co/rest/v1/users', {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2FkY2ZydGhveWljcG9xa3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MDYxODUsImV4cCI6MjA4NjM4MjE4NX0.Cxuo4XzFLEfWbMCCi-AZ6Zf_6cmW5MXYY15flvAXgnE',
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('✅ Supabase connection OK:', data);
    return true;
  } catch (error) {
    console.error('❌ Supabase connection ERROR:', error);
    return false;
  }
}

testSupabaseConnection();
