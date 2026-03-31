import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { useAuthStore } from './useAuthStore'

// These values match what useTimerStore actually inserts into pomo_sessions
interface PomoSession {
  id: string
  user_id: string
  type: 'deep_focus' | 'short_break' | 'long_break'
  actual_duration: number  // seconds actually worked
  planned_duration: number
  status: 'completed' | 'skipped' | 'abandoned'
  started_at: string       // ISO timestamp
}

export const useSessionStore = defineStore('session', () => {
  const supabase = useSupabase()
  const authStore = useAuthStore()

  const recentSessions = ref<PomoSession[]>([])
  const weeklyData = ref<number[]>([5, 5, 5, 5, 5, 5, 5]) // bar heights %
  const todayFocusHrs = ref('0.0')
  const todayCount = ref(0)
  const isLoadingRecent = ref(false)
  const isLoadingStats = ref(false)

  // Load last 5 focus sessions for History Widget
  const loadRecentSessions = async () => {
    if (!authStore.user) return
    isLoadingRecent.value = true

    const { data, error } = await (supabase.from('pomo_sessions') as any)
      .select('*')
      .eq('user_id', authStore.user.id)
      .eq('type', 'deep_focus') // useTimerStore maps 'focus' -> 'deep_focus'
      .order('started_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('[SessionStore] loadRecentSessions error:', error.message)
    } else {
      recentSessions.value = data ?? []
    }
    isLoadingRecent.value = false
  }

  // Load 7-day stats for Stats Widget
  const loadWeeklyStats = async () => {
    if (!authStore.user) return
    isLoadingStats.value = true

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    // useTimerStore maps: focus -> 'deep_focus', column is actual_duration, started_at
    const { data, error } = await (supabase.from('pomo_sessions') as any)
      .select('actual_duration, started_at, status')
      .eq('user_id', authStore.user.id)
      .eq('type', 'deep_focus')
      .gte('started_at', sevenDaysAgo.toISOString())

    if (error) {
      console.error('[SessionStore] loadWeeklyStats error:', error.message)
      isLoadingStats.value = false
      return
    }

    if (data && data.length > 0) {
      const todayStr = new Date().toDateString()
      const todayNum = new Date().setHours(0, 0, 0, 0)
      const daysData = Array(7).fill(0)
      let todayFocusSecs = 0
      let todaySessionCount = 0

      data.forEach((s: PomoSession) => {
        const sDate = new Date(s.started_at)
        // Today stats (count completed sessions only)
        if (sDate.toDateString() === todayStr) {
          if (s.status === 'completed') todaySessionCount++
          todayFocusSecs += s.actual_duration
        }
        // 7-day bar chart (all sessions regardless of status)
        const diffDays = Math.round((todayNum - new Date(sDate).setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24))
        if (diffDays >= 0 && diffDays < 7) {
          daysData[6 - diffDays] += s.actual_duration
        }
      })

      todayFocusHrs.value = (todayFocusSecs / 3600).toFixed(1)
      todayCount.value = todaySessionCount

      const maxSecs = Math.max(...daysData, 3600)
      weeklyData.value = daysData.map(secs => Math.max(5, Math.min(100, (secs / maxSecs) * 100)))
    }
    isLoadingStats.value = false
  }

  return {
    recentSessions,
    weeklyData,
    todayFocusHrs,
    todayCount,
    isLoadingRecent,
    isLoadingStats,
    loadRecentSessions,
    loadWeeklyStats
  }
})
