import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import type { User } from '@supabase/supabase-js'
import { useTimerStore } from './useTimerStore'
import { useAudioStore } from './useAudioStore'
import { useMusicStore } from './useMusicStore'
import { useSessionStore } from './useSessionStore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isInitialized = ref(false)

  const supabase = useSupabase()

  const initAuthSession = async () => {
    if (isInitialized.value) return
    
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    
    if (session?.user) {
      await ensureProfile(session.user)
      // Load session data ngay khi auth khởi tạo xong — DUY NHẤT lần này
      useSessionStore().loadData()
    }
    
    // Listen for auth state changes globally
    supabase.auth.onAuthStateChange(async (_event, session) => {
      user.value = session?.user ?? null
      if (_event === 'SIGNED_IN' && session?.user) {
        await ensureProfile(session.user)
        // Khi sign-in (OAuth callback), force reload vì user mới
        useSessionStore().loadData(true)
      }
      if (_event === 'SIGNED_OUT') {
        // Reset guard để lần đăng nhập sau load fresh
        useSessionStore().isLoaded = false
      }
    })
    
    isInitialized.value = true
  }

  // Ensures profile & settings rows exist for the user (idempotent upsert)
  const ensureProfile = async (authUser: User) => {
    // Upsert profile
    await (supabase.from('profiles') as any).upsert({
      id: authUser.id,
      email: authUser.email,
    }, { onConflict: 'id', ignoreDuplicates: true })

    // Upsert settings (creates default row if not present)
    await (supabase.from('user_settings') as any).upsert({
      user_id: authUser.id,
    }, { onConflict: 'user_id', ignoreDuplicates: true })
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
    
    // Clear All Local Data
    useTimerStore().clearAllData()
    useAudioStore().clearAllData()
    useMusicStore().resetStore()
    // isLoaded sẽ được reset bởi onAuthStateChange SIGNED_OUT handler ở trên

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
