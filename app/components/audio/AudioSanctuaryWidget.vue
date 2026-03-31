<template>
  <div class="bg-surface-container/60 backdrop-blur-3xl rounded-3xl p-8 space-y-6 w-full relative overflow-hidden">
    <!-- Ghost Border: top-left light path (PomoDesign standard) -->
    <div class="absolute inset-0 border-t border-l border-accent-soft/10 rounded-3xl pointer-events-none"></div>

    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-lg font-semibold text-primary">Audio Sanctuary</h3>
        <p class="text-[0.6875rem] uppercase tracking-[0.15em] font-medium text-muted">Connect your focus soundtrack</p>
      </div>
      <span class="material-symbols-outlined text-primary-glow">
        headphones
      </span>
    </div>
    
    <!-- Quick URL Input (Simple) — full Add Track form moved to Library page -->
    <div class="flex gap-2 items-center">
      <input 
        v-model="quickUrl" 
        @keyup.enter="handleQuickPlay"
        class="flex-1 bg-void/40 border border-white/5 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-primary/50 transition-all duration-300 placeholder:text-muted/30 text-white" 
        placeholder="Paste YouTube URL to play..." 
        type="text"
      />
      <button 
        @click="handleQuickPlay"
        :disabled="!quickUrl"
        aria-label="Play URL"
        class="w-11 h-11 rounded-full bg-primary-glow flex items-center justify-center shrink-0 transition-all duration-300 active:scale-95 disabled:opacity-30 hover:shadow-[0_0_20px_rgba(75,142,255,0.4)]"
      >
        <span class="material-symbols-outlined text-void font-bold">play_arrow</span>
      </button>
    </div>

    <!-- Info & Player Split -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
      <!-- Left: Video Info -->
      <div class="flex flex-col space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-glow/10 border border-primary-glow/20 w-fit">
          <span class="flex h-1.5 w-1.5 rounded-full bg-primary-glow animate-pulse"></span>
          <span class="text-[0.625rem] text-primary font-bold uppercase tracking-[0.15em]">Focusing Now</span>
        </div>
        
        <div class="space-y-1">
          <h4 class="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">
            {{ audioStore.currentTitle }}
          </h4>
          <p class="text-sm text-muted font-medium">{{ audioStore.currentAuthor || 'Aural Sanctuary' }}</p>
        </div>
      </div>
      
      <!-- Right: Mini Embed Player -->
      <div @click="audioStore.togglePlay()" class="aspect-video bg-surface-container rounded-2xl overflow-hidden border border-white/5 relative group cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(75,142,255,0.2)]">
        <div class="absolute inset-0 flex items-center justify-center bg-void/40 backdrop-blur-[2px] z-10 group-hover:bg-void/20 transition-all duration-300">
          <div class="w-14 h-14 rounded-full bg-primary-glow/20 border border-primary-glow/40 flex items-center justify-center shadow-[0_0_30px_rgba(75,142,255,0.15)] group-hover:scale-110 transition-transform duration-300">
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
      <p class="text-[0.6875rem] uppercase font-bold text-muted tracking-[0.15em] mb-4">Quick Sanctuary Pick</p>
      <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
        <button 
          v-for="item in curatedPlaylists" 
          :key="item.id"
          @click="audioStore.setVideoId(item.id)"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 whitespace-nowrap shrink-0 group active:scale-95"
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

<script setup>
import { useAudioStore } from '~/stores/useAudioStore'
import { useMusicStore } from '~/stores/useMusicStore'
import { ref, computed } from 'vue'

const audioStore = useAudioStore()
const musicStore = useMusicStore()

// Quick URL play — simple dashboard UI
const quickUrl = ref('')
const handleQuickPlay = () => {
  if (!quickUrl.value) return
  audioStore.setVideoId(quickUrl.value)
  quickUrl.value = ''
}

/* OLD LOGIC — moved to library.vue
const showAddForm = ref(false)
const newTrack = ref({ url: '', name: '', genre: 'Personal' })
const extractVideoId = (input) => { ... }
const handleAddTrack = () => { ... save to DB ... }
*/

const curatedPlaylists = computed(() => musicStore.getFeaturedTracks())
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
