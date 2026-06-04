<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>


<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '~/stores/useAuthStore'
import { useMusicStore } from '~/stores/useMusicStore'
import { useTimerStore } from '~/stores/useTimerStore'

const authStore = useAuthStore()
const timerStore = useTimerStore()

// --- Dynamic Document Title ---
// Hiển thị đồng hồ đếm ngược trực tiếp trên tab title,
// hữu ích khi người dùng chuyển sang tab khác.
// Format: "⏱ 24:35 · Focus — PomoHaven" hoặc "⏸ 24:35 · Focus — PomoHaven"
const dynamicTitle = computed(() => {
  if (timerStore.isRunning) {
    return `⏱ ${timerStore.formattedTime} · ${timerStore.modeLabel} — PomoHaven`
  }
  if (timerStore.timeRemaining < timerStore.currentDuration) {
    // Timer đã bắt đầu nhưng đang pause
    return `⏸ ${timerStore.formattedTime} · ${timerStore.modeLabel} — PomoHaven`
  }
  return 'PomoHaven — The Deep Focus Sanctuary'
})

useHead({
  title: dynamicTitle,
})

onMounted(async () => {
  await authStore.initAuthSession()
  
  // Sync Settings
  const { loadSettings } = useSettingsSync()
  loadSettings()

  // Sync Music
  const musicStore = useMusicStore()
  musicStore.loadPersonalTracks()
})

useSeoMeta({
  ogTitle: 'PomoHaven - The Deep Focus Sanctuary',
  description: 'Maximize your productivity with PomoHaven, the ultimate deep work sanctuary combining a premium Pomodoro timer with immersive YouTube audio integration.',
  ogDescription: 'Maximize your productivity with PomoHaven, the ultimate deep work sanctuary combining a premium Pomodoro timer with immersive YouTube audio integration.',
  ogImage: '/logo.png',
  twitterCard: 'summary_large_image',
  twitterTitle: 'PomoHaven - The Deep Focus Sanctuary',
  twitterDescription: 'The ultimate deep work sanctuary for creators and developers.',
  twitterImage: '/logo.png',
})
</script>
