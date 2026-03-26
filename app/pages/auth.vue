<template>
  <div class="min-h-screen flex items-center justify-center bg-void text-white p-6 relative overflow-hidden">
    <!-- Ambient Glow Background -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-glow/10 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="relative w-full max-w-md rounded-[2rem] bg-surface-container/60 backdrop-blur-[24px] overflow-hidden p-10 flex flex-col items-center">
      <!-- Ghost Border -->
      <div class="absolute inset-0 border-t border-l border-primary/10 rounded-[2rem] pointer-events-none"></div>

      <!-- Icon/Logo Area -->
      <div class="w-16 h-16 rounded-full bg-surface-floating/60 backdrop-blur-xl flex items-center justify-center mb-8 relative">
         <div class="absolute inset-0 border-t border-l border-primary/10 rounded-full pointer-events-none"></div>
         <span class="material-symbols-outlined text-3xl text-primary">account_circle</span>
      </div>

      <h1 class="text-3xl font-bold tracking-tight text-primary mb-2 text-center">Welcome Back</h1>
      <p class="text-[0.6875rem] uppercase tracking-[0.15em] font-medium text-muted mb-10 text-center">Access your Deep Focus Sanctuary</p>

      <button 
        @click="handleGoogleLogin" 
        :disabled="isLoading"
        class="w-full flex items-center justify-center gap-3 bg-surface-floating/60 hover:bg-primary-glow text-white rounded-full py-4 px-6 transition-all duration-300 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{'hover:shadow-[0_0_24px_rgba(75,142,255,0.4)]': !isLoading}"
      >
        <div class="absolute inset-0 border-t border-l border-primary/20 rounded-full pointer-events-none group-hover:border-transparent transition-colors"></div>
        <img v-if="!isLoading" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5" />
        <span class="material-symbols-outlined animate-spin" v-else>progress_activity</span>
        <span class="font-medium tracking-wide">Continue with Google</span>
      </button>
      
      <p v-if="errorMsg" class="mt-4 text-[0.6875rem] text-red-400 text-center">{{ errorMsg }}</p>

      <div class="mt-8 text-center text-muted text-xs">
        <NuxtLink to="/" class="hover:text-primary transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-[0.6875rem]">
          Return to Dashboard
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/useAuthStore'

// Hide standard layout header/sidebar for the auth page
definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(false)
const errorMsg = ref('')

onMounted(() => {
  // If already logged in, redirect to dashboard
  if (authStore.user) {
    router.push('/')
  }
})

const handleGoogleLogin = async () => {
  isLoading.value = true
  errorMsg.value = ''
  try {
    await authStore.loginWithGoogle()
    // It will redirect out of the application
  } catch (error: any) {
    errorMsg.value = error.message
    isLoading.value = false
  }
}
</script>
