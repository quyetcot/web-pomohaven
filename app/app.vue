<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>


<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/useAuthStore'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuthSession()
})

useSeoMeta({
  title: 'PomoHaven - The Deep Focus Sanctuary',
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
