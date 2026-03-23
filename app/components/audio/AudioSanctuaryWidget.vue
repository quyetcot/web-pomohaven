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
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div class="relative group">
          <input v-model="ytInput" @keyup.enter="handleAddUrl"
                 class="w-full bg-surface-variant/40 border-none rounded-xl px-6 py-4 text-sm focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted/50 text-white" 
                 placeholder="Paste YouTube URL..." type="text"/>
          <button @click="handleAddUrl" class="absolute right-3 top-3 bg-primary-glow/20 hover:bg-primary-glow text-primary hover:text-void p-2 rounded-lg transition-colors active:scale-95">
            <span class="material-symbols-outlined text-sm font-bold">add</span>
          </button>
        </div>
        
        <div class="flex items-center gap-4 bg-surface-container p-4 rounded-2xl border border-muted/5">
          <div class="w-12 h-12 rounded-lg bg-surface-variant flex items-center justify-center overflow-hidden shrink-0 relative group cursor-pointer">
            <div class="absolute inset-0 bg-void/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="material-symbols-outlined text-white">play_arrow</span>
            </div>
            <img class="w-full h-full object-cover opacity-60" alt="Thumbnail" src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=64&h=64&fit=crop&q=80"/>
          </div>
          <div class="flex-1 overflow-hidden">
            <p class="text-xs font-semibold truncate text-white">Lofi Girl - chill lofi hip hop</p>
            <p class="text-[0.6rem] text-muted uppercase tracking-tighter mt-1">YouTube Stream</p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button class="text-muted hover:text-primary transition-colors hover:-translate-y-0.5 active:scale-95">
              <span class="material-symbols-outlined text-xl">play_circle</span>
            </button>
          </div>
        </div>
        
        <!-- Mood Sliders -->
        <BaseSlider label="Ambient Rainfall" v-model="store.volumeRain" />
        <BaseSlider label="Coffee Shop" v-model="store.volumeCoffee" />
      </div>
      
      <!-- Mini Embed Player (Linked to Global State) -->
      <div @click="store.togglePlay()" class="aspect-video bg-surface-container rounded-2xl overflow-hidden border border-muted/10 relative group cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-xl">
        <div class="absolute inset-0 flex items-center justify-center bg-void/50 backdrop-blur-sm z-10 group-hover:bg-void/30 transition-colors">
          <div class="w-16 h-16 rounded-full bg-primary-glow/20 border border-primary-glow flex items-center justify-center shadow-[0_0_20px_rgba(75,142,255,0.2)]">
            <span class="material-symbols-outlined text-4xl text-primary/90 ml-1">
              {{ store.isPlaying ? 'pause' : 'play_arrow' }}
            </span>
          </div>
        </div>
        <!-- High-res Thumbnail -->
        <img :src="`https://img.youtube.com/vi/${store.currentVideoId}/maxresdefault.jpg`"
             class="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" alt="Player area"/>
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
