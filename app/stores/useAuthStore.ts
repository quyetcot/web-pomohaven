import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isInitialized = ref(false)

  const supabase = useSupabase()

  const initAuthSession = async () => {
    if (isInitialized.value) return
    
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    
    // Listen for auth state changes globally
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
    
    isInitialized.value = true
  }

  const loginWithGoogle = async (redirectTo?: string) => {
    // If running in browser window, fallback to its origin
    const redirectUrl = redirectTo || (typeof window !== 'undefined' ? window.location.origin : '')
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      }
    })
    
    if (error) {
      console.error('Error logging in with Google:', error.message)
      throw error
    }
  }

  const updateProfile = async (updates: Record<string, any>) => {
    const { error } = await supabase.auth.updateUser({
      data: updates
    })
    
    if (error) {
      console.error('Error updating user profile:', error.message)
      throw error
    }
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error logging out:', error.message)
      throw error
    }
    user.value = null
  }

  return {
    user,
    isInitialized,
    initAuthSession,
    loginWithGoogle,
    updateProfile,
    logout
  }
})
