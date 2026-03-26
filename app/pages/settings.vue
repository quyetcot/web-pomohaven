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
      <div v-if="authStore.user" class="bg-surface-container/60 backdrop-blur-3xl ghost-border p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-6">
          <img v-if="authStore.user.user_metadata?.avatar_url" :src="authStore.user.user_metadata.avatar_url" class="w-16 h-16 rounded-full border border-primary/20 object-cover shrink-0" alt="Avatar"/>
          <div v-else class="w-16 h-16 rounded-full bg-primary-glow/10 flex items-center justify-center text-primary ghost-border shrink-0">
            <span class="material-symbols-outlined text-3xl">account_circle</span>
          </div>
          <div class="space-y-1">
            <p class="text-[0.6875rem] text-primary uppercase tracking-widest font-medium">Google Account</p>
            
            <div v-if="!isEditingProfile" class="flex items-center gap-2">
              <p class="text-lg font-semibold text-white">{{ authStore.user.user_metadata?.full_name || 'Focus Master' }}</p>
              <button @click="startEditingProfile" aria-label="Edit Name" class="text-muted hover:text-primary transition-colors">
                <span class="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>
            <div v-else class="flex items-center gap-2">
              <input v-model="editNameInput" @keyup.enter="saveProfile" class="bg-surface-variant/40 border-[1px] border-primary/40 rounded-lg px-3 py-1 text-sm focus:ring-1 focus:ring-primary/50 text-white w-48" type="text" placeholder="Your Name" />
              <button @click="saveProfile" :disabled="isSavingProfile" class="w-7 h-7 flex items-center justify-center bg-primary-glow/20 text-primary rounded-lg hover:bg-primary-glow hover:text-void transition-all disabled:opacity-50">
                <span v-if="isSavingProfile" class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span v-else class="material-symbols-outlined text-sm">check</span>
              </button>
              <button @click="isEditingProfile = false" :disabled="isSavingProfile" class="w-7 h-7 flex items-center justify-center text-muted hover:text-red-400 transition-colors">
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            <p class="text-xs text-muted font-mono opacity-80">{{ authStore.user.email }}</p>
            <p v-if="profileErrorMsg" class="text-xs text-red-400 mt-1">{{ profileErrorMsg }}</p>
          </div>
        </div>
        <div class="flex gap-3 mt-4 md:mt-0">
          <button @click="handleLogout" class="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-red-900/20 text-red-400 hover:bg-red-900/40 ghost-border transition-colors w-full md:w-auto">Sign Out</button>
        </div>
      </div>
      
      <div v-else class="bg-surface-container/60 backdrop-blur-3xl ghost-border p-8 rounded-3xl flex flex-col items-center justify-center gap-4 text-center">
        <span class="material-symbols-outlined text-4xl text-muted">lock</span>
        <div class="space-y-1">
          <h3 class="font-medium text-white">Sign in to sync your Sanctuary</h3>
          <p class="text-[0.6875rem] text-muted uppercase tracking-widest">Available anywhere</p>
        </div>
        <NuxtLink to="/auth" class="mt-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-primary-glow/20 text-primary hover:bg-primary-glow hover:text-void ghost-border transition-colors">Go to Login</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useTimerStore } from '~/stores/useTimerStore'
import { useAudioStore } from '~/stores/useAudioStore'
import { useAuthStore } from '~/stores/useAuthStore'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'

const store = useTimerStore()
const audioStore = useAudioStore()
const authStore = useAuthStore()
const router = useRouter()

const isEditingProfile = ref(false)
const isSavingProfile = ref(false)
const editNameInput = ref('')
const profileErrorMsg = ref('')

const startEditingProfile = () => {
  editNameInput.value = authStore.user?.user_metadata?.full_name || ''
  profileErrorMsg.value = ''
  isEditingProfile.value = true
}

const saveProfile = async () => {
  if (!editNameInput.value.trim() || editNameInput.value === authStore.user?.user_metadata?.full_name) {
    isEditingProfile.value = false
    return
  }
  
  isSavingProfile.value = true
  profileErrorMsg.value = ''
  
  try {
    await authStore.updateProfile({ full_name: editNameInput.value.trim() })
    isEditingProfile.value = false
  } catch (error: any) {
    profileErrorMsg.value = error.message || 'Error updating profile'
  } finally {
    isSavingProfile.value = false
  }
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/auth')
  } catch (e) {
    console.error(e)
  }
}

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

const handleDefaultAudioChange = (event: any) => {
  const url = event.target.value
  audioStore.setDefaultTrack(url)
}

const currentYoutubeUrl = computed(() => {
  return `https://www.youtube.com/watch?v=${audioStore.settings.defaultVideoId}`
})
</script>
