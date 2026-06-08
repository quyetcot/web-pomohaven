import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useLocalStorage, useDocumentVisibility } from '@vueuse/core'
import { useAudioStore } from './useAudioStore'
import { useAuthStore } from './useAuthStore'
import { useSessionStore } from './useSessionStore'
import { useSupabase } from '~/composables/useSupabase'
import { useSettingsSync } from '~/composables/useSettingsSync'

type TimerMode = 'focus' | 'shortBreak' | 'longBreak'

export const useTimerStore = defineStore('timer', () => {
  // Settings (Persisted)
  const settings = useLocalStorage('pomohaven_settings_v1', {
    focusDuration: 50 * 60,       // 50 minutes
    shortBreakDuration: 10 * 60,   // 10 minutes
    longBreakDuration: 15 * 60,   // 15 minutes
    sessionsBeforeLongBreak: 3,
    dailyGoal: 8,                 // Daily focus blocks
    soundEnabled: true,
    countdownBeepEnabled: true,   // New setting for "tít tít"
    notificationsEnabled: true,
    autoStartBreaks: true,
    autoStartPomodoros: true
  }, { mergeDefaults: true })

  // State
  const audioStore = useAudioStore()
  const mode = ref<TimerMode>('focus')
  const isRunning = ref(false)
  const timeRemaining = ref(settings.value.focusDuration)
  const sessionsCompleted = ref(0)
  const todayCompletedCount = ref(0) // New: Persisted cross-session via DB
  const lastBeepedSecond = ref(-1) // To prevent duplicate beeps in one second
  const sessionStartedAt = ref(0)
  const isCompleting = ref(false) // Guard: chống gọi completeSession() 2 lần khi interval chưa kịp clear

  // Fetch true daily completed count on mount
  const fetchTodayCompleted = async () => {
    const authStore = useAuthStore()
    if (!authStore.user) return

    const supabase = useSupabase()
    const todayStr = new Date().toISOString().split('T')[0]
    
    // Using gte started_at today
    const { count } = await (supabase.from('pomo_sessions') as any)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authStore.user.id)
      .eq('status', 'completed')
      .gte('started_at', todayStr + 'T00:00:00.000Z')

    if (count !== null) {
      todayCompletedCount.value = count
    }
  }

  // Web Audio Beep Generator
  const playBeep = (frequency = 440, duration = 0.15) => {
    if (!settings.value.soundEnabled || !settings.value.countdownBeepEnabled || typeof window === 'undefined') return
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)

      // Changed to 'triangle' for sharper sound that punches through music
      oscillator.type = 'triangle'
      oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime)
      
      // Significantly increased volume from 0.2 to 0.7
      gainNode.gain.setValueAtTime(0.7, audioCtx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration)

      oscillator.start()
      oscillator.stop(audioCtx.currentTime + duration)
      
      setTimeout(() => audioCtx.close(), duration * 1000 + 50)
    } catch (e) {
      console.warn('Audio Beep blocked or failed:', e)
    }
  }
  
  // Keep timer synced when settings are manually changed (display only — DB sync via settings.vue)
  watch(() => settings.value, (newSettings) => {
    if (!isRunning.value) {
      if (mode.value === 'focus') timeRemaining.value = newSettings.focusDuration
      else if (mode.value === 'shortBreak') timeRemaining.value = newSettings.shortBreakDuration
      else if (mode.value === 'longBreak') timeRemaining.value = newSettings.longBreakDuration
    }
    // NOTE: saveSettings() đã bị xóa khỏi đây — tránh race condition với 3 upsert đồng thời
    // settings.vue sẽ gọi saveSettings() tường minh sau khi user bấm Save
  }, { deep: true })
  
  // Anti-drift variables
  let timerInterval: ReturnType<typeof setInterval> | null = null
  let expectedEndTime = 0

  // Visibility API for tab sleeping compensation
  const visibility = useDocumentVisibility()
  watch(visibility, (current, previous) => {
    if (current === 'visible' && previous === 'hidden' && isRunning.value) {
      const now = Date.now()
      const newRemaining = Math.max(0, Math.ceil((expectedEndTime - now) / 1000))
      timeRemaining.value = newRemaining
      
      if (newRemaining === 0) {
        completeSession()
      }
    }
  })

  // Getters
  const currentDuration = computed(() => {
    if (mode.value === 'focus') return settings.value.focusDuration
    if (mode.value === 'shortBreak') return settings.value.shortBreakDuration
    return settings.value.longBreakDuration
  })

  const progressPercent = computed(() => {
    return ((currentDuration.value - timeRemaining.value) / currentDuration.value) * 100
  })

  const formattedTime = computed(() => {
    const min = Math.floor(timeRemaining.value / 60)
    const sec = timeRemaining.value % 60
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  })

  // Label for document title display
  const modeLabel = computed(() => {
    if (mode.value === 'focus') return 'Focus'
    if (mode.value === 'shortBreak') return 'Rest'
    return 'Long Rest'
  })

  // Actions
  const tick = () => {
    if (!isRunning.value) return
    if (isCompleting.value) return // Guard: đang xử lý completion, bỏ qua tick
    const now = Date.now()
    const newRemaining = Math.max(0, Math.ceil((expectedEndTime - now) / 1000))
    timeRemaining.value = newRemaining

    // Countdown "Tít Tít" Logic
    if (newRemaining <= 10 && newRemaining > 0 && newRemaining !== lastBeepedSecond.value) {
      lastBeepedSecond.value = newRemaining
      const freq = newRemaining <= 5 ? 880 : 440 // Cao hơn ở 3 giây cuối
      playBeep(freq, 0.08)
    }

    if (newRemaining === 0) {
      completeSession()
    }
  }

  const start = () => {
    if (isRunning.value) return
    
    // Đánh dấu thời gian bắt đầu thực sự nếu là session mới tinh
    if (timeRemaining.value === currentDuration.value && sessionStartedAt.value === 0) {
      sessionStartedAt.value = Date.now()
    }
    
    isRunning.value = true
    expectedEndTime = Date.now() + (timeRemaining.value * 1000)
    timerInterval = setInterval(tick, 200)
    
    // Sync Audio
    if (mode.value === 'focus') {
      audioStore.play()
    } else {
      audioStore.pause()
    }

    // Yêu cầu quyền thông báo ngay khi bắt đầu bấm chạy
    if (settings.value.notificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  const pause = () => {
    isRunning.value = false
    if (timerInterval) clearInterval(timerInterval)
    
    // Sync Audio
    audioStore.pause()
  }

  const toggle = () => {
    isRunning.value ? pause() : start()
  }

  // resetTimer(): chỉ reset state, KHÔNG ghi DB. Dùng nội bộ khi chuyển mode.
  const resetTimer = () => {
    pause()
    timeRemaining.value = currentDuration.value
    sessionStartedAt.value = 0
    lastBeepedSecond.value = -1
  }

  // reset(): dành cho user bấm nút Reset — ghi abandoned trước khi reset
  const reset = () => {
    recordSession('abandoned')
    resetTimer()
  }

  // setMode(): chuyển chế độ timer mà KHÔNG ghi thêm session nào vào DB
  const setMode = (newMode: TimerMode) => {
    mode.value = newMode
    resetTimer()
  }

  const quickSet = (minutes: number) => {
    const seconds = minutes * 60
    if (mode.value === 'focus') settings.value.focusDuration = seconds
    else if (mode.value === 'shortBreak') settings.value.shortBreakDuration = seconds
    else if (mode.value === 'longBreak') settings.value.longBreakDuration = seconds
    // quickSet cũng dùng resetTimer vì nó không phải user reset session
    resetTimer()
  }
  
  const triggerAlarm = () => {
    // 1. Phập âm thanh
    if (settings.value.soundEnabled) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3')
      audio.volume = 0.5
      audio.play().catch(e => console.log('Autoplay blocked:', e))
    }
    
    // 2. Hiện Native Browser Notification
    if (settings.value.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      const msg = mode.value === 'focus' ? 'Session Complete! Time for a break.' : 'Break Complete! Time to focus.'
      new Notification('PomoTune Timer', {
        body: msg,
        icon: 'https://cdn-icons-png.flaticon.com/512/3239/3239045.png'
      })
    }
  }

  // recordSession nhận snapshot tại thời điểm session kết thúc
  // vì khi chạy background, mode/duration đã có thể thay đổi
  const recordSession = async (
    status: 'completed' | 'skipped' | 'abandoned',
    snapshot?: { modeAtEnd: TimerMode; plannedDuration: number; actualDuration: number; startedAt: number }
  ) => {
    const startedAt = snapshot?.startedAt ?? sessionStartedAt.value
    if (startedAt === 0) return

    const authStore = useAuthStore()
    if (!authStore.user) return

    const modeAtEnd = snapshot?.modeAtEnd ?? mode.value
    const plannedDuration = snapshot?.plannedDuration ?? currentDuration.value
    const actualDuration = snapshot?.actualDuration ?? (plannedDuration - timeRemaining.value)

    // If abandoned before 10 seconds of work, ignore to avoid DB spam
    if (status !== 'completed' && actualDuration < 10) return

    const supabase = useSupabase()
    const typeMapping: Record<TimerMode, string> = { focus: 'deep_focus', shortBreak: 'short_break', longBreak: 'long_break' }

    const payload = {
      user_id: authStore.user.id,
      type: typeMapping[modeAtEnd],
      planned_duration: plannedDuration,
      actual_duration: actualDuration,
      status: status,
      started_at: new Date(startedAt).toISOString()
    }

    const { error } = await (supabase.from('pomo_sessions') as any).insert(payload)
    if (error) {
      console.error('[SessionStore] recordSession FAILED:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        payload,
      })
    }
  }

  const completeSession = () => {
    // Guard: chống gọi lại trong khi đang xử lý
    if (isCompleting.value) return
    isCompleting.value = true

    // Capture snapshot NGAY TẠI ĐÂY trước khi bất kỳ thứ gì thay đổi
    const completedMode = mode.value
    const plannedDuration = currentDuration.value
    const actualDuration = plannedDuration - timeRemaining.value
    const startedAt = sessionStartedAt.value
    sessionStartedAt.value = 0 // Clear ngay để tránh double-record

    // 1. Dừng interval ngay lập tức
    pause()

    // 2. Phát alarm
    triggerAlarm()

    // 3. Chuyển mode NGAY — KHÔNG chờ DB, UI không được block bởi network
    if (completedMode === 'focus') {
      sessionsCompleted.value++
      todayCompletedCount.value++
      const nextMode: TimerMode = sessionsCompleted.value % settings.value.sessionsBeforeLongBreak === 0 ? 'longBreak' : 'shortBreak'
      setMode(nextMode)
      if (settings.value.autoStartBreaks) start()
    } else {
      setMode('focus')
      if (settings.value.autoStartPomodoros) start()
    }

    // Release guard NGAY sau khi transition xong (synchronous)
    isCompleting.value = false

    // 4. Lưu DB ở background với snapshot đã capture — fire-and-forget
    if (startedAt !== 0) {
      recordSession('completed', { modeAtEnd: completedMode, plannedDuration, actualDuration, startedAt })
        .then(() => {
          if (completedMode === 'focus') {
            useSessionStore().refreshAfterSession()
          }
        })
        .catch(err => console.error('[completeSession] Background DB save failed:', err))
    }
  }

  const skipSession = () => {
    // Ghi session trước — recordSession sẽ clear sessionStartedAt
    recordSession('skipped')
    // Sau đó mới chuyển mode (setMode -> resetTimer, không ghi DB thêm)
    if (mode.value === 'focus') {
      const nextMode = (sessionsCompleted.value + 1) % settings.value.sessionsBeforeLongBreak === 0 ? 'longBreak' : 'shortBreak'
      setMode(nextMode)
    } else {
      setMode('focus')
    }
  }

  const clearAllData = () => {
    pause()
    // Reset Settings manually since useLocalStorage can't be easily "reset" to initial object
    settings.value.focusDuration = 50 * 60
    settings.value.shortBreakDuration = 10 * 60
    settings.value.longBreakDuration = 15 * 60
    settings.value.sessionsBeforeLongBreak = 3
    settings.value.dailyGoal = 8
    
    // Reset State
    sessionsCompleted.value = 0
    todayCompletedCount.value = 0
    timeRemaining.value = settings.value.focusDuration
    mode.value = 'focus'
  }

  return {
    // State
    mode,
    isRunning,
    timeRemaining,
    sessionsCompleted,
    todayCompletedCount,
    settings,
    
    // Getters
    formattedTime,
    progressPercent,
    currentDuration,
    modeLabel,
    
    // Actions
    start,
    pause,
    toggle,
    reset,
    setMode,
    quickSet,
    skipSession,
    fetchTodayCompleted,
    clearAllData
  }
})
