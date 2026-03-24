import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useLocalStorage, useDocumentVisibility } from '@vueuse/core'
import { useAudioStore } from './useAudioStore'

type TimerMode = 'focus' | 'shortBreak' | 'longBreak'

export const useTimerStore = defineStore('timer', () => {
  // Settings (Persisted)
  const settings = useLocalStorage('pomohaven_settings_v1', {
    focusDuration: 50 * 60,       // 50 minutes
    shortBreakDuration: 10 * 60,   // 10 minutes
    longBreakDuration: 15 * 60,   // 15 minutes
    sessionsBeforeLongBreak: 3,
    soundEnabled: true,
    countdownBeepEnabled: true,   // New setting for "tít tít"
    notificationsEnabled: true,
    autoStartBreaks: true,
    autoStartPomodoros: true
  })

  // State
  const audioStore = useAudioStore()
  const mode = ref<TimerMode>('focus')
  const isRunning = ref(false)
  const timeRemaining = ref(settings.value.focusDuration)
  const sessionsCompleted = ref(0)
  const lastBeepedSecond = ref(-1) // To prevent duplicate beeps in one second

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
  
  // Keep timer synced when settings are manually changed
  watch(() => settings.value, (newSettings, oldSettings) => {
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

  const reset = () => {
    pause()
    timeRemaining.value = currentDuration.value
  }

  const setMode = (newMode: TimerMode) => {
    mode.value = newMode
    reset()
  }

  const quickSet = (minutes: number) => {
    const seconds = minutes * 60
    if (mode.value === 'focus') settings.value.focusDuration = seconds
    else if (mode.value === 'shortBreak') settings.value.shortBreakDuration = seconds
    else if (mode.value === 'longBreak') settings.value.longBreakDuration = seconds
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
    quickSet,
    skipSession
  }
})
