<template>
  <div class="bg-surface-container/60 backdrop-blur-3xl ghost-border rounded-3xl p-8 space-y-6 w-full">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-lg font-semibold text-primary">Audio Sanctuary</h3>
        <p class="text-xs text-muted uppercase tracking-widest">Connect your focus soundtrack</p>
      </div>
      <span class="material-symbols-outlined text-primary-glow" data-icon="brand_awareness">
        headphones
      </span>
    </div>
    
    <!-- URL Input (Full Width) -->
    <div class="relative group">
      <input v-model="ytInput" @keyup.enter="handleAddUrl"
             class="w-full bg-surface-variant/40 border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted/50 text-white" 
             placeholder="Paste YouTube URL..." type="text"/>
      <button @click="handleAddUrl" class="absolute right-3 top-3 bg-primary-glow/20 hover:bg-primary-glow text-primary hover:text-void p-2 rounded-lg transition-colors active:scale-95">
        <span class="material-symbols-outlined text-sm font-bold">add</span>
      </button>
    </div>

    <!-- Info & Player Split -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
      <!-- Left: Video Info -->
      <div class="flex flex-col space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-glow/10 border border-primary-glow/20 w-fit">
          <span class="flex h-1.5 w-1.5 rounded-full bg-primary-glow animate-pulse"></span>
          <span class="text-[0.625rem] text-primary font-bold uppercase tracking-widest">Music</span>
        </div>
        
        <div class="space-y-1">
          <h4 class="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">
            {{ store.currentTitle }}
          </h4>
          <p class="text-sm text-muted font-medium">Channel: {{ store.currentAuthor }}</p>
        </div>
      </div>
      
      <!-- Right: Mini Embed Player -->
      <div @click="store.togglePlay()" class="aspect-video bg-surface-container rounded-2xl overflow-hidden border border-white/5 relative group cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl">
        <div class="absolute inset-0 flex items-center justify-center bg-void/40 backdrop-blur-[2px] z-10 group-hover:bg-void/20 transition-all">
          <div class="w-14 h-14 rounded-full bg-primary-glow/20 border border-primary-glow/40 flex items-center justify-center shadow-[0_0_30px_rgba(75,142,255,0.15)] group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-3xl text-primary/90 ml-1">
              {{ store.isPlaying ? 'pause' : 'play_arrow' }}
            </span>
          </div>
        </div>
        <!-- High-res Thumbnail -->
        <img :src="`https://img.youtube.com/vi/${store.currentVideoId}/maxresdefault.jpg`"
             class="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-700" alt="Player preview"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAudioStore } from '~/stores/useAudioStore'
import { ref } from 'vue'

const store = useAudioStore()
const ytInput = ref('')

const handleAddUrl = () => {
  if (ytInput.value) {
    store.setVideoId(ytInput.value)
    ytInput.value = ''
  }
}
</script>
