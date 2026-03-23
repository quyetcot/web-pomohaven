<template>
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-[100] bg-surface-container/80 backdrop-blur-3xl ghost-border rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl transition-all duration-500" :class="store.isPlayerVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'">
    
    <div class="flex items-center gap-4 border-r border-muted/20 pr-6">
      <div class="w-10 h-10 rounded-lg overflow-hidden shrink-0 relative group">
        <div class="absolute inset-0 bg-void/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <span class="material-symbols-outlined text-white text-sm">open_in_full</span>
        </div>
        <img class="w-full h-full object-cover" :src="`https://img.youtube.com/vi/${store.currentVideoId}/default.jpg`"/>
      </div>
      <div class="hidden sm:block">
        <p class="text-xs font-semibold truncate max-w-[120px] text-white" :title="currentTitle">{{ currentTitle }}</p>
        <p class="text-[0.625rem] text-primary truncate max-w-[120px]" :title="currentAuthor">{{ currentAuthor }} • YT Music</p>
      </div>
    </div>
    
    <!-- Controls -->
    <div class="flex items-center gap-4">
      <button @click="store.togglePlay()" class="w-10 h-10 rounded-full bg-primary-glow flex items-center justify-center text-void shadow-[0_0_15px_rgba(75,142,255,0.4)] transition-transform hover:scale-105 active:scale-90">
        <span class="material-symbols-outlined font-bold">{{ store.isPlaying ? 'pause' : 'play_arrow' }}</span>
      </button>
    </div>
    
    <!-- Progress Bar (Fake loop for ambiance/youtube) -->
    <div class="flex-1 flex items-center gap-3">
      <span class="text-[10px] font-mono text-muted">∞</span>
      <div class="flex-1 h-1 flex bg-surface-variant rounded-full overflow-hidden relative group cursor-pointer">
        <div class="absolute inset-0 bg-primary-glow w-[100%] rounded-full opacity-50 shadow-[0_0_10px_#adc6ff]"></div>
      </div>
      <span class="text-[10px] font-mono text-muted">LIVE</span>
    </div>
    
    <!-- Volume Control -->
    <div class="flex items-center gap-4 pl-4 border-l border-muted/20 relative group/vol">
      <!-- Volume Slider Popover (Horizontal) with invisible hover bridge -->
      <div class="absolute bottom-full right-0 pb-4 opacity-0 group-hover/vol:opacity-100 pointer-events-none group-hover/vol:pointer-events-auto transition-all origin-bottom-right z-50">
        <div class="bg-surface-container/90 backdrop-blur-3xl px-4 py-3 rounded-2xl ghost-border w-48 flex flex-col gap-2 shadow-2xl">
          <div class="flex justify-between items-center w-full">
            <span class="text-[10px] uppercase font-bold text-muted tracking-wider">Volume</span>
            <span class="text-[10px] text-primary-glow font-mono">{{ store.settings.defaultVolume }}%</span>
          </div>
          <input v-model.number="store.settings.defaultVolume" type="range" min="0" max="100" class="w-full h-1.5 appearance-none bg-surface-variant rounded-full accent-primary-glow cursor-pointer" />
        </div>
      </div>
      
      <button class="text-muted hover:text-primary transition-colors active:scale-95"><span class="material-symbols-outlined text-xl">{{ store.settings.defaultVolume > 0 ? 'volume_up' : 'volume_off' }}</span></button>
      <NuxtLink to="/library" class="text-muted hover:text-primary transition-colors active:scale-95"><span class="material-symbols-outlined text-xl">playlist_play</span></NuxtLink>
      
      <!-- Close Button -->
      <button @click="store.isPlaying = false; store.isPlayerVisible = false" class="text-muted hover:text-rose-400 transition-colors active:scale-95 ml-2">
        <span class="material-symbols-outlined text-xl">close</span>
      </button>
    </div>
    
    <!-- Hidden Global YouTube Player container -->
    <div class="absolute -left-[9999px] opacity-0 pointer-events-none">
      <div id="youtube-api-player"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
import { useAudioStore } from '~/stores/useAudioStore'

const store = useAudioStore()
let ytPlayer = null

const currentTitle = ref("Loading Audio...")
const currentAuthor = ref("Aural Sanctuary")

const extractVideoInfo = (event) => {
  if (!event || !event.target || !event.target.getVideoData) return
  const data = event.target.getVideoData()
  if (data && data.title) {
    currentTitle.value = data.title
    currentAuthor.value = data.author || ''
  }
}

onMounted(() => {
  // Load YT API
  if (!window.YT) {
    const tag = document.createElement('script')
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    window.onYouTubeIframeAPIReady = initPlayer
  } else {
    initPlayer()
  }
})

const initPlayer = () => {
  ytPlayer = new window.YT.Player('youtube-api-player', {
    videoId: store.currentVideoId,
    playerVars: {
      autoplay: store.isPlaying ? 1 : 0,
      controls: 0,
      loop: 1,
      playlist: store.currentVideoId // Yêu cầu playlist để loop được
    },
    events: {
      onReady: (event) => {
        event.target.setVolume(store.settings.defaultVolume)
        extractVideoInfo(event)
        if (store.isPlaying) event.target.playVideo()
      },
      onStateChange: (event) => {
        extractVideoInfo(event)
        if (event.data === window.YT.PlayerState.ENDED) {
          event.target.playVideo() // Cưỡng ép loop nếu youtube param xịt
        }
      }
    }
  })
}

// Lắng nghe store đổi bài
watch(() => store.currentVideoId, (newId) => {
  if (ytPlayer && ytPlayer.loadVideoById) {
    ytPlayer.loadVideoById({ videoId: newId })
    if (store.isPlaying) ytPlayer.playVideo()
  }
})

// Lắng nghe Play/Pause mượt mà (không load lại iframe)
watch(() => store.isPlaying, (playing) => {
  if (ytPlayer && ytPlayer.playVideo) {
    playing ? ytPlayer.playVideo() : ytPlayer.pauseVideo()
  }
})

// Lắng nghe thanh Âm lượng
watch(() => store.settings.defaultVolume, (vol) => {
  if (ytPlayer && ytPlayer.setVolume) {
    ytPlayer.setVolume(vol)
  }
})
</script>
