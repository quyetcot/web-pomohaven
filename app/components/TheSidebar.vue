<template>
  <aside class="hidden md:flex fixed left-0 h-full w-64 bg-surface/60 backdrop-blur-2xl flex-col py-8 gap-6 border-r border-primary-glow/15 z-40 pt-24">
    <div class="px-8 mb-4">
      <div class="text-xl font-bold text-primary">PomoTune</div>
      <div class="text-[0.6875rem] uppercase tracking-widest text-muted opacity-70">Deep Focus Sanctuary</div>
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
      <div class="rounded-xl p-4 bg-surface-container/60 backdrop-blur-[20px] ghost-border mb-4">
        <p class="text-[0.6rem] uppercase tracking-[0.15em] text-muted mb-2">Today's Goal</p>
        <div class="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
          <div class="h-full bg-primary-glow w-3/4"></div>
        </div>
        <p class="text-[0.6875rem] mt-2 text-primary font-medium">6/8 Sessions</p>
      </div>

      <nav class="flex flex-col gap-1 border-t border-muted/10 pt-4">
        <NuxtLink to="/settings" class="flex items-center gap-4 px-4 py-2 font-['Inter'] uppercase tracking-widest text-[0.6875rem] transition-all rounded-lg"
                  active-class="text-primary font-bold bg-primary-glow/10"
                  inactive-class="text-muted opacity-70 hover:bg-surface-variant hover:text-white">
          <span class="material-symbols-outlined">settings</span>
          Settings
        </NuxtLink>
        <button class="flex items-center w-full gap-4 px-4 py-2 font-['Inter'] uppercase tracking-widest text-[0.6875rem] text-muted opacity-70 hover:bg-surface-variant hover:text-white transition-all rounded-lg">
          <span class="material-symbols-outlined">logout</span>
          Sign Out
        </button>
      </nav>
    </div>
  </aside>
</template>

<script setup>
</script>
