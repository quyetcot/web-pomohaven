import { useTimerStore } from '~/stores/useTimerStore'
import { useAudioStore } from '~/stores/useAudioStore'
import { useAuthStore } from '~/stores/useAuthStore'
import { useSupabase } from '~/composables/useSupabase'

export const useSettingsSync = () => {
  const timerStore = useTimerStore()
  const audioStore = useAudioStore()
  const authStore = useAuthStore()
  const supabase = useSupabase()

  // Load settings from Supabase
  const loadSettings = async () => {
    if (!authStore.user) return

    const { data, error } = await (supabase.from('user_settings') as any)
      .select('*')
      .eq('user_id', authStore.user.id)
      .single()

    if (error || !data) {
      // If no settings exist, create them with defaults
      await saveSettings()
      return
    }

    // Hydrate Timer Settings
    timerStore.settings.focusDuration = data.focus_time
    timerStore.settings.shortBreakDuration = data.break_time
    timerStore.settings.dailyGoal = data.daily_goal || timerStore.settings.dailyGoal
    
    // Hydrate Audio Settings
    audioStore.settings.defaultVideoId = data.yt_video_id
    audioStore.settings.defaultVolume = data.volume
  }

  // Save settings to Supabase
  const saveSettings = async () => {
    if (!authStore.user) return

    const { error } = await (supabase.from('user_settings') as any)
      .upsert({
        user_id: authStore.user.id,
        focus_time: timerStore.settings.focusDuration,
        break_time: timerStore.settings.shortBreakDuration,
        yt_video_id: audioStore.settings.defaultVideoId,
        volume: audioStore.settings.defaultVolume,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (error) {
      console.error('Failed to save settings to backend:', error.message)
    }
  }

  return {
    loadSettings,
    saveSettings
  }
}
