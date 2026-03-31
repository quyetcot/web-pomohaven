<template>
  <div class="max-w-6xl mx-auto space-y-8 pt-8 px-4 md:px-0 pb-20">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <header>
        <div class="text-[0.6875rem] uppercase tracking-[0.15em] text-[#c1c6d7] font-medium mb-1">Performance Analytics</div>
        <h1 class="text-3xl md:text-5xl font-bold tracking-[-0.04em] text-[#adc6ff]">Deep Insights</h1>
      </header>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center py-20">
      <div class="w-12 h-12 rounded-full border-4 border-[#272a31] border-t-[#4b8eff] animate-spin"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="relative rounded-[2rem] bg-[#272a31]/60 backdrop-blur-[24px] overflow-hidden p-8 text-center text-red-400">
      <div class="absolute inset-0 border-t border-l border-[#adc6ff]/10 rounded-[2rem] pointer-events-none"></div>
      {{ error.message || 'Failed to load analytics data.' }}
    </div>

    <!-- Data Dashboard -->
    <div v-else-if="data?.success" class="space-y-8">
      
      <!-- Top Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Average FQS -->
        <div class="relative rounded-[2rem] bg-[#272a31]/60 backdrop-blur-[24px] overflow-hidden p-8 group transition-all duration-300 hover:-translate-y-1">
          <div class="absolute inset-0 border-t border-l border-[#adc6ff]/10 rounded-[2rem] pointer-events-none"></div>
          <div class="flex items-center justify-between mb-8 relative z-10">
            <span class="text-[0.6875rem] uppercase tracking-[0.15em] text-[#c1c6d7] font-medium">Avg Focus Quality</span>
            <span class="material-symbols-outlined text-[#4b8eff]">psychology</span>
          </div>
          <div class="relative z-10 text-white flex items-baseline">
            <span class="text-5xl md:text-6xl font-bold tracking-[-0.04em] text-[#adc6ff]">{{ averageFQS }}</span>
            <span class="text-lg text-[#c1c6d7] ml-2">/ 100</span>
          </div>
          <div class="mt-6 flex items-center text-xs text-[#4b8eff] font-medium relative z-10">
            <span>Based on latest {{ data?.recentSessions?.length || 0 }} sessions</span>
          </div>
          <!-- Signature Glow -->
          <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-[#4b8eff]/10 rounded-full blur-[50px] group-hover:bg-[#4b8eff]/20 transition-all duration-700 pointer-events-none"></div>
        </div>

        <!-- Peak Flow Time -->
        <div class="relative rounded-[2rem] bg-[#272a31]/60 backdrop-blur-[24px] overflow-hidden p-8 group transition-all duration-300 hover:-translate-y-1">
          <div class="absolute inset-0 border-t border-l border-[#adc6ff]/10 rounded-[2rem] pointer-events-none"></div>
          <div class="flex items-center justify-between mb-8 relative z-10">
            <span class="text-[0.6875rem] uppercase tracking-[0.15em] text-[#c1c6d7] font-medium">Golden Hour (Peak Flow)</span>
            <span class="material-symbols-outlined text-[#4b8eff]">wb_sunny</span>
          </div>
          <div class="relative z-10 text-white">
            <span class="text-3xl md:text-4xl font-bold tracking-[-0.04em] text-[#adc6ff]">{{ bestPeakHour }}</span>
          </div>
          <div class="mt-6 flex items-center text-xs text-[#c1c6d7] font-medium relative z-10">
            <span class="material-symbols-outlined text-[14px] mr-1">auto_awesome</span>
            <span>Your optimal focus window</span>
          </div>
          <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-[#4b8eff]/10 rounded-full blur-[50px] group-hover:bg-[#4b8eff]/20 transition-all duration-700 pointer-events-none"></div>
        </div>

        <!-- System Status -->
        <div class="relative rounded-[2rem] bg-[#272a31]/60 backdrop-blur-[24px] overflow-hidden p-8 group transition-all duration-300 hover:-translate-y-1">
          <div class="absolute inset-0 border-t border-l border-[#adc6ff]/10 rounded-[2rem] pointer-events-none"></div>
          <div class="flex items-center justify-between mb-8 relative z-10">
            <span class="text-[0.6875rem] uppercase tracking-[0.15em] text-[#c1c6d7] font-medium">Recorded Sessions</span>
            <span class="material-symbols-outlined text-[#4b8eff]">database</span>
          </div>
          <div class="relative z-10 text-white">
            <span class="text-5xl md:text-6xl font-bold tracking-[-0.04em] text-[#adc6ff]">{{ totalSessionsInFatigue }}</span>
          </div>
          <div class="mt-6 flex items-center text-xs text-[#4b8eff] font-medium relative z-10">
            <span>Aggregated over the last 30 days</span>
          </div>
          <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-[#4b8eff]/10 rounded-full blur-[50px] group-hover:bg-[#4b8eff]/20 transition-all duration-700 pointer-events-none"></div>
        </div>
      </div>

      <!-- Advanced Analytics Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Distraction Leakage -->
        <div class="relative rounded-[2rem] bg-[#272a31]/60 backdrop-blur-[24px] overflow-hidden p-8 group">
          <div class="absolute inset-0 border-t border-l border-[#adc6ff]/10 rounded-[2rem] pointer-events-none"></div>
          <div class="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 class="text-xl font-bold tracking-tight text-white mb-1">Distraction Leakage</h3>
              <p class="text-[0.6875rem] uppercase tracking-[0.15em] text-[#c1c6d7]">Vulnerability by Task</p>
            </div>
            <span class="material-symbols-outlined text-[#c1c6d7]">water_drop</span>
          </div>

          <div class="space-y-6 relative z-10 mt-6">
            <template v-if="data?.insights?.distractionLeakage?.length > 0">
              <div v-for="(task, idx) in data?.insights?.distractionLeakage?.slice(0, 4)" :key="idx" class="space-y-2">
                <div class="flex justify-between items-center text-sm">
                  <span class="font-medium text-white truncate max-w-[60%]">{{ task.task_name || 'Uncategorized' }}</span>
                  <span class="text-[#c1c6d7] text-xs">{{ (task.total_leakage_hours).toFixed(1) }}h lost ({{ (task.leakage_ratio * 100).toFixed(0) }}%)</span>
                </div>
                <div class="w-full bg-[#191c22] rounded-full h-2 relative overflow-hidden shadow-inner">
                  <div class="absolute left-0 top-0 h-full bg-gradient-to-r from-[#4b8eff] to-[#adc6ff] rounded-full" :style="{ width: `${Math.min(100, task.leakage_ratio * 100)}%` }"></div>
                </div>
              </div>
            </template>
            <template v-else>
              <!-- Empty State Skeletons -->
              <div v-for="i in 3" :key="'dl-'+i" class="space-y-2 opacity-30">
                <div class="flex justify-between items-center text-sm">
                  <span class="font-medium text-white truncate max-w-[60%]">No task yet</span>
                  <span class="text-[#c1c6d7] text-xs">0.0h lost (0%)</span>
                </div>
                <div class="w-full bg-[#191c22] rounded-full h-2 relative overflow-hidden shadow-inner">
                  <div class="absolute left-0 top-0 h-full bg-[#4b8eff]/20 rounded-full" style="width: 5%"></div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Fatigue Curve -->
        <div class="relative rounded-[2rem] bg-[#272a31]/60 backdrop-blur-[24px] overflow-hidden p-8 group">
          <div class="absolute inset-0 border-t border-l border-[#adc6ff]/10 rounded-[2rem] pointer-events-none"></div>
          <div class="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 class="text-xl font-bold tracking-tight text-white mb-1">Fatigue Curve</h3>
              <p class="text-[0.6875rem] uppercase tracking-[0.15em] text-[#c1c6d7]">Abandon Rate % per Session Seq.</p>
            </div>
            <span class="material-symbols-outlined text-[#c1c6d7]">show_chart</span>
          </div>

          <div class="flex items-end justify-around h-48 w-full gap-2 relative z-10 mt-6">
            <template v-if="data?.insights?.fatigueCurve?.length > 0">
              <div v-for="(seq, idx) in data?.insights?.fatigueCurve?.slice(0, 7)" :key="idx" class="flex-1 flex flex-col items-center group/bar">
                <div class="w-full max-w-[32px] bg-[#191c22] rounded-t-xl relative h-36 border-b border-[#4b8eff]/30 overflow-hidden shadow-inner flex items-end">
                  <div class="w-full bg-gradient-to-t from-[#4b8eff]/40 to-[#adc6ff]/80 transition-all duration-700 ease-out group-hover/bar:brightness-125" :style="{ height: `${Math.max(5, seq.abandon_rate)}%` }"></div>
                </div>
                <span class="mt-4 text-[0.6875rem] font-bold text-[#c1c6d7]">#{{ seq.daily_sequence_number }}</span>
                <span class="text-[10px] text-[#adc6ff] font-medium opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">{{ seq.abandon_rate.toFixed(0) }}%</span>
              </div>
            </template>
            <template v-else>
              <!-- Empty State Bars -->
              <div v-for="i in 7" :key="'fc-'+i" class="flex-1 flex flex-col items-center opacity-30">
                <div class="w-full max-w-[32px] bg-[#191c22] rounded-t-xl relative h-36 border-b border-[#4b8eff]/10 overflow-hidden shadow-inner flex items-end">
                  <div class="w-full bg-[#4b8eff]/10" style="height: 5%"></div>
                </div>
                <span class="mt-4 text-[0.6875rem] font-bold text-[#c1c6d7]">#{{ i }}</span>
              </div>
            </template>
          </div>
        </div>

      </div>

      <!-- Recent Sessions Log -->
      <div class="relative rounded-[2rem] bg-[#272a31]/60 backdrop-blur-[24px] overflow-hidden p-8">
        <div class="absolute inset-0 border-t border-l border-[#adc6ff]/10 rounded-[2rem] pointer-events-none"></div>
        <div class="flex items-center justify-between mb-8 relative z-10">
          <h3 class="text-xl font-bold tracking-tight text-white">Recent Sessions Log</h3>
          <span class="text-[0.6875rem] uppercase tracking-[0.15em] text-[#c1c6d7] hover:text-[#adc6ff] transition-colors cursor-pointer">View All</span>
        </div>

        <div class="overflow-x-auto relative z-10">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-[#c1c6d7]/10">
                <th class="py-4 text-[0.6875rem] uppercase tracking-[0.15em] text-[#c1c6d7] font-medium">Date</th>
                <th class="py-4 text-[0.6875rem] uppercase tracking-[0.15em] text-[#c1c6d7] font-medium">Type</th>
                <th class="py-4 text-[0.6875rem] uppercase tracking-[0.15em] text-[#c1c6d7] font-medium">Duration</th>
                <th class="py-4 text-[0.6875rem] uppercase tracking-[0.15em] text-[#c1c6d7] font-medium">Interruptions</th>
                <th class="py-4 text-[0.6875rem] uppercase tracking-[0.15em] text-[#c1c6d7] font-medium text-right">FQS Score</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="data?.recentSessions?.length > 0">
                <tr class="border-b border-[#c1c6d7]/5 transition-colors hover:bg-[#ffffff]/5" v-for="session in data?.recentSessions" :key="session.session_id">
                  <td class="py-4 text-sm text-white">{{ new Date(session.started_at).toLocaleDateString() }}</td>
                  <td class="py-4 text-sm">
                    <span class="px-3 py-1 bg-[#191c22] rounded-full text-xs font-medium text-[#adc6ff] capitalize">
                      {{ session.type.replace('_', ' ') }}
                    </span>
                  </td>
                  <td class="py-4 text-sm text-[#c1c6d7]">{{ Math.round(session.actual_duration / 60) }}m / {{ Math.round(session.planned_duration / 60) }}m</td>
                  <td class="py-4 text-sm text-[#c1c6d7]">
                    <span v-if="session.pause_count > 0" class="text-red-400">{{ session.pause_count }} times ({{ Math.round(session.total_pause_duration / 60) }}m)</span>
                    <span v-else class="text-green-400">Deep Focus</span>
                  </td>
                  <td class="py-4 text-sm font-bold text-right text-white">
                    {{ session.fqs_score.toFixed(0) }}
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="5" class="py-12 text-sm text-[#c1c6d7] text-center opacity-70">
                    No recent sessions found. Start a focus session to generate data.
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
      </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

useHead({
  title: 'Performance Analytics'
})

// Fetch Analytics Data
const { data, pending, error } = await useFetch('/api/analytics/dashboard')

// Compute aggregated values
const averageFQS = computed(() => {
  if (!data.value?.recentSessions || data.value.recentSessions.length === 0) return 0
  const total = data.value.recentSessions.reduce((acc: number, session: any) => acc + session.fqs_score, 0)
  return Math.round(total / data.value.recentSessions.length)
})

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const bestPeakHour = computed(() => {
  if (!data.value?.insights?.peakFlowTimes || data.value.insights.peakFlowTimes.length === 0) return 'Not enough data'
  const best = data.value.insights.peakFlowTimes[0]
  const period = best.hour_of_day >= 12 ? 'PM' : 'AM'
  const hour12 = best.hour_of_day % 12 || 12
  return `${daysOfWeek[best.day_of_week]}, ${hour12} ${period}`
})

const totalSessionsInFatigue = computed(() => {
  if (!data.value?.insights?.fatigueCurve) return 0
  return data.value.insights.fatigueCurve.reduce((acc: number, curve: any) => acc + curve.total_sessions, 0)
})
</script>
