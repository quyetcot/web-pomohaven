<template>
  <div class="bg-surface/60 rounded-3xl p-6 border border-muted/10 backdrop-blur-sm">
    <div class="flex items-end justify-between gap-2 h-24 mb-6">
      <div class="flex-1 bg-surface-variant rounded-t-lg h-[40%] hover:bg-primary-glow/40 transition-colors"></div>
      <div class="flex-1 bg-surface-variant rounded-t-lg h-[60%] hover:bg-primary-glow/40 transition-colors"></div>
      <div class="flex-1 bg-surface-variant rounded-t-lg h-[30%] hover:bg-primary-glow/40 transition-colors"></div>
      <div class="flex-1 bg-primary-glow/80 rounded-t-lg h-[90%] shadow-[0_0_15px_rgba(75,142,255,0.4)]"></div>
      <div class="flex-1 bg-surface-variant rounded-t-lg h-[50%] hover:bg-primary-glow/40 transition-colors"></div>
      <div class="flex-1 bg-surface-variant rounded-t-lg h-[45%] hover:bg-primary-glow/40 transition-colors"></div>
      <div class="flex-1 bg-surface-variant rounded-t-lg h-[20%] hover:bg-primary-glow/40 transition-colors"></div>
    </div>
    
    <div class="flex justify-between items-center">
      <div>
        <p class="text-2xl font-bold text-white">4.5<span class="text-sm font-normal text-muted ml-1">hrs</span></p>
        <p class="text-[0.6rem] uppercase tracking-widest text-muted mt-1">Focus time today</p>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold text-tertiary">12</p>
        <p class="text-[0.6rem] uppercase tracking-widest text-muted mt-1">Sessions completed</p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
