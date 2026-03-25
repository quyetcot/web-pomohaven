<template>
  <div class="max-w-4xl mx-auto space-y-8 pt-8 px-2 md:px-0">
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="text-[0.6875rem] uppercase tracking-[0.1em] text-muted font-medium mb-1">Time Log</div>
        <h1 class="text-3xl md:text-4xl font-semibold tracking-tight text-white">Focus Sessions</h1>
      </div>
      
      <!-- Filter -->
      <div class="bg-surface-container/80 p-1.5 rounded-full flex items-center shadow-lg border border-muted/10">
        <button class="px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider text-muted hover:text-white transition-colors">All Time</button>
        <button class="px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider bg-surface-variant text-white">This Week</button>
        <button class="px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider text-muted hover:text-white transition-colors">Today</button>
      </div>
    </header>

    <!-- Sessions Timeline / List -->
    <div class="bg-surface-container/60 backdrop-blur-3xl ghost-border rounded-3xl p-8 space-y-6">
      <div class="flex items-center justify-between border-b border-muted/10 pb-4">
        <h3 class="font-bold text-sm uppercase tracking-[0.15em] text-muted">Recent History</h3>
        <span class="text-xs text-primary-glow font-medium">Export CSV</span>
      </div>
      
      <div class="space-y-4">
        <div v-if="loading" class="text-center py-12">
           <span class="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
        </div>
        
        <!-- If Empty State -->
        <div v-else-if="sessions.length === 0" class="text-center py-12">
          <span class="material-symbols-outlined text-6xl text-muted/30 block mb-4">hourglass_empty</span>
          <p class="text-sm text-muted">No sessions completed yet. Start focusing to build your history!</p>
        </div>
        
        <!-- Real List of Sessions -->
        <template v-else>
          <div v-for="session in sessions" :key="session.id" class="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl hover:bg-surface-variant transition-colors group cursor-pointer border border-transparent hover:border-muted/10">
            <!-- Icon -->
            <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform"
                 :class="session.type === 'deep_focus' ? 'bg-primary-glow/10 text-primary group-hover:scale-110' : 'bg-tertiary/10 text-tertiary group-hover:scale-110'">
              <span class="material-symbols-outlined">{{ session.type === 'deep_focus' ? 'workspace_premium' : 'coffee' }}</span>
            </div>
            
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold truncate text-white capitalize">
                {{ session.type.replace('_', ' ') }}
              </p>
              <p class="text-xs mt-1 uppercase tracking-wider" :class="session.status === 'completed' ? 'text-green-400' : 'text-yellow-500'">
                {{ session.status }}
              </p>
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
      
      <!-- Pagination (Fake) -->
      <div class="flex justify-center pt-6 border-t border-muted/10 gap-2">
        <button class="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:bg-surface-variant hover:text-white transition-colors disabled:opacity-50"><span class="material-symbols-outlined text-sm">chevron_left</span></button>
        <button class="w-8 h-8 rounded-full flex items-center justify-center bg-primary-glow text-void font-bold shadow-lg">1</button>
        <button class="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:bg-surface-variant hover:text-white transition-colors">2</button>
        <button class="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:bg-surface-variant hover:text-white transition-colors">3</button>
        <button class="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:bg-surface-variant hover:text-white transition-colors"><span class="material-symbols-outlined text-sm">chevron_right</span></button>
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

const sessions = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  if (authStore.user) {
    const { data } = await supabase
      .from('pomo_sessions' as any)
      .select('*')
      .eq('user_id', authStore.user.id)
      .order('started_at', { ascending: false })
      .limit(50)
    
    if (data) sessions.value = data
  }
  loading.value = false
})

const formatDuration = (seconds: number) => {
  const min = Math.floor(seconds / 60)
  return `${min.toString().padStart(2, '0')}:00`
}

const formatTimeDate = (isoString: string) => {
  const d = new Date(isoString)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
