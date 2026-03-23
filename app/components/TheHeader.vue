<template>
  <header class="fixed top-0 w-full z-50 bg-void/80 backdrop-blur-xl flex justify-between items-center px-8 py-4 shadow-[0_40px_40px_rgba(173,198,255,0.06)]">
    <div class="text-2xl font-bold tracking-tighter text-primary">PomoTune - Beta</div>
    
    <div class="hidden md:flex gap-8 items-center">
      <NuxtLink to="/" class="font-['Inter'] font-semibold tracking-tight transition-colors duration-300" active-class="text-primary border-b-2 border-primary" inactive-class="text-muted hover:text-primary">Focus</NuxtLink>
      <NuxtLink to="/sessions" class="font-['Inter'] font-semibold tracking-tight transition-colors duration-300" active-class="text-primary border-b-2 border-primary" inactive-class="text-muted hover:text-primary">Sessions</NuxtLink>
      <NuxtLink to="/library" class="font-['Inter'] font-semibold tracking-tight transition-colors duration-300" active-class="text-primary border-b-2 border-primary" inactive-class="text-muted hover:text-primary">Library</NuxtLink>
    </div>
    
    <div class="flex gap-4 items-center">
      <NuxtLink to="/settings" class="active:scale-95 transition-transform text-primary" aria-label="System Configuration">
        <span class="material-symbols-outlined">settings</span>
      </NuxtLink>
      <NuxtLink to="/auth" class="active:scale-95 transition-transform text-primary" aria-label="User Account">
        <span class="material-symbols-outlined">account_circle</span>
      </NuxtLink>
    </div>
  </header>
</template>

<script setup>
</script>
