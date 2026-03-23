<template>
  <div class="max-w-4xl mx-auto space-y-12 pt-8">
    <!-- Page Header -->
    <header class="space-y-2">
      <h1 class="text-3xl font-semibold tracking-tight text-white">System Configuration</h1>
      <p class="text-sm text-muted uppercase tracking-widest font-medium">Tailor your deep focus experience</p>
    </header>
    
    <!-- 1. Timer Settings -->
    <section class="space-y-6">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-primary">schedule</span>
        <h2 class="text-lg font-medium tracking-tight text-white">Timer Settings</h2>
      </div>
      
      <div class="bg-surface-container/60 backdrop-blur-3xl ghost-border p-8 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="space-y-4">
          <label class="text-[0.6875rem] uppercase tracking-[0.1em] font-medium text-muted block">Focus Duration</label>
          <div class="flex items-end gap-2 group border-b border-muted/20 focus-within:border-primary pb-1 transition-colors">
            <input v-model="focusMins" min="1" max="180" class="bg-transparent border-none p-0 focus:ring-0 text-2xl font-semibold w-20 text-white" type="number"/>
            <span class="text-sm text-muted pb-1">min</span>
          </div>
        </div>
        <div class="space-y-4">
          <label class="text-[0.6875rem] uppercase tracking-[0.1em] font-medium text-muted block">Short Break</label>
          <div class="flex items-end gap-2 group border-b border-muted/20 focus-within:border-primary pb-1 transition-colors">
            <input v-model="shortMins" min="1" max="60" class="bg-transparent border-none p-0 focus:ring-0 text-2xl font-semibold w-20 text-white" type="number"/>
            <span class="text-sm text-muted pb-1">min</span>
          </div>
        </div>
        <div class="space-y-4">
          <label class="text-[0.6875rem] uppercase tracking-[0.1em] font-medium text-muted block">Long Break</label>
          <div class="flex items-end gap-2 group border-b border-muted/20 focus-within:border-primary pb-1 transition-colors">
            <input v-model="longMins" min="1" max="60" class="bg-transparent border-none p-0 focus:ring-0 text-2xl font-semibold w-20 text-white" type="number"/>
            <span class="text-sm text-muted pb-1">min</span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 2. Audio Settings -->
    <section class="space-y-6">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-primary">volume_up</span>
        <h2 class="text-lg font-medium tracking-tight text-white">Audio Environment</h2>
      </div>
      
      <div class="bg-surface-container/60 backdrop-blur-3xl ghost-border p-8 rounded-3xl space-y-8">
        <div class="grid md:grid-cols-2 gap-12">
          <div class="space-y-8">
            <div class="space-y-4">
              <label class="text-[0.6875rem] uppercase tracking-[0.1em] font-medium text-muted block">YouTube Base Link</label>
              <input :value="currentYoutubeUrl" @change="handleDefaultAudioChange" class="w-full bg-surface-variant/40 border-[1px] border-muted/20 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted/50 text-white" placeholder="https://youtube.com/..." type="text"/>
            </div>
            <div class="flex items-center gap-4 text-muted">
              <span class="material-symbols-outlined">notifications</span>
              <div class="flex-1">
                <p class="text-sm font-medium text-white">Notification & Sounds</p>
                <p class="text-[0.625rem] uppercase tracking-wide">Play audio cues and alert for sessions</p>
              </div>
              <!-- Checkbox Switch -->
              <button @click="store.settings.soundEnabled = !store.settings.soundEnabled; store.settings.notificationsEnabled = !store.settings.notificationsEnabled" 
                      :class="store.settings.soundEnabled ? 'bg-primary-glow shadow-[0_0_10px_rgba(75,142,255,0.4)]' : 'bg-surface-variant'" 
                      class="w-10 h-5 rounded-full relative transition-colors">
                <div :class="store.settings.soundEnabled ? 'right-1 bg-void' : 'left-1 bg-muted'" class="absolute top-1 w-3 h-3 rounded-full transition-all"></div>
              </button>
            </div>
          </div>
          
          <div class="space-y-4 bg-void/30 p-4 rounded-xl ghost-border">
            <div @click="audioStore.settings.autoPlayFocus = !audioStore.settings.autoPlayFocus" class="flex items-center justify-between p-3 rounded-lg hover:bg-surface-variant transition-colors cursor-pointer group">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-white">Auto-play Focus Music</span>
                <span class="text-[0.625rem] text-muted uppercase">Starts when timer begins</span>
              </div>
              <button :class="audioStore.settings.autoPlayFocus ? 'bg-primary-glow shadow-[0_0_10px_rgba(75,142,255,0.4)]' : 'bg-surface-variant'" class="w-10 h-5 rounded-full relative transition-colors">
                <div :class="audioStore.settings.autoPlayFocus ? 'right-1 bg-void' : 'left-1 bg-muted'" class="absolute top-1 w-3 h-3 rounded-full transition-all"></div>
              </button>
            </div>
            
            <div @click="audioStore.settings.autoPauseBreak = !audioStore.settings.autoPauseBreak" class="flex items-center justify-between p-3 rounded-lg hover:bg-surface-variant transition-colors cursor-pointer">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-white">Auto-pause on Break</span>
                <span class="text-[0.625rem] text-muted uppercase">Silence during rest periods</span>
              </div>
              <button :class="audioStore.settings.autoPauseBreak ? 'bg-primary-glow shadow-[0_0_10px_rgba(75,142,255,0.4)]' : 'bg-surface-variant'" class="w-10 h-5 rounded-full relative transition-colors">
                <div :class="audioStore.settings.autoPauseBreak ? 'right-1 bg-void' : 'left-1 bg-muted'" class="absolute top-1 w-3 h-3 rounded-full transition-all"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 4. User Account -->
    <section class="space-y-6">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-primary">person</span>
        <h2 class="text-lg font-medium tracking-tight text-white">User Account</h2>
      </div>
      <div class="bg-surface-container/60 backdrop-blur-3xl ghost-border p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 rounded-full bg-primary-glow/10 flex items-center justify-center text-primary ghost-border shrink-0">
            <span class="material-symbols-outlined text-3xl">account_circle</span>
          </div>
          <div>
            <p class="text-sm text-muted uppercase tracking-tighter font-medium">Primary Account</p>
            <p class="text-lg font-semibold text-white">user@example.com</p>
          </div>
        </div>
        <div class="flex gap-3">
          <button class="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border border-muted/20 text-muted hover:text-white hover:border-muted/50 transition-colors">Change Password</button>
          <NuxtLink to="/auth" class="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-red-900/20 text-red-400 hover:bg-red-900/40 ghost-border transition-colors">Sign Out</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useTimerStore } from '~/stores/useTimerStore'
import { useAudioStore } from '~/stores/useAudioStore'
import { computed } from 'vue'

const store = useTimerStore()
const audioStore = useAudioStore()

// Biến ảo giúp đồng bộ Pinia store (tính theo giây) ra View (tính theo phút)
const focusMins = computed({
  get: () => Math.floor(store.settings.focusDuration / 60),
  set: (val) => { store.settings.focusDuration = val * 60 }
})

const shortMins = computed({
  get: () => Math.floor(store.settings.shortBreakDuration / 60),
  set: (val) => { store.settings.shortBreakDuration = val * 60 }
})

const longMins = computed({
  get: () => Math.floor(store.settings.longBreakDuration / 60),
  set: (val) => { store.settings.longBreakDuration = val * 60 }
})

const handleDefaultAudioChange = (event) => {
  const url = event.target.value
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  
  if (match && match[2] && match[2].length === 11) {
    audioStore.settings.defaultVideoId = match[2]
  }
}

const currentYoutubeUrl = computed(() => {
  return `https://www.youtube.com/watch?v=${audioStore.settings.defaultVideoId}`
})
</script>
