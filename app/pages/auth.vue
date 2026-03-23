<template>
  <div class="h-screen flex items-center justify-center p-6 bg-void relative overflow-hidden">
    <div class="absolute inset-0 bg-primary-glow/5 blur-[120px] rounded-full w-full h-full max-w-2xl mx-auto pointer-events-none"></div>
    <div class="w-full max-w-sm glass-panel bg-surface-container/60 backdrop-blur-3xl ghost-border rounded-3xl p-8 z-10 text-center">
      <div class="text-3xl font-bold tracking-tighter text-primary mb-6">PomoTune</div>
      <p class="text-muted text-sm mb-8">Enter your Sanctuary</p>
      
      <button class="w-full py-4 rounded-full bg-primary-glow/20 text-primary font-bold transition-all hover:bg-primary-glow hover:text-void signature-glow active:scale-95 flex items-center justify-center gap-2">
        <span class="material-symbols-outlined text-lg">login</span> Sign In / Sign Up
      </button>
      
      <NuxtLink to="/" class="block mt-6 text-xs text-muted hover:text-primary transition-colors uppercase tracking-widest">
        Return to Dashboard
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })
</script>
