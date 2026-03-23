<template>
  <div class="bg-surface-container/60 backdrop-blur-3xl ghost-border rounded-3xl p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="font-bold text-sm uppercase tracking-[0.15em] text-muted">History</h3>
      <NuxtLink to="/sessions" class="text-primary text-xs font-semibold hover:text-primary-glow transition-colors">
        View All
      </NuxtLink>
    </div>
    
    <div class="space-y-4">
      <!-- Session Entries -->
      <div v-for="n in 3" :key="n" class="flex gap-4 p-3 rounded-2xl hover:bg-surface-variant transition-colors group cursor-pointer">
        <div class="w-10 h-10 rounded-full bg-primary-glow/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
          <span class="material-symbols-outlined text-sm">{{ n === 2 ? 'coffee' : 'workspace_premium' }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold truncate text-white">
            {{ n === 2 ? 'Quick Recharge' : 'Deep Work Session' }}
          </p>
          <p class="text-[0.6rem] text-muted uppercase tracking-tighter">
            {{ n === 2 ? '05 min • Break' : '25 min • Focus' }}
          </p>
        </div>
        <div class="text-[0.6rem] text-muted font-medium self-center opacity-70">
          {{ 10 - n }}:45 AM
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
