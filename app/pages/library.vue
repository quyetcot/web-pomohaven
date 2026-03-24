<template>
  <div class="max-w-6xl mx-auto space-y-12 pt-8 pb-12 px-6 md:px-0">
    <!-- Hero Editorial Section (Featured Track) -->
    <section>
      <div v-if="featuredTrack" class="relative overflow-hidden rounded-[2rem] bg-surface-container/40 p-12 flex flex-col justify-end min-h-[380px] shadow-2xl ghost-border group">
        <img :src="`https://img.youtube.com/vi/${featuredTrack.id}/maxresdefault.jpg`" class="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-1000" />
        <div class="absolute inset-0 bg-gradient-to-tr from-void via-void/60 to-primary-glow/10"></div>
        <div class="absolute -right-20 -top-20 w-96 h-96 bg-primary-glow/10 rounded-full blur-[100px] group-hover:bg-primary-glow/20 transition-colors duration-1000"></div>
        
        <div class="relative z-10 max-w-2xl">
          <span class="uppercase tracking-[0.2em] text-[0.6875rem] text-primary font-bold mb-4 block">Editor's Pick: {{ featuredTrack.genre }}</span>
          <h1 class="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6 leading-tight">{{ featuredTrack.title }}</h1>
          <p class="text-muted text-lg leading-relaxed mb-8 opacity-80">{{ featuredTrack.description || 'Dive into deep focus with our hand-picked sanctuary tracks.' }}</p>
          
          <div class="flex flex-wrap gap-4">
            <button @click="audioStore.setVideoId(featuredTrack.id)" class="bg-primary-glow hover:bg-primary-glow/90 text-void px-8 py-3.5 rounded-full font-bold text-[0.6875rem] uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(75,142,255,0.3)] hover:shadow-[0_0_30px_rgba(75,142,255,0.5)] transition-all active:scale-95">
              <span class="material-symbols-outlined font-bold">play_arrow</span>
              Enter Sanctum
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Genre Filtering -->
    <section class="space-y-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-white mb-1">Musical Sanctuary</h2>
          <p class="text-xs text-muted uppercase tracking-widest font-medium">Browse by your desired focus state</p>
        </div>
        
        <div class="flex gap-2 p-1 bg-surface-container/40 rounded-2xl border border-white/5 w-fit">
          <button 
            v-for="genre in genres" 
            :key="genre"
            @click="activeGenre = genre"
            class="px-5 py-2 rounded-xl text-[0.6875rem] font-bold uppercase tracking-widest transition-all"
            :class="activeGenre === genre 
              ? 'bg-primary-glow text-void shadow-lg' 
              : 'text-muted hover:text-white hover:bg-surface-variant/40'"
          >
            {{ genre }}
          </button>
        </div>
      </div>
      
      <!-- Tracks Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="track in activeTracks" 
          :key="track.id"
          @click="audioStore.setVideoId(track.id)"
          class="group relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-surface-container cursor-pointer transition-all duration-500 hover:-translate-y-2 ghost-border hover:shadow-2xl active:scale-[0.98]"
        >
          <!-- Thumbnail Background -->
          <img class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-30 group-hover:opacity-50" 
               :src="`https://img.youtube.com/vi/${track.id}/hqdefault.jpg`"/>
          
          <div class="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-transparent"></div>
          
          <!-- Content Overlay -->
          <div class="absolute bottom-0 left-0 p-6 w-full">
            <div class="flex items-center gap-2 mb-3">
              <span class="material-symbols-outlined text-[10px] text-primary">{{ track.icon || 'music_note' }}</span>
              <span class="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-primary">{{ track.genre }}</span>
            </div>
            
            <h3 class="text-base font-bold mb-1 text-white line-clamp-2 leading-snug group-hover:text-primary-glow transition-colors">
              {{ track.title }}
            </h3>
            <p class="text-[0.6875rem] text-muted mb-4 opacity-60">{{ track.author }}</p>
            
            <div class="flex items-center justify-between mt-auto">
              <span class="text-[0.625rem] font-medium text-muted/60 bg-surface/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/5">
                Infinite Loop
              </span>
              <div class="w-10 h-10 rounded-full bg-primary-glow flex items-center justify-center shadow-[0_0_15px_rgba(75,142,255,0.4)] translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span class="material-symbols-outlined text-void font-bold">play_arrow</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Custom Card -->
        <div class="group relative aspect-[3/4] rounded-[1.5rem] bg-surface-container/20 border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/40 hover:bg-surface-container/40 transition-all active:scale-95">
          <div class="w-12 h-12 rounded-full bg-surface-variant/40 flex items-center justify-center text-muted group-hover:text-primary-glow transition-colors">
            <span class="material-symbols-outlined text-2xl">add</span>
          </div>
          <div class="text-center">
            <span class="text-[0.6875rem] font-bold uppercase tracking-widest text-muted block mb-1">Add Personal Track</span>
            <span class="text-[10px] text-muted/40 uppercase">Paste URL in Dashboard</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAudioStore } from '~/stores/useAudioStore'
import { useMusicLibrary } from '~/composables/useMusicLibrary'

const audioStore = useAudioStore()
const { genres, getTracksByGenre, getFeaturedTracks } = useMusicLibrary()

const activeGenre = ref('All')
const activeTracks = computed(() => getTracksByGenre(activeGenre.value))
const featuredTrack = computed(() => getFeaturedTracks()[0])
</script>

<style scoped>
.ghost-border {
  border: 1.5px solid rgba(255, 255, 255, 0.08);
}
</style>
