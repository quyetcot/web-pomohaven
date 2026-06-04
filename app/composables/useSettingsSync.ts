import { useTimerStore } from '~/stores/useTimerStore'
import { useAudioStore } from '~/stores/useAudioStore'
import { useAuthStore } from '~/stores/useAuthStore'
import { useSupabase } from '~/composables/useSupabase'

export const useSettingsSync = () => {
  const supabase = useSupabase()

  // Load settings from Supabase
  const loadSettings = async () => {
    const authStore = useAuthStore()
    if (!authStore.user) return

    const timerStore = useTimerStore()
    const audioStore = useAudioStore()

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
    timerStore.settings.focusDuration = data.focus_time || timerStore.settings.focusDuration
    timerStore.settings.shortBreakDuration = data.break_time || timerStore.settings.shortBreakDuration
    timerStore.settings.longBreakDuration = data.long_break_time || timerStore.settings.longBreakDuration
    timerStore.settings.dailyGoal = data.daily_goal || timerStore.settings.dailyGoal
    
    timerStore.settings.soundEnabled = data.sound_enabled ?? timerStore.settings.soundEnabled
    timerStore.settings.notificationsEnabled = timerStore.settings.soundEnabled

    // Hydrate Audio Settings
    audioStore.settings.defaultVideoId = data.yt_video_id || audioStore.settings.defaultVideoId
    audioStore.settings.defaultVolume = data.volume ?? audioStore.settings.defaultVolume
  }

  // Save settings to Supabase
  // Columns: user_id, focus_time, break_time, long_break_time, yt_video_id, volume, auto_play_focus, auto_pause_break, sound_enabled
  const saveSettings = async () => {
    const authStore = useAuthStore()
    if (!authStore.user) return

    const timerStore = useTimerStore()
    const audioStore = useAudioStore()

    const { error } = await (supabase.from('user_settings') as any)
      .upsert({
        user_id: authStore.user.id,
        focus_time: timerStore.settings.focusDuration,
        break_time: timerStore.settings.shortBreakDuration,
        long_break_time: timerStore.settings.longBreakDuration,
        yt_video_id: audioStore.settings.defaultVideoId,
        volume: audioStore.settings.defaultVolume,
        sound_enabled: timerStore.settings.soundEnabled
      }, { onConflict: 'user_id' })

    if (error) {
      console.error('[SettingsSync] Failed to save settings:', error.message)
    }
  }

  return {
    loadSettings,
    saveSettings
  }
}
