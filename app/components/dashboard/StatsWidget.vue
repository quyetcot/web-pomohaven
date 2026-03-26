<template>
  <div class="bg-surface/60 rounded-3xl p-6 border border-muted/10 backdrop-blur-sm">
    <div class="flex items-end justify-between gap-2 h-24 mb-6">
      <div v-for="(height, idx) in barHeights" :key="idx" 
           class="flex-1 rounded-t-lg transition-all duration-700 ease-out"
           :class="idx === 6 ? 'bg-primary-glow/80 shadow-[0_0_15px_rgba(75,142,255,0.4)]' : 'bg-surface-variant hover:bg-primary-glow/40'"
           :style="{ height: `${height}%` }">
      </div>
    </div>
    
    <div class="flex justify-between items-center">
      <div>
        <p class="text-2xl font-bold text-white">{{ todayFocusTimeHrs }}<span class="text-sm font-normal text-muted ml-1">hrs</span></p>
        <p class="text-[0.6rem] uppercase tracking-widest text-muted mt-1">Focus time today</p>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold text-tertiary">{{ todaySessionsCount }}</p>
        <p class="text-[0.6rem] uppercase tracking-widest text-muted mt-1">Sessions completed</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/useAuthStore'
import { useSupabase } from '~/composables/useSupabase'
import { ref, onMounted } from 'vue'

const authStore = useAuthStore()
const supabase = useSupabase()

const todayFocusTimeHrs = ref("0.0")
const todaySessionsCount = ref(0)
const barHeights = ref<number[]>([5, 5, 5, 5, 5, 5, 5]) // minimum 5% height initially

onMounted(async () => {
  if (!authStore.user) return

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  // Fetch all focus sessions in the last 7 days
  const { data } = await (supabase.from('pomo_sessions') as any)
    .select('actual_duration, started_at, status, type')
    .eq('user_id', authStore.user.id)
    .in('type', ['deep_focus', 'learning', 'creative'])
    .gte('started_at', sevenDaysAgo.toISOString())
  
  if (data && data.length > 0) {
    const todayStr = new Date().toDateString()
    
    let todayFocusSecs = 0
    let todayCount = 0
    
    const daysData = Array(7).fill(0)
    const todayNum = new Date().setHours(0,0,0,0)
    
    data.forEach((s: any) => {
      const sDate = new Date(s.started_at)
      
      // Accumulate Today stats
      if (sDate.toDateString() === todayStr) {
        if (s.status === 'completed') todayCount++
        todayFocusSecs += s.actual_duration
      }
      
      // Accumulate 7-day Bar Chart Logic
      const diffDays = Math.round((todayNum - sDate.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24))
      if (diffDays >= 0 && diffDays < 7) {
        daysData[6 - diffDays] += s.actual_duration
      }
    })
    
    todayFocusTimeHrs.value = (todayFocusSecs / 3600).toFixed(1)
    todaySessionsCount.value = todayCount
    
    const maxSecs = Math.max(...daysData, 3600) // Baseline minimum maximum of 1 hour to prevent huge bars for a 5min focus
    barHeights.value = daysData.map(secs => Math.max(5, Math.min(100, (secs / maxSecs) * 100)))
  }
})
</script>
