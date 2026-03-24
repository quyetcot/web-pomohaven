<template>
  <div class="flex flex-col items-center group relative">
    <!-- Mode Selector -->
    <div class="flex p-1 bg-surface-container rounded-full mb-8 lg:mb-12 shadow-inner">
      <button @click="store.setMode('focus')" 
              :class="store.mode === 'focus' ? 'bg-primary-glow/20 text-primary' : 'text-muted hover:text-primary'"
              class="px-6 py-2 rounded-full text-[0.6875rem] font-bold uppercase tracking-widest transition-all">
        Focus
      </button>
      <button @click="store.setMode('shortBreak')" 
              :class="store.mode === 'shortBreak' ? 'bg-primary-glow/20 text-primary' : 'text-muted hover:text-primary'"
              class="px-6 py-2 rounded-full text-[0.6875rem] font-bold uppercase tracking-widest transition-all">
        Short Break
      </button>
      <button @click="store.setMode('longBreak')" 
              :class="store.mode === 'longBreak' ? 'bg-primary-glow/20 text-primary' : 'text-muted hover:text-primary'"
              class="px-6 py-2 rounded-full text-[0.6875rem] font-bold uppercase tracking-widest transition-all">
        Long Break
      </button>
    </div>

    <!-- The Focus Orb -->
    <div @click="store.toggle()" class="relative group cursor-pointer mt-4 select-none">
      <div class="w-80 h-80 md:w-96 md:h-96 rounded-full border-[6px] border-surface-floating flex items-center justify-center relative shadow-[0_0_100px_rgba(75,142,255,0.1)] transition-all duration-700 group-hover:shadow-[0_0_120px_rgba(75,142,255,0.15)] overflow-hidden" 
           style="background: radial-gradient(circle at center, rgba(75, 142, 255, 0.05) 0%, transparent 70%);">
        
        <!-- SVG Progress Ring -->
        <svg class="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          <circle cx="50%" cy="50%" fill="transparent" r="48%" 
                  stroke="url(#timerGradient)" 
                  stroke-dasharray="1200" 
                  :stroke-dashoffset="1200 - (1200 * store.progressPercent) / 100" 
                  stroke-linecap="round" stroke-width="6"
                  class="transition-all duration-1000 ease-linear"></circle>
          <defs>
            <linearGradient id="timerGradient" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stop-color="#adc6ff"></stop>
              <stop offset="100%" stop-color="#4b8eff"></stop>
            </linearGradient>
          </defs>
        </svg>

        <div class="text-center">
          <span class="block text-[0.6875rem] uppercase tracking-[0.3em] text-muted mb-2">
            {{ store.mode === 'focus' ? 'Current Session' : (store.mode === 'shortBreak' ? 'Short Rest' : 'Deep Rest') }}
          </span>
          <h2 class="text-7xl md:text-8xl font-semibold tracking-[-0.04em] text-white leading-none tabular-nums relative"
              :class="{ 'opacity-80': !store.isRunning }">
            {{ store.formattedTime }}
          </h2>
          <p class="text-sm text-primary mt-4 font-medium" v-show="store.mode === 'focus'">Deep Work Pipeline</p>
          <p class="text-sm text-tertiary mt-4 font-medium" v-show="store.mode !== 'focus'">Recharge Mode</p>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="mt-12 flex items-center gap-6 select-none">
      <button @click="store.reset()" 
              class="w-16 h-16 rounded-full flex items-center justify-center text-muted border border-muted/20 hover:border-primary/40 hover:text-primary transition-all active:scale-95" 
              aria-label="Reset Timer">
        <span class="material-symbols-outlined">refresh</span>
      </button>

      <button @click="store.toggle()" 
              class="px-16 py-5 rounded-full bg-primary-glow/80 hover:bg-primary-glow text-white font-bold uppercase tracking-[0.2em] text-sm signature-glow transition-all active:scale-95 min-w-[180px]">
        {{ store.isRunning ? 'Pause' : 'Start' }}
      </button>

      <button @click="store.skipSession()" 
              class="w-16 h-16 rounded-full flex items-center justify-center text-muted border border-muted/20 hover:border-primary/40 hover:text-primary transition-all active:scale-95" 
              aria-label="Skip Session">
        <span class="material-symbols-outlined">skip_next</span>
      </button>
    </div>
  
    <!-- Quick Set Time UI -->
    <div class="mt-12 w-full max-w-lg flex flex-col items-center gap-6 bg-surface-container/20 backdrop-blur-3xl p-8 rounded-[2.5rem] ghost-border border border-white/5 shadow-2xl">
      <div class="flex items-center gap-3 opacity-40">
        <div class="h-[1px] w-8 bg-white/20"></div>
        <div class="text-[0.625rem] uppercase tracking-[0.3em] text-muted font-bold">Quick Adjust Duration</div>
        <div class="h-[1px] w-8 bg-white/20"></div>
      </div>
      
      <!-- Predefined Chips -->
      <div class="flex flex-wrap justify-center gap-3">
        <button v-for="mins in [15, 25, 45, 60, 90]" :key="mins"
                @click="store.quickSet(mins)"
                class="px-5 py-2.5 rounded-2xl bg-surface-variant/30 hover:bg-primary-glow/20 border border-white/5 hover:border-primary-glow/40 text-xs text-muted hover:text-primary transition-all active:scale-95 font-medium">
          {{ mins }}m
        </button>
      </div>

      <!-- Enhanced Custom Input -->
<div class="flex gap-2">
        <div class="flex items-center gap-0 w-full max-w-lg bg-void/60 rounded-2xl border border-white/10 p-1 group/input focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-inner">
        <div class="pl-4 text-muted/40 select-none">
          <span class="material-symbols-outlined text-sm">schedule</span>
        </div>
        <input v-model.number="customMins" 
               type="number"
               @keyup.enter="handleCustomSet"
               placeholder="Custom minutes..."
               class="flex-1 bg-transparent border-none px-3 py-3 text-sm text-white focus:ring-0 outline-none tabular-nums placeholder:text-muted/20" />
        
      
      </div>
        <button @click="handleCustomSet" 
                :disabled="!customMins || customMins <= 0"
                class="px-6 py-2.5 mr-1 rounded-xl bg-primary-glow text-white text-[0.625rem] font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed flex items-center gap-2">
          <span>Set</span>
          <span class="material-symbols-outlined text-xs">arrow_forward</span>
        </button>
</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTimerStore } from '~/stores/useTimerStore'

const store = useTimerStore() 
const customMins = ref(null)

const handleCustomSet = () => {
  if (customMins.value && customMins.value > 0) {
    store.quickSet(customMins.value)
    customMins.value = null
  }
}
</script>

<style scoped>
/* Force smooth dashoffset animation */
circle {
  transition: stroke-dashoffset 1s linear;
}

/* Chrome, Safari, Edge, Opera - Remove arrows for number input */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox - Remove arrows for number input */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
