import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  const { data: users, error: uErr } = await supabase.from('profiles').select('*').limit(5)
  const { data: sessions, error: sErr } = await supabase.from('pomo_sessions').select('*').limit(5)
  console.log('Profiles:', JSON.stringify(users, null, 2), uErr?.message || '')
  console.log('Sessions:', JSON.stringify(sessions, null, 2), sErr?.message || '')
}
check()
