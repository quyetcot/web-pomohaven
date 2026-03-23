<template>
  <div class="max-w-5xl mx-auto space-y-8 pt-8 px-2 md:px-0">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <header>
        <div class="text-[0.6875rem] uppercase tracking-[0.1em] text-muted font-medium mb-1">Performance Metrics</div>
        <h1 class="text-3xl md:text-4xl font-semibold tracking-tight text-white">Focus Analytics</h1>
      </header>
      
      <!-- Toggle Switch -->
      <div class="bg-surface-container/80 p-1.5 rounded-full flex items-center shadow-lg border border-muted/10">
        <button class="px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider text-muted hover:text-white transition-colors">Daily</button>
        <button class="px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary-glow text-white shadow-[0_0_15px_rgba(75,142,255,0.4)]">Weekly</button>
        <button class="px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider text-muted hover:text-white transition-colors">Monthly</button>
      </div>
    </div>
    
    <!-- Stats Bento Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Total Focus Time -->
      <div class="bg-surface-container/60 backdrop-blur-3xl p-8 rounded-3xl ghost-border flex flex-col justify-between overflow-hidden relative group">
        <div class="flex items-center justify-between mb-8 relative z-10">
          <span class="text-[0.6875rem] uppercase tracking-[0.1em] text-muted font-medium">Total Focus Time</span>
          <span class="material-symbols-outlined text-primary">schedule</span>
        </div>
        <div class="relative z-10 text-white">
          <span class="text-5xl font-semibold tracking-tighter">42.5</span>
          <span class="text-lg text-muted ml-2">hrs</span>
        </div>
        <div class="mt-6 flex items-center text-xs text-primary font-medium relative z-10">
          <span class="material-symbols-outlined text-sm mr-1">trending_up</span>
          <span>+12% from last week</span>
        </div>
        
        <!-- Glow effect -->
        <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-primary-glow/10 rounded-full blur-[50px] group-hover:bg-primary-glow/20 transition-all duration-700"></div>
      </div>
      
      <!-- Sessions Completed -->
      <div class="bg-surface-container/60 backdrop-blur-3xl p-8 rounded-3xl ghost-border flex flex-col justify-between overflow-hidden relative group">
        <div class="flex items-center justify-between mb-8 relative z-10">
          <span class="text-[0.6875rem] uppercase tracking-[0.1em] text-muted font-medium">Sessions Completed</span>
          <span class="material-symbols-outlined text-primary">task_alt</span>
        </div>
        <div class="relative z-10 text-white">
          <span class="text-5xl font-semibold tracking-tighter">{{ store.sessionsCompleted > 0 ? store.sessionsCompleted : 102 }}</span>
        </div>
        <div class="mt-6 flex items-center text-xs text-primary font-medium relative z-10">
          <span class="material-symbols-outlined text-sm mr-1">verified</span>
          <span>Daily streak: 14 days</span>
        </div>
        
        <!-- Glow effect -->
        <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-primary-glow/10 rounded-full blur-[50px] group-hover:bg-primary-glow/20 transition-all duration-700"></div>
      </div>
      
      <!-- Most Listened -->
      <div class="bg-surface-container/60 backdrop-blur-3xl p-8 rounded-3xl ghost-border flex flex-col justify-between overflow-hidden relative group">
        <div class="flex items-center justify-between mb-8 relative z-10">
          <span class="text-[0.6875rem] uppercase tracking-[0.1em] text-muted font-medium">Aural Sanctuary</span>
          <span class="material-symbols-outlined text-primary">equalizer</span>
        </div>
        <div class="flex items-center gap-4 relative z-10 mb-8">
          <div class="w-14 h-14 rounded-lg bg-surface-variant overflow-hidden shadow-inner shrink-0">
            <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=64&h=64&fit=crop&q=80"/>
          </div>
          <div class="flex-1 min-w-0">
            <span class="block text-lg font-semibold text-white truncate">Lofi Girl</span>
            <span class="text-xs text-muted block truncate">Midnight Beats</span>
          </div>
        </div>
        <div class="mt-auto flex items-center text-xs text-muted relative z-10">
          <span>18.4 hours playback</span>
        </div>
        
        <!-- Glow effect -->
        <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-primary-glow/10 rounded-full blur-[50px] group-hover:bg-primary-glow/20 transition-all duration-700"></div>
      </div>
    </div>
    
    <!-- Charts Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Weekly Productivity Bar Chart -->
      <div class="lg:col-span-2 bg-surface-container/60 backdrop-blur-3xl p-8 rounded-3xl ghost-border relative overflow-hidden group">
        <div class="absolute -left-20 top-20 w-64 h-64 bg-primary-glow/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div class="flex items-center justify-between mb-10 relative z-10">
          <div>
            <h3 class="text-lg font-semibold text-white">Weekly Productivity</h3>
            <p class="text-xs text-muted mt-1">Focus distribution across the last 7 days</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-primary-glow"></div>
            <span class="text-[10px] uppercase tracking-widest text-muted">Focus Hours</span>
          </div>
        </div>
        
        <div class="flex items-end justify-between h-56 w-full gap-4 relative z-10 mt-12">
          <!-- Mon -->
          <div class="flex-1 flex flex-col items-center group/bar cursor-pointer">
            <div class="w-full bg-surface-variant/50 rounded-t-lg relative h-48 transition-colors">
              <div class="absolute bottom-0 left-0 w-full bg-primary-glow/50 rounded-t-lg transition-all duration-500 h-[40%] group-hover/bar:bg-primary-glow group-hover/bar:shadow-[0_0_15px_rgba(75,142,255,0.6)]"></div>
            </div>
            <span class="mt-4 text-[10px] uppercase tracking-widest text-muted group-hover/bar:text-white transition-colors">Mon</span>
          </div>
          <!-- Tue -->
          <div class="flex-1 flex flex-col items-center group/bar cursor-pointer">
            <div class="w-full bg-surface-variant/50 rounded-t-lg relative h-48 transition-colors">
              <div class="absolute bottom-0 left-0 w-full bg-primary-glow/50 rounded-t-lg transition-all duration-500 h-[65%] group-hover/bar:bg-primary-glow group-hover/bar:shadow-[0_0_15px_rgba(75,142,255,0.6)]"></div>
            </div>
            <span class="mt-4 text-[10px] uppercase tracking-widest text-muted group-hover/bar:text-white transition-colors">Tue</span>
          </div>
          <!-- Wed -->
          <div class="flex-1 flex flex-col items-center group/bar cursor-pointer">
            <div class="w-full bg-surface-variant/50 rounded-t-lg relative h-48 transition-colors">
              <div class="absolute bottom-0 left-0 w-full bg-primary-glow/50 rounded-t-lg transition-all duration-500 h-[85%] group-hover/bar:bg-primary-glow group-hover/bar:shadow-[0_0_15px_rgba(75,142,255,0.6)]"></div>
            </div>
            <span class="mt-4 text-[10px] uppercase tracking-widest text-muted group-hover/bar:text-white transition-colors">Wed</span>
          </div>
          <!-- Thu -->
          <div class="flex-1 flex flex-col items-center group/bar cursor-pointer">
            <div class="w-full bg-surface-variant/50 rounded-t-lg relative h-48 transition-colors">
              <div class="absolute bottom-0 left-0 w-full bg-primary-glow/50 rounded-t-lg transition-all duration-500 h-[95%] group-hover/bar:bg-primary-glow group-hover/bar:shadow-[0_0_15px_rgba(75,142,255,0.6)]"></div>
            </div>
            <span class="mt-4 text-[10px] uppercase tracking-widest text-muted group-hover/bar:text-white transition-colors">Thu</span>
          </div>
          <!-- Fri -->
          <div class="flex-1 flex flex-col items-center group/bar cursor-pointer">
            <div class="w-full bg-surface-variant/50 rounded-t-lg relative h-48 transition-colors">
              <div class="absolute bottom-0 left-0 w-full bg-primary-glow/50 rounded-t-lg transition-all duration-500 h-[55%] group-hover/bar:bg-primary-glow group-hover/bar:shadow-[0_0_15px_rgba(75,142,255,0.6)]"></div>
            </div>
            <span class="mt-4 text-[10px] uppercase tracking-widest text-muted group-hover/bar:text-white transition-colors">Fri</span>
          </div>
          <!-- Sat -->
          <div class="flex-1 flex flex-col items-center group/bar cursor-pointer">
            <div class="w-full bg-surface-variant/50 rounded-t-lg relative h-48 transition-colors">
              <div class="absolute bottom-0 left-0 w-full bg-primary-glow/50 rounded-t-lg transition-all duration-500 h-[30%] group-hover/bar:bg-primary-glow group-hover/bar:shadow-[0_0_15px_rgba(75,142,255,0.6)]"></div>
            </div>
            <span class="mt-4 text-[10px] uppercase tracking-widest text-muted group-hover/bar:text-white transition-colors">Sat</span>
          </div>
          <!-- Sun -->
          <div class="flex-1 flex flex-col items-center group/bar cursor-pointer">
            <div class="w-full bg-surface-variant/50 rounded-t-lg relative h-48 transition-colors">
              <div class="absolute bottom-0 left-0 w-full bg-primary-glow/50 rounded-t-lg transition-all duration-500 h-[20%] group-hover/bar:bg-primary-glow group-hover/bar:shadow-[0_0_15px_rgba(75,142,255,0.6)]"></div>
            </div>
            <span class="mt-4 text-[10px] uppercase tracking-widest text-muted group-hover/bar:text-white transition-colors">Sun</span>
          </div>
        </div>
      </div>
      
      <!-- Focus Breakdown Ring Chart -->
      <div class="bg-surface-container/60 backdrop-blur-3xl p-8 rounded-3xl ghost-border flex flex-col items-center text-center">
        <div class="w-full text-left mb-6">
          <h3 class="text-lg font-semibold text-white">Focus Ratio</h3>
          <p class="text-xs text-muted mt-1">Work vs Rest balance</p>
        </div>
        
        <div class="relative w-48 h-48 mb-10 mt-4">
          <!-- Ring SVG -->
          <svg class="w-full h-full transform -rotate-90">
            <circle class="text-surface-variant" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" stroke-width="12"></circle>
            <!-- Focus (75%) -->
            <circle class="text-primary-glow drop-shadow-[0_0_8px_rgba(75,142,255,0.6)] transition-all duration-1000" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" stroke-dasharray="502" stroke-dashoffset="125" stroke-linecap="round" stroke-width="12"></circle>
            <!-- Break (25%) -> stroke-dashoffset: 400 -->
            <circle class="text-tertiary drop-shadow-[0_0_8px_rgba(255,181,149,0.4)] transition-all duration-1000" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" stroke-dasharray="502" stroke-dashoffset="380" stroke-linecap="round" stroke-width="12"></circle>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-3xl font-bold text-white tracking-tighter">75%</span>
            <span class="text-[10px] uppercase tracking-widest text-muted mt-1">Focus Rate</span>
          </div>
        </div>
        
        <div class="w-full space-y-4 mt-auto">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-primary-glow"></div>
              <span class="text-xs text-muted">Focus Sessions</span>
            </div>
            <span class="text-sm font-semibold text-white">76 sessions</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-tertiary"></div>
              <span class="text-xs text-muted">Break Periods</span>
            </div>
            <span class="text-sm font-semibold text-white">26 sessions</span>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { useTimerStore } from '~/stores/useTimerStore'
const store = useTimerStore()
</script>
