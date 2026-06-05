import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

declare module '#app' {
  interface NuxtApp {
    _supabaseClient?: SupabaseClient
  }
}

// Use a Nuxt state key so the instance is scoped to the Nuxt app context,
// not a bare module-level variable that survives across SSR requests.
export const useSupabase = (): SupabaseClient => {
  const nuxtApp = useNuxtApp()

  // Return cached instance if already created for this app context
  if (nuxtApp._supabaseClient) {
    return nuxtApp._supabaseClient as SupabaseClient
  }

  const config = useRuntimeConfig()

  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseKey = config.public.supabaseKey as string

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      '[useSupabase] supabaseUrl and supabaseKey are required. ' +
      'Make sure SUPABASE_URL and SUPABASE_KEY are defined in your .env file.'
    )
  }

  const client = createClient(supabaseUrl, supabaseKey)
  nuxtApp._supabaseClient = client

  return client
}
