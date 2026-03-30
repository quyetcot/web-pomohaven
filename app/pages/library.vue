<template>
  <div class="max-w-6xl mx-auto space-y-12 pt-8 pb-12 px-6 md:px-0">
    <!-- Hero Editorial Section (Featured Track) -->
    <section>
      <div v-if="featuredTrack" class="relative overflow-hidden rounded-[2rem] bg-surface-container/40 p-12 flex flex-col justify-end min-h-[380px] shadow-2xl group transition-all duration-500">
        <!-- Ghost Border -->
        <div class="absolute inset-0 border-t border-l border-white/10 rounded-[2rem] pointer-events-none z-20"></div>

        <img :src="`https://img.youtube.com/vi/${featuredTrack.id}/maxresdefault.jpg`" class="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-1000" alt="Background" />
        <div class="absolute inset-0 bg-gradient-to-tr from-void via-void/60 to-primary-glow/10"></div>
        <div class="absolute -right-20 -top-20 w-96 h-96 bg-primary-glow/10 rounded-full blur-[100px] group-hover:bg-primary-glow/20 transition-colors duration-1000"></div>
        
        <div class="relative z-10 max-w-2xl">
          <span class="uppercase tracking-[0.15em] text-[0.6875rem] text-primary font-bold mb-4 block">Editor's Pick: {{ featuredTrack.genre }}</span>
          <h1 class="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6 leading-tight">{{ featuredTrack.title }}</h1>
          <p class="text-muted text-lg leading-relaxed mb-8 opacity-80">{{ featuredTrack.description || 'Dive into deep focus with our hand-picked sanctuary tracks.' }}</p>
          
          <div class="flex flex-wrap gap-4">
            <button @click="audioStore.setVideoId(featuredTrack.id)" class="bg-primary-glow hover:bg-primary-glow/90 text-void px-8 py-3.5 rounded-full font-bold text-[0.6875rem] uppercase tracking-[0.15em] flex items-center gap-2 shadow-[0_0_24px_rgba(75,142,255,0.4)] hover:shadow-[0_0_32px_rgba(75,142,255,0.6)] transition-all duration-300 active:scale-95">
              <span class="material-symbols-outlined font-bold">play_arrow</span>
              Enter Sanctum
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Add Personal Track Section -->
    <section class="relative bg-surface-container/40 backdrop-blur-xl rounded-[2rem] p-8 overflow-hidden">
      <!-- Ghost Border -->
      <div class="absolute inset-0 border-t border-l border-white/10 rounded-[2rem] pointer-events-none z-10"></div>

      <div class="relative z-20">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <h2 class="text-xl font-bold tracking-tight text-white">Personal Sanctuary</h2>
            <p class="text-[0.6875rem] text-muted uppercase tracking-[0.15em] font-medium mt-1">Add your own YouTube tracks to the library</p>
          </div>
          <button 
            v-if="!showAddForm"
            @click="showAddForm = true"
            class="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-glow/10 text-primary border border-primary-glow/20 hover:bg-primary-glow hover:text-void transition-all duration-300 active:scale-95 text-[0.6875rem] font-bold uppercase tracking-[0.15em]"
          >
            <span class="material-symbols-outlined text-sm">add_circle</span>
            Add New Track
          </button>
        </div>

        <!-- Expandable Form -->
        <div v-if="showAddForm" class="bg-void/40 rounded-2xl p-6 space-y-4 border border-white/5">
          <div class="flex justify-between items-center">
            <span class="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-primary">New Track Details</span>
            <button @click="showAddForm = false" aria-label="Close add track form" class="text-muted hover:text-white transition-colors duration-300">
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-1">
              <input 
                v-model="newTrack.url" 
                class="w-full bg-surface-container/60 border border-white/5 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-primary/50 transition-all duration-300 placeholder:text-muted/30 text-white" 
                placeholder="YouTube URL or Video ID..." 
                type="text"
              />
            </div>
            <div class="md:col-span-1">
              <input 
                v-model="newTrack.name" 
                class="w-full bg-surface-container/60 border border-white/5 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-primary/50 transition-all duration-300 placeholder:text-muted/30 text-white" 
                placeholder="Track name..." 
                type="text"
              />
            </div>
            <div class="flex gap-3">
              <select 
                v-model="newTrack.genre" 
                class="flex-1 bg-surface-container/60 border border-white/5 rounded-xl px-4 py-3 text-xs text-muted focus:ring-1 focus:ring-primary/50 appearance-none transition-all duration-300"
              >
                <option v-for="g in musicStore.genres.filter(g => g !== 'All')" :key="g" :value="g">{{ g }}</option>
              </select>
              <button 
                @click="handleAddTrack"
                :disabled="!newTrack.url || !newTrack.name || isSaving"
                class="px-6 py-3 rounded-xl bg-primary-glow text-void font-bold text-[0.6875rem] uppercase tracking-[0.15em] transition-all duration-300 active:scale-95 disabled:opacity-30 disabled:grayscale hover:shadow-[0_0_24px_rgba(75,142,255,0.4)]"
              >
                <span v-if="isSaving" class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span v-else>Save</span>
              </button>
            </div>
          </div>

          <p v-if="saveError" class="text-xs text-red-400">{{ saveError }}</p>
          <p v-if="saveSuccess" class="text-xs text-green-400">Track saved to your library!</p>
        </div>
      </div>
    </section>

    <!-- Genre Filtering -->
    <section class="space-y-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-white mb-1">Musical Sanctuary</h2>
          <p class="text-[0.6875rem] text-muted uppercase tracking-[0.15em] font-medium">Browse by your desired focus state</p>
        </div>
        
        <div class="flex gap-2 p-1 bg-surface-container/40 rounded-2xl border border-white/5 w-fit">
          <button 
            v-for="genre in genres" 
            :key="genre"
            @click="activeGenre = genre"
            class="px-5 py-2 rounded-xl text-[0.6875rem] font-bold uppercase tracking-[0.15em] transition-all duration-300"
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
          class="group relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-surface-container cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98]"
        >
          <!-- Ghost Border -->
          <div class="absolute inset-0 border-t border-l border-white/10 rounded-[1.5rem] pointer-events-none z-20"></div>

          <!-- Delete Button (Personal tracks only) -->
          <button
            v-if="isPersonalTrack(track.id)"
            @click.stop="confirmDeleteId = confirmDeleteId === track.id ? null : track.id"
            aria-label="Delete track"
            class="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-void/60 backdrop-blur-md
                   flex items-center justify-center opacity-0 group-hover:opacity-100
                   hover:bg-red-500/80 text-muted hover:text-white transition-all duration-300"
          >
            <span class="material-symbols-outlined text-[16px]">delete</span>
          </button>

          <!-- Confirm Delete Overlay -->
          <div
            v-if="confirmDeleteId === track.id"
            @click.stop
            class="absolute inset-0 z-30 bg-void/90 backdrop-blur-md flex flex-col items-center justify-center gap-4 p-6 rounded-[1.5rem]"
          >
            <span class="material-symbols-outlined text-3xl text-red-400">delete_forever</span>
            <p class="text-xs text-center text-white font-semibold">Remove "{{ track.name }}" from your library?</p>
            <div class="flex gap-3">
              <button
                @click.stop="confirmDeleteId = null"
                class="px-4 py-2 rounded-full text-[0.625rem] font-bold uppercase tracking-widest
                       bg-surface-variant text-muted hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                @click.stop="handleDeleteTrack(track.id)"
                class="px-4 py-2 rounded-full text-[0.625rem] font-bold uppercase tracking-widest
                       bg-red-500/80 text-white hover:bg-red-500 transition-colors active:scale-95"
              >
                Remove
              </button>
            </div>
          </div>

          <!-- Thumbnail Background -->
          <div @click="audioStore.setVideoId(track.id)">
            <img class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-30 group-hover:opacity-50" 
                 :src="`https://img.youtube.com/vi/${track.id}/hqdefault.jpg`" alt="Track thumbnail"/>
            
            <div class="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-transparent"></div>
            
            <!-- Content Overlay -->
            <div class="absolute bottom-0 left-0 p-6 w-full z-10">
              <div class="flex items-center gap-2 mb-3">
                <span class="material-symbols-outlined text-[10px] text-primary">{{ track.icon || 'music_note' }}</span>
                <span class="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-primary">{{ track.genre }}</span>
              </div>
              
              <h3 class="text-base font-bold mb-1 text-white line-clamp-2 leading-snug group-hover:text-primary-glow transition-colors duration-300">
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
        </div>

        <!-- Add Custom Card -->
        <!-- <div class="group relative aspect-[3/4] rounded-[1.5rem] bg-surface-container/20 border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/40 hover:bg-surface-container/40 transition-all active:scale-95">
          <div class="w-12 h-12 rounded-full bg-surface-variant/40 flex items-center justify-center text-muted group-hover:text-primary-glow transition-colors">
            <span class="material-symbols-outlined text-2xl">add</span>
          </div>
          <div class="text-center">
            <span class="text-[0.6875rem] font-bold uppercase tracking-widest text-muted block mb-1">Add Personal Track</span>
            <span class="text-[10px] text-muted/40 uppercase">Paste URL in Dashboard</span>
          </div>
        </div> -->
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAudioStore } from '~/stores/useAudioStore'
import { useMusicStore } from '~/stores/useMusicStore'

