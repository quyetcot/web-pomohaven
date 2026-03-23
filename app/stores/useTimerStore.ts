import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage, useDocumentVisibility } from '@vueuse/core'

type TimerMode = 'focus' | 'shortBreak' | 'longBreak'

export const useTimerStore = defineStore('timer', () => {
  // Settings (Persisted)
  const settings = useLocalStorage('pomotune_settings_v1', {
    focusDuration: 50 * 60,       // 50 minutes
    shortBreakDuration: 10 * 60,   // 10 minutes
    longBreakDuration: 15 * 60,   // 15 minutes
    sessionsBeforeLongBreak: 3,
    soundEnabled: true,
    notificationsEnabled: true,
    autoStartBreaks: true,
    autoStartPomodoros: true
  })

  // State
  const mode = ref<TimerMode>('focus')
  const isRunning = ref(false)
  const timeRemaining = ref(settings.value.focusDuration)
  const sessionsCompleted = ref(0)
  
  // Keep timer synced when settings are manually changed
  watch(() => settings.value, (newSettings) => {
    if (!isRunning.value) {
      if (mode.value === 'focus') timeRemaining.value = newSettings.focusDuration
      else if (mode.value === 'shortBreak') timeRemaining.value = newSettings.shortBreakDuration
      else if (mode.value === 'longBreak') timeRemaining.value = newSettings.longBreakDuration
    }
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

  // Actions
  const tick = () => {
    if (!isRunning.value) return
    const now = Date.now()
    const newRemaining = Math.max(0, Math.ceil((expectedEndTime - now) / 1000))
    timeRemaining.value = newRemaining

    if (newRemaining === 0) {
      completeSession()
    }
  }

  const start = () => {
    if (isRunning.value) return
    isRunning.value = true
    expectedEndTime = Date.now() + (timeRemaining.value * 1000)
    timerInterval = setInterval(tick, 200)
    
    // Yêu cầu quyền thông báo ngay khi bắt đầu bấm chạy
    if (settings.value.notificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  const pause = () => {
    isRunning.value = false
    if (timerInterval) clearInterval(timerInterval)
  }

  const toggle = () => {
    isRunning.value ? pause() : start()
  }

  const reset = () => {
    pause()
    timeRemaining.value = currentDuration.value
  }

  const setMode = (newMode: TimerMode) => {
    mode.value = newMode
    reset()
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

  const completeSession = () => {
    pause()
    triggerAlarm()

    let nextMode: TimerMode = 'focus'
    
    if (mode.value === 'focus') {
      sessionsCompleted.value++
      nextMode = sessionsCompleted.value % settings.value.sessionsBeforeLongBreak === 0 ? 'longBreak' : 'shortBreak'
      setMode(nextMode)
      if (settings.value.autoStartBreaks) start()
    } else {
      nextMode = 'focus'
      setMode(nextMode)
      if (settings.value.autoStartPomodoros) start()
    }
  }

  const skipSession = () => {
    completeSession()
  }

  return {
    // State
    mode,
    isRunning,
    timeRemaining,
    sessionsCompleted,
    settings,
    
    // Getters
    formattedTime,
    progressPercent,
    currentDuration,
    
    // Actions
    start,
    pause,
    toggle,
    reset,
    setMode,
    skipSession
  }
})
