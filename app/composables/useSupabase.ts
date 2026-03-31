import { createClient } from '@supabase/supabase-js'

let supabaseInstance: ReturnType<typeof createClient> | null = null

export const useSupabase = () => {
  if (!supabaseInstance) {
    const config = useRuntimeConfig()
    
    const supabaseUrl = config.public.supabaseUrl as string
    const supabaseKey = config.public.supabaseKey as string
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase URL and Key must be provided in .env!')
    }
    
    supabaseInstance = createClient(supabaseUrl || '', supabaseKey || '')
  }
  
  return supabaseInstance
}