const audioStore = useAudioStore()
const musicStore = useMusicStore()

// Library state
const activeGenre = ref('All')
const activeTracks = computed(() => musicStore.getTracksByGenre(activeGenre.value))
const featuredTrack = computed(() => musicStore.getFeaturedTracks()[0])
const genres = computed(() => musicStore.genres)

// Add Personal Track state
const showAddForm = ref(false)
const isSaving = ref(false)
const saveError = ref('')
const saveSuccess = ref(false)
const newTrack = ref({
  url: '',
  name: '',
  genre: 'Personal'
})

const extractVideoId = (input: string) => {
  if (input.length === 11 && !input.includes('/')) return input
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = input.match(regExp)
  return (match && match[2] && match[2].length === 11) ? match[2] : null
}

const handleAddTrack = async () => {
  const vid = extractVideoId(newTrack.value.url)
  if (!vid || !newTrack.value.name) return

  isSaving.value = true
  saveError.value = ''
  saveSuccess.value = false

  try {
    await musicStore.addTrack(vid, newTrack.value.name, newTrack.value.genre)
    audioStore.setVideoId(vid) // Play immediately
    saveSuccess.value = true
    
    // Reset form after short delay so user sees the success message
    setTimeout(() => {
      newTrack.value = { url: '', name: '', genre: 'Personal' }
      showAddForm.value = false
      saveSuccess.value = false
    }, 1500)
  } catch (err) {
    saveError.value = String(err) || 'Failed to save track. Please try again.'
  } finally {
    isSaving.value = false
  }
}

// Delete track
const confirmDeleteId = ref<string | null>(null)

const isPersonalTrack = (id: string) =>
  musicStore.personalTracks.some(t => t.id === id)

const handleDeleteTrack = async (id: string) => {
  await musicStore.removeTrack(id)
  confirmDeleteId.value = null
}
</script>


<style scoped>
/* No solid ghost borders — handled inline with Ghost Border pattern */
</style>
