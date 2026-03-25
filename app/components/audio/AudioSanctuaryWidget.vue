<template>
  <div class="bg-surface-container/60 backdrop-blur-3xl ghost-border rounded-3xl p-8 space-y-6 w-full">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-lg font-semibold text-primary">Audio Sanctuary</h3>
        <p class="text-xs text-muted uppercase tracking-widest">Connect your focus soundtrack</p>
      </div>
      <span class="material-symbols-outlined text-primary-glow">
        headphones
      </span>
    </div>
    
    <!-- URL Input & Add Track Form (Enhanced) -->
    <div class="space-y-4">
      <div v-if="!showAddForm" @click="showAddForm = true" 
           class="w-full bg-surface-variant/20 hover:bg-surface-variant/40 border border-dashed border-white/10 rounded-2xl py-4 flex items-center justify-center gap-2 text-muted hover:text-primary transition-all cursor-pointer group">
        <span class="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">add_circle</span>
        <span class="text-[0.6875rem] font-bold uppercase tracking-widest">Add Personal Track</span>
      </div>

      <div v-else class="bg-surface-container/40 p-5 rounded-2xl border border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2">
        <div class="flex justify-between items-center mb-1">
          <span class="text-[0.625rem] font-bold uppercase tracking-widest text-primary">New Track Details</span>
          <button @click="showAddForm = false" class="text-muted hover:text-white transition-colors">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <input v-model="newTrack.url" 
               class="w-full bg-void/40 border border-white/5 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted/30 text-white" 
               placeholder="YouTube URL..." type="text"/>
        
        <input v-model="newTrack.name" 
               class="w-full bg-void/40 border border-white/5 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted/30 text-white" 
               placeholder="Track Name (e.g. My Study Mix)" type="text"/>

        <div class="flex items-center gap-3">
          <select v-model="newTrack.genre" 
                  class="flex-1 bg-void/40 border-none rounded-xl px-4 py-3 text-xs text-muted focus:ring-1 focus:ring-primary/50 appearance-none">
            <option disabled value="">Choose Genre</option>
            <option v-for="g in (musicStore.genres.filter((g) => g !== 'All') )" :key="g" :value="g">{{ g }}</option>
          </select>

          <button @click="handleAddTrack" 
                  :disabled="!newTrack.url || !newTrack.name"
                  class="bg-primary-glow text-void px-6 py-3 rounded-xl font-bold text-[0.6875rem] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30 disabled:grayscale">
            Add Track
          </button>
        </div>
      </div>
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
            {{ audioStore.currentTitle }}
          </h4>
          <p class="text-sm text-muted font-medium">Channel: {{ audioStore.currentAuthor }}</p>
        </div>
      </div>
      
      <!-- Right: Mini Embed Player -->
      <div @click="audioStore.togglePlay()" class="aspect-video bg-surface-container rounded-2xl overflow-hidden border border-white/5 relative group cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl">
        <div class="absolute inset-0 flex items-center justify-center bg-void/40 backdrop-blur-[2px] z-10 group-hover:bg-void/20 transition-all">
          <div class="w-14 h-14 rounded-full bg-primary-glow/20 border border-primary-glow/40 flex items-center justify-center shadow-[0_0_30px_rgba(75,142,255,0.15)] group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-3xl text-primary/90 ml-1">
              {{ audioStore.isPlaying ? 'pause' : 'play_arrow' }}
            </span>
          </div>
        </div>
        <!-- High-res Thumbnail -->
        <img :src="`https://img.youtube.com/vi/${audioStore.currentVideoId}/maxresdefault.jpg`"
             class="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-700" alt="Player preview"/>
      </div>
    </div>

    <!-- Quick Selection Library -->
    <div class="pt-2">
      <p class="text-[10px] uppercase font-bold text-muted tracking-widest mb-4">Quick Sanctuary Pick</p>
      <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
        <button 
          v-for="item in curatedPlaylists" 
          :key="item.id"
          @click="audioStore.setVideoId(item.id)"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap shrink-0 group active:scale-95"
          :class="audioStore.currentVideoId === item.id 
            ? 'bg-primary-glow/10 border-primary-glow/40 text-primary-glow shadow-[0_0_15px_rgba(75,142,255,0.1)]' 
            : 'bg-surface-variant/20 border-white/5 text-muted hover:bg-surface-variant/40 hover:border-white/10 hover:text-white'"
        >
          <span class="material-symbols-outlined text-lg">{{ item.icon || 'music_note' }}</span>
          <span class="text-xs font-semibold">{{ item.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup >
import { useAudioStore } from '~/stores/useAudioStore'
import { useMusicStore } from '~/stores/useMusicStore'
import { ref, computed } from 'vue'

const audioStore = useAudioStore()
const musicStore = useMusicStore()

const showAddForm = ref(false)
const newTrack = ref({
  url: '',
  name: '',
  genre: 'Personal'
})

const curatedPlaylists = computed(() => musicStore.getFeaturedTracks())

const extractVideoId = (input) => {
  if (input.length === 11 && !input.includes('/')) return input
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = input.match(regExp)
  return (match && match[2] && match[2].length === 11) ? match[2] : null
}

const handleAddTrack = () => {
  const vid = extractVideoId(newTrack.value.url)
  if (vid && newTrack.value.name) {
    musicStore.addTrack(vid, newTrack.value.name, newTrack.value.genre)
    audioStore.setVideoId(vid) // Play immediately
    
    // Reset form
    newTrack.value = { url: '', name: '', genre: 'Personal' }
    showAddForm.value = false
  }
}
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
