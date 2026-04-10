<template>
  <div class="relative bg-surface/60 rounded-3xl p-6 overflow-hidden backdrop-blur-sm">
    <!-- Ghost Border: top-left light path -->
    <div class="absolute inset-0 border-t border-l border-accent-soft/10 rounded-3xl pointer-events-none"></div>

    <!-- 7-Day Bar Chart -->
    <div class="flex items-end justify-between gap-1.5 h-20 mb-4">
      <div
        v-for="(height, idx) in sessionStore.weeklyData"
        :key="idx"
        class="flex-1 rounded-t-lg transition-all duration-700 ease-out"
        :class="idx === 6
          ? 'bg-primary-glow/80 shadow-[0_0_15px_rgba(75,142,255,0.3)]'
          : 'bg-surface-variant hover:bg-primary-glow/40'"
        :style="{ height: `${height}%` }"
      />
    </div>

    <!-- Day labels -->
    <div class="flex justify-between mb-4">
      <span
        v-for="(day, idx) in dayLabels"
        :key="idx"
        class="flex-1 text-center text-[0.55rem] text-muted/50 uppercase"
        :class="idx === 6 ? 'text-primary/70' : ''"
      >{{ day }}</span>
    </div>

    <!-- Stats -->
    <div v-if="sessionStore.isLoadingStats" class="flex gap-4">
      <div class="h-10 flex-1 bg-surface-variant/40 rounded-xl animate-pulse" />
      <div class="h-10 flex-1 bg-surface-variant/40 rounded-xl animate-pulse" />
    </div>
    <div v-else class="flex justify-between items-center">
      <div>
        <p class="text-2xl font-bold text-white">
          {{ sessionStore.todayFocusHrs }}<span class="text-sm font-normal text-muted ml-1">hrs</span>
        </p>
        <p class="text-[0.6rem] uppercase tracking-widest text-muted mt-0.5">Focus time today</p>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold text-tertiary">{{ sessionStore.todayCount }}</p>
        <p class="text-[0.6rem] uppercase tracking-widest text-muted mt-0.5">Sessions done</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Không cần watch hay fetch ở đây.
// Data đã được load 1 lần duy nhất bởi useAuthStore.initAuthSession()
// thông qua useSessionStore().loadData()
import { computed } from 'vue'
import { useSessionStore } from '~/stores/useSessionStore'

const sessionStore = useSessionStore()

const dayLabels = computed(() => {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const today = new Date().getDay()
  return Array.from({ length: 7 }, (_, i) => days[(today - 6 + i + 7) % 7])
})
</script>
