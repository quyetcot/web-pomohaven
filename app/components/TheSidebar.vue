<template>
  <aside class="hidden md:flex fixed left-0 h-full w-64 bg-surface/60 backdrop-blur-2xl flex-col py-8 gap-6 border-r border-primary-glow/15 z-40 pt-24">
    <div class="px-8 mb-4">
      <div class="text-xl font-bold text-primary">PomoHaven</div>
      <div class="text-[0.6875rem] uppercase tracking-widest text-muted opacity-70">The Deep Focus Sanctuary</div>
    </div>
    
    <nav class="flex flex-col gap-1">
      <NuxtLink to="/" class="flex items-center gap-4 px-8 py-3 font-['Inter'] uppercase tracking-widest text-[0.6875rem] transition-all"
                active-class="text-primary font-bold border-r-2 border-primary bg-primary-glow/20"
                inactive-class="text-muted opacity-70 hover:bg-surface-container hover:text-primary">
        <span class="material-symbols-outlined">timer</span>
        Focus Dashboard
      </NuxtLink>
      
      <NuxtLink to="/sessions" class="flex items-center gap-4 px-8 py-3 font-['Inter'] uppercase tracking-widest text-[0.6875rem] transition-all"
                active-class="text-primary font-bold border-r-2 border-primary bg-primary-glow/20"
                inactive-class="text-muted opacity-70 hover:bg-surface-container hover:text-primary">
        <span class="material-symbols-outlined">history</span>
        Sessions
      </NuxtLink>
      
      <NuxtLink to="/library" class="flex items-center gap-4 px-8 py-3 font-['Inter'] uppercase tracking-widest text-[0.6875rem] transition-all"
                active-class="text-primary font-bold border-r-2 border-primary bg-primary-glow/20"
                inactive-class="text-muted opacity-70 hover:bg-surface-container hover:text-primary">
        <span class="material-symbols-outlined">music_note</span>
        Audio Sanctuary
      </NuxtLink>
      
      <NuxtLink to="/analytics" class="flex items-center gap-4 px-8 py-3 font-['Inter'] uppercase tracking-widest text-[0.6875rem] transition-all"
                active-class="text-primary font-bold border-r-2 border-primary bg-primary-glow/20"
                inactive-class="text-muted opacity-70 hover:bg-surface-container hover:text-primary">
        <span class="material-symbols-outlined">bar_chart</span>
        Performance Analytics
      </NuxtLink>
    </nav>
    
    <div class="mt-auto px-8 space-y-4">
      <div class="relative group" ref="goalModalRef">
        <!-- Goal Progress Banner -->
        <div @click="isEditingGoal = true" class="rounded-xl p-4 bg-surface-container/60 backdrop-blur-[20px] ghost-border mb-4 cursor-pointer hover:bg-surface-variant transition-colors group-hover:bg-surface-variant/80">
          <div class="flex justify-between items-center mb-2">
            <p class="text-[0.6rem] uppercase tracking-[0.15em] text-muted">Today's Goal</p>
            <span class="material-symbols-outlined text-[14px] text-muted opacity-0 group-hover:opacity-100 transition-opacity">edit</span>
          </div>
          <div class="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
            <div class="h-full bg-primary-glow transition-all duration-700 ease-out" :style="{ width: Math.min(100, (timerStore.todayCompletedCount / (timerStore.settings.dailyGoal || 1)) * 100) + '%' }"></div>
          </div>
          <p class="text-[0.6875rem] mt-2 text-primary font-medium">{{ timerStore.todayCompletedCount }}/{{ timerStore.settings.dailyGoal }} Sessions</p>
        </div>

        <!-- Popover Editing Modal -->
        <div v-show="isEditingGoal" class="absolute bottom-full left-0 mb-2 w-full z-50 bg-[#16181d] backdrop-blur-[40px] border border-[#adc6ff]/20 rounded-2xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-xs font-bold uppercase tracking-widest text-white">Daily Target</h4>
            <button @click.stop="isEditingGoal = false" class="text-muted hover:text-red-400 transition-colors">
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <button @click.stop="timerStore.settings.dailyGoal = Math.max(1, timerStore.settings.dailyGoal - 1)" class="w-8 h-8 rounded-full bg-surface-variant border border-muted/10 flex items-center justify-center hover:bg-primary-glow/20 hover:text-primary transition-colors text-white focus:outline-none">
                <span class="material-symbols-outlined text-sm">remove</span>
              </button>
              <input v-model.number="timerStore.settings.dailyGoal" type="number" min="1" max="50" class="flex-1 bg-surface-variant border border-muted/10 rounded-xl h-10 px-2 text-center text-sm text-white font-medium focus:outline-none focus:border-primary/40 focus:bg-white/5 transition-all outline-none" @click.stop />
              <button @click.stop="timerStore.settings.dailyGoal++" class="w-8 h-8 rounded-full bg-surface-variant border border-muted/10 flex items-center justify-center hover:bg-primary-glow/20 hover:text-primary transition-colors text-white focus:outline-none">
                <span class="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
            <button @click.stop="isEditingGoal = false" class="w-full h-10 bg-primary-glow hover:bg-primary-glow/80 text-void font-bold text-[0.6875rem] uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-[0_0_15px_rgba(75,142,255,0.4)]">
              Save Set
            </button>
          </div>
        </div>
      </div>

      <nav class="flex flex-col gap-1 border-t border-muted/10 pt-4">
        <NuxtLink to="/settings" class="flex items-center gap-4 px-4 py-2 font-['Inter'] uppercase tracking-widest text-[0.6875rem] transition-all rounded-lg"
                  active-class="text-primary font-bold bg-primary-glow/10"
                  inactive-class="text-muted opacity-70 hover:bg-surface-variant hover:text-white">
          <span class="material-symbols-outlined">settings</span>
          Settings
        </NuxtLink>
        <template v-if="authStore.isInitialized">
          <NuxtLink v-if="!authStore.user" to="/auth" class="flex items-center w-full gap-4 px-4 py-2 font-['Inter'] uppercase tracking-widest text-[0.6875rem] text-muted opacity-70 hover:bg-surface-variant hover:text-white transition-all rounded-lg">
            <span class="material-symbols-outlined">account_circle</span>
            Sign In
          </NuxtLink>
          <button v-else @click="handleLogout" class="flex items-center w-full gap-4 px-4 py-2 font-['Inter'] uppercase tracking-widest text-[0.6875rem] text-muted opacity-70 hover:bg-surface-variant hover:text-white transition-all rounded-lg text-red-400 hover:text-red-300">
            <span class="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </template>
        <div v-else class="flex items-center w-full gap-4 px-4 py-2 text-[0.6875rem] text-muted opacity-50">
           <span class="material-symbols-outlined animate-spin">progress_activity</span>
           Loading...
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { useAuthStore } from '~/stores/useAuthStore'
import { useTimerStore } from '~/stores/useTimerStore'

const authStore = useAuthStore()
const timerStore = useTimerStore()
const router = useRouter()

const isEditingGoal = ref(false)
const goalModalRef = ref<HTMLElement | null>(null)

// Call Supabase count immediately if user is theoretically logged in
// It gracefully exits early inside the store if no user is found.
onMounted(() => {
  timerStore.fetchTodayCompleted()
})

onClickOutside(goalModalRef, () => {
  if (isEditingGoal.value) isEditingGoal.value = false
})

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/auth')
  } catch (e) {
    console.error('Logout error:', e)
  }
}
</script>
