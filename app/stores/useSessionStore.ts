import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { useAuthStore } from './useAuthStore'

interface PomoSession {
  id: string
  user_id: string
  type: 'deep_focus' | 'short_break' | 'long_break'
  actual_duration: number
  planned_duration: number
  status: 'completed' | 'skipped' | 'abandoned'
  started_at: string
}

export const useSessionStore = defineStore('session', () => {
  const supabase = useSupabase()
  const authStore = useAuthStore()

  const recentSessions = ref<PomoSession[]>([])
  const allSessions = ref<PomoSession[]>([])   // dùng cho trang /sessions
  const weeklyData = ref<number[]>([5, 5, 5, 5, 5, 5, 5])
  const todayFocusHrs = ref('0.0')
  const todayCount = ref(0)
  const isLoadingRecent = ref(false)
  const isLoadingStats = ref(false)
  // Guard: đảm bảo mỗi lần load web chỉ gọi API đúng 1 lần
  const isLoaded = ref(false)

  // Load last 5 focus sessions for History Widget
  const loadRecentSessions = async () => {
    if (!authStore.user) return
    isLoadingRecent.value = true

    const { data, error } = await (supabase.from('pomo_sessions') as any)
      .select('*')
      .eq('user_id', authStore.user.id)
      .eq('type', 'deep_focus')
      .order('started_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('[SessionStore] loadRecentSessions error:', error.message)
    } else {
      recentSessions.value = data ?? []
    }
    isLoadingRecent.value = false
  }

  // Load toàn bộ sessions cho trang /sessions (limit 50)
  const loadAllSessions = async () => {
    if (!authStore.user) return

    const { data, error } = await (supabase.from('pomo_sessions') as any)
      .select('*')
      .eq('user_id', authStore.user.id)
      .order('started_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('[SessionStore] loadAllSessions error:', error.message)
    } else {
      allSessions.value = data ?? []
    }
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

  // loadData(): entry point DUY NHẤT — gọi 1 lần sau khi auth ready
  // Chạy parallel cả 3 queries, có guard isLoaded để tránh duplicate
  const loadData = async (force = false) => {
    if (!authStore.user) return
    if (isLoaded.value && !force) return  // Đã load rồi, bỏ qua

    isLoaded.value = true
    // Chạy song song 3 queries thay vì tuần tự
    await Promise.all([
      loadRecentSessions(),
      loadWeeklyStats(),
      loadAllSessions(),
    ])
  }

  // Gọi lại sau khi hoàn thành 1 session (cập nhật UI realtime)
  const refreshAfterSession = () => {
    loadRecentSessions()
    loadWeeklyStats()
    // allSessions không cần refresh realtime (chỉ load khi vào trang /sessions)
  }

  return {
    recentSessions,
    allSessions,
    weeklyData,
    todayFocusHrs,
    todayCount,
    isLoadingRecent,
    isLoadingStats,
    isLoaded,
    loadData,
    refreshAfterSession,
    // Vẫn giữ để backward compat nếu cần gọi riêng
    loadRecentSessions,
    loadWeeklyStats,
  }
})
