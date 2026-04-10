<template>
  <div class="relative bg-surface-container/60 backdrop-blur-3xl rounded-3xl p-6 overflow-hidden">
    <!-- Ghost Border: top-left light path -->
    <div class="absolute inset-0 border-t border-l border-accent-soft/10 rounded-3xl pointer-events-none"></div>

    <div class="flex justify-between items-center mb-6">
      <h3 class="font-bold text-[0.6875rem] uppercase tracking-[0.15em] text-muted">Session History</h3>
      <NuxtLink to="/sessions"
        class="text-primary text-xs font-semibold hover:text-accent-soft transition-colors">
        View All
      </NuxtLink>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="sessionStore.isLoadingRecent" class="space-y-3">
      <div v-for="i in 3" :key="i"
           class="h-14 bg-surface-variant/40 rounded-2xl animate-pulse" />
    </div>

    <!-- Empty State -->
    <div v-else-if="sessionStore.recentSessions.length === 0"
         class="text-center py-6">
      <span class="material-symbols-outlined text-3xl text-muted/40 block mb-2">timer</span>
      <p class="text-xs text-muted opacity-60">Start focusing to log your history!</p>
    </div>

    <!-- Session List -->
    <div v-else class="space-y-3">
      <div
        v-for="session in sessionStore.recentSessions"
        :key="session.id"
        class="flex gap-3 p-3 rounded-2xl hover:bg-surface-variant/60 transition-colors group cursor-pointer"
      >
        <div class="w-9 h-9 rounded-full bg-primary-glow/10 flex items-center justify-center shrink-0
                    group-hover:scale-110 transition-transform">
          <span class="material-symbols-outlined text-[18px] text-primary">workspace_premium</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-white">Focus Session</p>
          <p class="text-[0.6rem] text-muted uppercase tracking-wider mt-0.5">
            {{ formatDuration(session.actual_duration) }}
          </p>
        </div>
        <div class="text-[0.6rem] text-muted/70 self-center shrink-0">
          {{ formatTime(session.started_at) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Không cần watch hay fetch ở đây.
// Data đã được load 1 lần duy nhất bởi useAuthStore.initAuthSession()
// thông qua useSessionStore().loadData()
import { useSessionStore } from '~/stores/useSessionStore'

const sessionStore = useSessionStore()

const formatDuration = (seconds: number) => {
  const min = Math.floor(seconds / 60)
  return `${min.toString().padStart(2, '0')} min`
}

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
