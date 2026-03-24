import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export const useAudioStore = defineStore('audio', () => {
  // Persisted settings
  const settings = useLocalStorage('pomohaven_audio_v1', {
    defaultVideoId: 'jfKfPfyJRdk', // Lofi Girl fallback
    defaultVolume: 100,
    autoPlayFocus: false,
    autoPauseBreak: false
  })

  const currentVideoId = ref(settings.value.defaultVideoId)
  const isPlaying = ref(false)
  const isPlayerVisible = ref(false)
  const volumeRain = ref(0)
  const volumeCoffee = ref(0)
  
  // Shared metadata
  const currentTitle = ref("Loading Audio...")
  const currentAuthor = ref("Aural Sanctuary")
  
  // Keep base video ID synced if user changes default (including on Hydration from LocalStorage)
  watch(() => settings.value.defaultVideoId, (newId) => {
    if (!isPlaying.value) {
      currentVideoId.value = newId
    }
  }, { immediate: true })
  
  const setVideoId = (input: string) => {
    // Nếu truyền thẳng ID 11 ký tự (từ thư viện Library.vue)
    if (input.length === 11 && !input.includes('/')) {
      settings.value.defaultVideoId = input
      currentVideoId.value = input
      isPlaying.value = true
      isPlayerVisible.value = true
      return
    }

    // Nếu truyền Link YouTube (từ Dashboard / Settings)
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = input.match(regExp)

    if (match && match[2] && match[2].length === 11) {
      settings.value.defaultVideoId = match[2] // Lưu thẳng vào LocalStorage
      currentVideoId.value = match[2]
      isPlaying.value = true
      isPlayerVisible.value = true
    }
  }

  const updateMetadata = (title: string, author: string) => {
    currentTitle.value = title
    currentAuthor.value = author
  }

  const play = () => {
    isPlaying.value = true
    isPlayerVisible.value = true
  }

  const pause = () => {
    isPlaying.value = false
  }

  const togglePlay = () => {
    isPlaying.value ? pause() : play()
  }

  return {
    // State
    settings,
    currentVideoId,
    isPlaying,
    isPlayerVisible,
    volumeRain,
    volumeCoffee,
    currentTitle,
    currentAuthor,
    
    // Actions
    setVideoId,
    updateMetadata,
    play,
    pause,
    togglePlay
  }
})
