<template>
  <div class="max-w-4xl mx-auto space-y-8 pt-8 px-2 md:px-0">
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="text-[0.6875rem] uppercase tracking-[0.1em] text-muted font-medium mb-1">Time Log</div>
        <h1 class="text-3xl md:text-4xl font-semibold tracking-tight text-white">Focus Sessions</h1>
      </div>

      <!-- Filter -->
      <div class="bg-surface-container/80 p-1.5 rounded-full flex items-center shadow-lg border border-muted/10">
        <button
          v-for="f in filters" :key="f.key"
          :aria-label="`Filter by ${f.label}`"
          @click="activeFilter = f.key"
          :class="activeFilter === f.key
            ? 'bg-surface-variant text-white'
            : 'text-muted hover:text-white'"
          class="px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors"
        >{{ f.label }}</button>
      </div>
    </header>

    <!-- Sessions Timeline / List -->
    <div class="bg-surface-container/60 backdrop-blur-3xl ghost-border rounded-3xl p-8 space-y-6">
      <div class="flex items-center justify-between border-b border-muted/10 pb-4">
        <h3 class="font-bold text-sm uppercase tracking-[0.15em] text-muted">
          {{ filteredSessions.length }} Session{{ filteredSessions.length !== 1 ? 's' : '' }}
        </h3>
        <button
          aria-label="Export sessions as CSV"
          @click="exportCsv"
          class="text-xs text-primary-glow font-medium hover:text-primary transition-colors flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-[14px]">download</span>
          Export CSV
        </button>
      </div>

      <div class="space-y-4">
        <!-- Loading -->
        <div v-if="sessionStore.isLoadingRecent" class="text-center py-12">
          <span class="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredSessions.length === 0" class="text-center py-12">
          <span class="material-symbols-outlined text-6xl text-muted/30 block mb-4">hourglass_empty</span>
          <p class="text-sm text-muted">No sessions found for this period.</p>
        </div>

        <!-- Real List of Sessions -->
        <template v-else>
          <div
            v-for="session in paginatedSessions"
            :key="session.id"
            class="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl hover:bg-surface-variant transition-colors group cursor-pointer border border-transparent hover:border-muted/10"
          >
            <!-- Icon -->
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
              :class="session.type === 'deep_focus' ? 'bg-primary-glow/10 text-primary' : 'bg-tertiary/10 text-tertiary'"
            >
              <span class="material-symbols-outlined">{{ sessionIcon(session.type) }}</span>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold truncate text-white">
                {{ sessionLabel(session.type) }}
              </p>
              <p
                class="text-xs mt-1 uppercase tracking-wider font-medium"
                :class="statusColor(session.status)"
              >{{ session.status }}</p>
            </div>

            <!-- Metadata -->
            <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1 mt-2 sm:mt-0">
              <div class="text-sm font-mono font-medium text-white">
                {{ formatDuration(session.actual_duration) }}
              </div>
              <div class="text-[0.6875rem] text-muted whitespace-nowrap">
                {{ formatTimeDate(session.started_at) }}
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center pt-6 border-t border-muted/10 gap-2">
        <button
          aria-label="Previous page"
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:bg-surface-variant hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span class="material-symbols-outlined text-sm">chevron_left</span>
        </button>

        <button
          v-for="p in totalPages" :key="p"
          :aria-label="`Go to page ${p}`"
          @click="currentPage = p"
          :class="currentPage === p
            ? 'bg-primary-glow text-void font-bold shadow-lg'
            : 'text-muted hover:bg-surface-variant hover:text-white'"
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
        >{{ p }}</button>

        <button
          aria-label="Next page"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:bg-surface-variant hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span class="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useSessionStore } from '~/stores/useSessionStore'
import { useAuthStore } from '~/stores/useAuthStore'

const sessionStore = useSessionStore()
const authStore = useAuthStore()

onMounted(() => {
  if (authStore.user && !sessionStore.isLoaded) {
    sessionStore.loadData()
  }
})

// ── Filter ──────────────────────────────────────────────
type FilterKey = 'all' | 'week' | 'today'

const filters = [
  { key: 'all' as FilterKey,  label: 'All Time' },
  { key: 'week' as FilterKey, label: 'This Week' },
  { key: 'today' as FilterKey, label: 'Today' },
]

const activeFilter = ref<FilterKey>('week')

// Reset to page 1 whenever filter changes
watch(activeFilter, () => { currentPage.value = 1 })

const filteredSessions = computed(() => {
  const now = new Date()
  const sessions = sessionStore.allSessions

  if (activeFilter.value === 'today') {
    const todayStr = now.toDateString()
    return sessions.filter(s => new Date(s.started_at).toDateString() === todayStr)
  }
  if (activeFilter.value === 'week') {
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 6)
    weekAgo.setHours(0, 0, 0, 0)
    return sessions.filter(s => new Date(s.started_at) >= weekAgo)
  }
  return sessions
})

// ── Pagination ───────────────────────────────────────────
const PAGE_SIZE = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(filteredSessions.value.length / PAGE_SIZE))

const paginatedSessions = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredSessions.value.slice(start, start + PAGE_SIZE)
})

// ── Helpers ──────────────────────────────────────────────
const sessionLabel = (type: string) => {
  const map: Record<string, string> = {
    deep_focus: 'Focus Session',
    short_break: 'Short Break',
    long_break: 'Long Break',
  }
  return map[type] ?? type.replace('_', ' ')
}

const sessionIcon = (type: string) => {
  if (type === 'deep_focus') return 'workspace_premium'
  if (type === 'long_break') return 'self_improvement'
  return 'coffee'
}

const statusColor = (status: string) => {
  if (status === 'completed') return 'text-green-400'
  if (status === 'skipped')   return 'text-yellow-500'
  return 'text-red-400'
}

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`
}

const formatTimeDate = (isoString: string) => {
  const d = new Date(isoString)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// ── Export CSV ───────────────────────────────────────────
const exportCsv = () => {
  const header = 'Type,Status,Duration (min),Started At'
  const rows = filteredSessions.value.map(s => [
    sessionLabel(s.type),
    s.status,
    Math.floor(s.actual_duration / 60),
    formatTimeDate(s.started_at),
  ].join(','))

  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pomohaven-sessions-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
