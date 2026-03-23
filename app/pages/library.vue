<template>
  <div class="max-w-5xl mx-auto space-y-16 pt-8 pb-12 px-2 md:px-0">
    <!-- Hero Editorial Section -->
    <section>
      <div class="relative overflow-hidden rounded-[2rem] bg-surface-container/40 p-12 flex flex-col justify-end min-h-[320px] shadow-2xl ghost-border group">
        <div class="absolute inset-0 bg-gradient-to-tr from-void via-surface-container/40 to-primary-glow/5"></div>
        <div class="absolute -right-20 -top-20 w-96 h-96 bg-primary-glow/10 rounded-full blur-[100px] group-hover:bg-primary-glow/20 transition-colors duration-1000"></div>
        
        <div class="relative z-10 max-w-2xl">
          <span class="uppercase tracking-[0.2em] text-[0.6875rem] text-primary font-semibold mb-4 block">Curated for Focus</span>
          <h1 class="text-5xl font-semibold tracking-tighter text-white mb-6 leading-tight">Your Digital Sound Sanctuary</h1>
          <p class="text-muted text-lg leading-relaxed mb-8">High-fidelity ambient landscapes and rhythmic focus tracks designed to anchor your mind into deep work states.</p>
          
          <div class="flex flex-wrap gap-4">
            <button @click="store.togglePlay()" class="bg-primary-glow hover:bg-primary-glow/90 text-void px-8 py-3 rounded-full font-bold text-[0.6875rem] uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(75,142,255,0.3)] hover:shadow-[0_0_30px_rgba(75,142,255,0.5)] transition-all active:scale-95">
              <span class="material-symbols-outlined font-bold">{{ store.isPlaying ? 'pause' : 'play_arrow' }}</span>
              {{ store.isPlaying ? 'Pause Session' : 'Resume Last Session' }}
            </button>
            <button class="bg-surface-variant/40 hover:bg-surface-variant backdrop-blur-3xl ghost-border px-8 py-3 rounded-full font-bold text-[0.6875rem] uppercase tracking-wider text-white transition-all active:scale-95">
              Browse Genres
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Saved Playlists Grid -->
    <section>
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-semibold tracking-tight text-white">Curated Playlists</h2>
        <button class="text-[0.6875rem] font-bold uppercase tracking-widest text-primary hover:text-primary-glow transition-colors">View All</button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Card 1 -->
        <div @click="store.setVideoId('jfKfPfyJRdk')" class="group relative aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-surface-container cursor-pointer transition-transform duration-500 hover:-translate-y-2 ghost-border">
          <img class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80" src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=500&fit=crop&q=80"/>
          <div class="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-8 w-full">
            <span class="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-primary mb-2 block">Electronic</span>
            <h3 class="text-xl font-semibold mb-1 text-white">Lofi Hip Hop</h3>
            <p class="text-muted text-xs mb-4">Steady beats for flow</p>
            <div class="flex items-center justify-between">
              <span class="text-[0.625rem] font-medium text-muted bg-surface/80 backdrop-blur-md px-2 py-1 rounded">Radio Stream</span>
              <div class="w-10 h-10 rounded-full bg-primary-glow flex items-center justify-center shadow-[0_0_15px_rgba(75,142,255,0.4)] translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span class="material-symbols-outlined text-void font-bold">play_arrow</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Card 2 -->
        <div @click="store.setVideoId('5qap5aO4i9A')" class="group relative aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-surface-container cursor-pointer transition-transform duration-500 hover:-translate-y-2 ghost-border">
          <img class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80" src="https://images.unsplash.com/photo-1476611317561-60117649dd94?w=400&h=500&fit=crop&q=80"/>
          <div class="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-8 w-full">
            <span class="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-tertiary mb-2 block">Nature</span>
            <h3 class="text-xl font-semibold mb-1 text-white">Mountain Rain</h3>
            <p class="text-muted text-xs mb-4">Deep resonance of storm fronts</p>
            <div class="flex items-center justify-between">
              <span class="text-[0.625rem] font-medium text-muted bg-surface/80 backdrop-blur-md px-2 py-1 rounded">Infinite Loop</span>
              <div class="w-10 h-10 rounded-full bg-primary-glow flex items-center justify-center shadow-[0_0_15px_rgba(75,142,255,0.4)] translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span class="material-symbols-outlined text-void font-bold">play_arrow</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Card 3 -->
        <div @click="store.setVideoId('4xDzrIxZZZI')" class="group relative aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-surface-container cursor-pointer transition-transform duration-500 hover:-translate-y-2 ghost-border">
          <img class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80" src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=500&fit=crop&q=80"/>
          <div class="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-8 w-full">
            <span class="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-primary mb-2 block">Ambient</span>
            <h3 class="text-xl font-semibold mb-1 text-white">Space Dark Resonance</h3>
            <p class="text-muted text-xs mb-4">Sci-fi atmospheric soundscapes</p>
            <div class="flex items-center justify-between">
              <span class="text-[0.625rem] font-medium text-muted bg-surface/80 backdrop-blur-md px-2 py-1 rounded">Focus Blocks</span>
              <div class="w-10 h-10 rounded-full bg-primary-glow flex items-center justify-center shadow-[0_0_15px_rgba(75,142,255,0.4)] translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span class="material-symbols-outlined text-void font-bold">play_arrow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- YouTube Saved Videos -->
    <section>
      <div class="flex items-center border-b border-muted/10 pb-6 mb-6">
        <h2 class="text-lg font-semibold tracking-tight text-white flex gap-3 items-center">
          <span class="material-symbols-outlined text-primary-glow">video_library</span>
          Your Saved Tracks
        </h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Add New Card -->
        <div class="group bg-surface-container/30 rounded-2xl border-2 border-dashed border-muted/30 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-surface-container/80 transition-all min-h-[220px]">
          <div class="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-muted group-hover:text-primary-glow transition-colors">
            <span class="material-symbols-outlined font-bold">add</span>
          </div>
          <span class="text-[0.6875rem] font-bold uppercase tracking-widest text-muted group-hover:text-primary-glow">Add YouTube Track</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useAudioStore } from '~/stores/useAudioStore'
const store = useAudioStore()
</script>
