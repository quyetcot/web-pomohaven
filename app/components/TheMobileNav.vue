<template>
  <div class="md:hidden fixed bottom-0 left-0 w-full bg-surface/80 backdrop-blur-xl flex justify-around items-center py-4 z-50 border-t border-primary-glow/10">
    <NuxtLink to="/" class="flex flex-col items-center gap-1 transition-colors" active-class="text-primary" inactive-class="text-muted opacity-70 hover:text-primary">
      <span class="material-symbols-outlined">timer</span>
      <span class="text-[0.6rem] uppercase font-bold tracking-widest">Focus</span>
    </NuxtLink>
    
    <NuxtLink to="/sessions" class="flex flex-col items-center gap-1 transition-colors" active-class="text-primary" inactive-class="text-muted opacity-70 hover:text-primary">
      <span class="material-symbols-outlined">history</span>
      <span class="text-[0.6rem] uppercase tracking-widest">Sessions</span>
    </NuxtLink>
    
    <NuxtLink to="/library" class="flex flex-col items-center gap-1 transition-colors" active-class="text-primary" inactive-class="text-muted opacity-70 hover:text-primary">
      <span class="material-symbols-outlined">music_note</span>
      <span class="text-[0.6rem] uppercase tracking-widest">Sanctuary</span>
    </NuxtLink>
    
    <NuxtLink to="/analytics" class="flex flex-col items-center gap-1 transition-colors" active-class="text-primary" inactive-class="text-muted opacity-70 hover:text-primary">
      <span class="material-symbols-outlined">bar_chart</span>
      <span class="text-[0.6rem] uppercase tracking-widest">Analytics</span>
    </NuxtLink>
  </div>
</template>

<script setup>
</script>
