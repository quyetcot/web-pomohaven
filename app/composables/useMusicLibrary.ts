import { computed } from 'vue'

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

export const useMusicLibrary = () => {
  const library: Track[] = [
    // LOFI & CHILL
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
      id: 'n61ULEU7CO0', 
      name: 'Chill Lofi',
      title: 'chill lofi hip hop radio - beats to relax/study to', 
      author: 'Lofi Girl', 
      genre: 'Lofi',
      icon: 'coffee_maker'
    },
    { 
      id: '7NOSDKb0HlU', 
      name: 'Study Session',
      title: '1 A.M Study Session 📚 - [lofi hip hop/chill beats]', 
      author: 'Lofi Girl', 
      genre: 'Lofi',
      icon: 'auto_stories'
    },

    // NATURE & AMBIENCE
    { 
      id: '5qap5aO4i9A', 
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
      id: '8my5X9_023w', 
      name: 'Forest Rain',
      title: '10 Hours of Deep Forest Sounds', 
      author: 'Nature Ambiance', 
      genre: 'Nature',
      icon: 'forest'
    },

    // AMBIENT & SPACE
    { 
      id: '4xDzrIxZZZI', 
      name: 'Deep Space',
      title: 'Deep Space Resonance', 
      author: 'Space Ambient', 
      genre: 'Ambient',
      icon: 'rocket_launch',
      description: 'Sci-fi atmospheric textures for cosmic productivity.'
    },
    { 
      id: 'S_f7-2v6LAs', 
      name: 'Blade Runner',
      title: 'Blade Runner 2049 - Rain & Ambient', 
      author: 'Cyberpunk Focus', 
      genre: 'Ambient',
      icon: 'memory'
    },
    { 
      id: 'lP26UCnoH9s', 
      name: 'Carbon Focus',
      title: 'Deep Focus - Carbon Based Lifeforms', 
      author: 'Ultimae', 
      genre: 'Ambient',
      icon: 'waves'
    },

    // CLASSICAL & PIANO
    { 
      id: 'h29gZOV0Q7M', 
      name: 'Quiet Cafe',
      title: 'Quiet Night in a Cafe', 
      author: 'Cafe Music BGM', 
      genre: 'Classical',
      icon: 'coffee',
      description: 'Elegant piano and soft cafe ambiance for a sophisticated focus.'
    },
    { 
      id: 'W_mS0n6rW04', 
      name: 'Classic Piano',
      title: 'Beautiful Relaxing Piano Music', 
      author: 'Peder B. Helland', 
      genre: 'Classical',
      icon: 'piano'
    },
    { 
      id: '9E6b3swbnWg', 
      name: 'Dark Academia',
      title: 'Dark Academia - Classical Music', 
      author: 'The Wicked North', 
      genre: 'Classical',
      icon: 'history_edu'
    }
  ]

  const genres = ['All', 'Lofi', 'Nature', 'Ambient', 'Classical']

  const getTracksByGenre = (genre: string) => {
    if (genre === 'All') return library
    return library.filter(t => t.genre === genre)
  }

  const getFeaturedTracks = () => {
    // Pick first track of each genre as featured
    const featuredIds = ['jfKfPfyJRdk', '5qap5aO4i9A', '4xDzrIxZZZI', 'h29gZOV0Q7M']
    return library.filter(t => featuredIds.includes(t.id))
  }

  return {
    library,
    genres,
    getTracksByGenre,
    getFeaturedTracks
  }
}
