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
        <!-- If Empty State -->
        <div v-if="store.completedSessions === 0" class="text-center py-12">
          <span class="material-symbols-outlined text-6xl text-muted/30 block mb-4">hourglass_empty</span>
          <p class="text-sm text-muted">No sessions completed yet. Start focusing to build your history!</p>
        </div>
        
        <!-- Mocked List of Sessions (Simulating history data) -->
        <template v-else>
          <div v-for="n in 5" :key="n" class="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl hover:bg-surface-variant transition-colors group cursor-pointer border border-transparent hover:border-muted/10">
            <!-- Icon -->
            <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform"
                 :class="n % 3 === 0 ? 'bg-tertiary/10 text-tertiary group-hover:scale-110' : 'bg-primary-glow/10 text-primary group-hover:scale-110'">
              <span class="material-symbols-outlined">{{ n % 3 === 0 ? 'coffee' : 'workspace_premium' }}</span>
            </div>
            
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold truncate text-white">
                {{ n % 3 === 0 ? 'Rest Period' : 'Deep Work Session' }}
              </p>
              <p class="text-xs text-muted mt-1 uppercase tracking-wider">
                {{ n % 3 === 0 ? 'Short Break' : 'Focus' }}
              </p>
            </div>
            
            <!-- Metadata -->
            <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1 mt-2 sm:mt-0">
              <div class="text-sm font-mono font-medium text-white">
                {{ n % 3 === 0 ? '05:00' : '25:00' }}
              </div>
              <div class="text-[0.6875rem] text-muted whitespace-nowrap">
                Today, 10:{{ 45 - n * 10 }} AM
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

<script setup>
import { useTimerStore } from '~/stores/useTimerStore'
const store = useTimerStore()
</script>
