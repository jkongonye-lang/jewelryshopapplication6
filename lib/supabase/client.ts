import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('🔧 Client Supabase - URL:', supabaseUrl)
  console.log('🔧 Client Supabase - Key:', supabaseKey ? '✅' : '❌')
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables Supabase manquantes!')
    return null
  }
  
  return createSupabaseClient(supabaseUrl, supabaseKey)
}

export { createClient as createBrowserClient }
