<template>
  <div class="bg-surface-container/60 backdrop-blur-3xl ghost-border rounded-3xl p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="font-bold text-sm uppercase tracking-[0.15em] text-muted">History</h3>
      <NuxtLink to="/sessions" class="text-primary text-xs font-semibold hover:text-primary-glow transition-colors">
        View All
      </NuxtLink>
    </div>
    
    <div class="space-y-4">
      <div v-if="loading" class="text-center py-4">
         <span class="material-symbols-outlined animate-spin text-primary opacity-50">progress_activity</span>
      </div>
      <div v-else-if="sessions.length === 0" class="text-center py-4 text-xs text-muted opacity-60">
        Start focusing to log your history!
      </div>
      <!-- Session Entries -->
      <div v-else v-for="session in sessions" :key="session.id" class="flex gap-4 p-3 rounded-2xl hover:bg-surface-variant transition-colors group cursor-pointer border border-transparent hover:border-muted/10 opacity-90 hover:opacity-100">
        <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform"
             :class="session.type === 'deep_focus' ? 'bg-primary-glow/10 text-primary group-hover:scale-110' : 'bg-tertiary/10 text-tertiary group-hover:scale-110'">
          <span class="material-symbols-outlined text-sm">{{ session.type === 'deep_focus' ? 'workspace_premium' : 'coffee' }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold truncate text-white capitalize">
            {{ session.type.replace('_', ' ') }}
          </p>
          <p class="text-[0.6rem] text-muted uppercase tracking-tighter">
            {{ formatDuration(session.actual_duration) }} • {{ session.status }}
          </p>
        </div>
        <div class="text-[0.6rem] text-muted font-medium self-center opacity-70">
          {{ formatTime(session.started_at) }}
        </div>
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
    const { data } = await (supabase.from('pomo_sessions') as any)
      .select('*')
      .eq('user_id', authStore.user.id)
      .order('started_at', { ascending: false })
      .limit(3)
    
    if (data) sessions.value = data
  }
  loading.value = false
})

const formatDuration = (seconds: number) => {
  const min = Math.floor(seconds / 60)
  return `${min.toString().padStart(2, '0')} min`
}

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
