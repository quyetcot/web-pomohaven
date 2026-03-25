import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export interface Track {
  id: string
  name: string
  title: string
  author: string
  genre: string
  thumbnail?: string
  description?: string
  icon?: string
}

export const useMusicStore = defineStore('music', () => {
  // Default Curated Library
  const defaultLibrary: Track[] = [
    { 
      id: 'jfKfPfyJRdk', 
      name: 'Lofi Beats',
      title: 'lofi hip hop radio - beats to relax/study to', 
      author: 'Lofi Girl', 
      genre: 'Lofi',
      icon: 'potted_plant',
      description: 'The iconic focus soundtrack. Steady, gentle beats for deep concentration.'
    },
    { 
      id: 'Qo4JIT8jMtI', 
      name: 'Mountain Rain',
      title: 'Mountain Rain & Thunderstorm', 
      author: 'Nature Sounds', 
      genre: 'Nature',
      icon: 'rainy',
      description: 'Immersive natural soundscapes to anchor your focus.'
    },
    { 
      id: 'mPZkdNFkNps', 
      name: 'Ocean Waves',
      title: 'Deep Ocean Waves for Sleep & Focus', 
      author: 'Ocean Wellness', 
      genre: 'Nature',
      icon: 'water_drop'
    },
    { 
      id: 'kXUnJ61KxRE', 
      name: 'Deep Space',
      title: 'Deep Space... Total Relaxation | White Noise | Cosmic Travel', 
      author: 'Universe', 
      genre: 'Ambient',
      icon: 'rocket_launch',
      description: 'Cosmic journey in deep space 🔭White noise will help you to relax 💤'
    },
    { 
      id: 'zr5JjgOMXeQ', 
      name: 'Quiet Cafe',
      title: 'Relax Quiet Cafe ☕ Cozy Coffee Shop with Lofi Hip Hop Mix', 
      author: 'Lofi Café', 
      genre: 'Classical',
      icon: 'coffee',
      description: 'Cozy coffee shop ambience'
    },
  ]

  // Personal Tracks (Persisted)
  const personalTracks = useLocalStorage<Track[]>('pomohaven_personal_tracks_v1', [])

  // State
  const genres = ['All', 'Lofi', 'Nature', 'Ambient', 'Classical', 'Personal']

  // Computed
  const library = computed(() => [...defaultLibrary, ...personalTracks.value])

  // Actions
  const addTrack = (id: string, name: string, genre: string) => {
    // Avoid duplicates
    if (personalTracks.value.some(t => t.id === id) || defaultLibrary.some(t => t.id === id)) {
      return
    }

    const newTrack: Track = {
      id,
      name,
      title: name, // Default title to name
      author: 'Personal Collection',
      genre: genre || 'Personal',
      icon: 'music_note'
    }

    personalTracks.value.push(newTrack)
  }

  const removeTrack = (id: string) => {
    personalTracks.value = personalTracks.value.filter(t => t.id !== id)
  }

  const getTracksByGenre = (genre: string) => {
    if (genre === 'All') return library.value
    if (genre === 'Personal') return personalTracks.value
    return library.value.filter(t => t.genre === genre)
  }

  const getFeaturedTracks = () => {
    // Mix of 4 curated + any personal
    const featuredCurated = ['jfKfPfyJRdk', 'Qo4JIT8jMtI', 'kXUnJ61KxRE', 'zr5JjgOMXeQ']
    const curated = defaultLibrary.filter(t => featuredCurated.includes(t.id))
    return [...curated, ...personalTracks.value]
  }

  return {
    library,
    personalTracks,
    genres,
    addTrack,
    removeTrack,
    getTracksByGenre,
    getFeaturedTracks
  }
})
