---
name: Analytics Charts
description: Hướng dẫn xây dựng Performance Analytics với Chart.js trong Nuxt 4, lấy dữ liệu từ bảng pomo_sessions.
---

# Analytics Charts Skill

Skill này định nghĩa cách xây dựng `analytics.vue` — trang **Performance Analytics** — sử dụng Chart.js với dữ liệu từ Supabase.

---

## 1. Cài đặt

```bash
npm install chart.js vue-chartjs
```

> Không dùng `@nuxtjs/chartjs` — package đó không tương thích Nuxt 4. Dùng `vue-chartjs` với `<ClientOnly>` wrapper.

---

## 2. Cấu trúc Dữ liệu (`pomo_sessions`)

```typescript
interface PomoSession {
  id: string
  user_id: string
  type: 'focus' | 'shortBreak' | 'longBreak'
  duration: number     // actual giây đã focus
  created_at: string   // ISO timestamp
}
```

**Query lấy dữ liệu 7 ngày gần nhất:**
```typescript
const sevenDaysAgo = new Date()
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

const { data, error } = await supabase
  .from('pomo_sessions')
  .select('*')
  .eq('user_id', authStore.user!.id)
  .eq('type', 'focus')
  .gte('created_at', sevenDaysAgo.toISOString())
  .order('created_at', { ascending: true })
```

---

## 3. Charts cần xây dựng

### 3.1. Focus Hours by Day (Bar Chart)
Hiển thị tổng giờ focus theo từng ngày trong 7 ngày.

```typescript
// Transform data
const groupByDay = (sessions: PomoSession[]) => {
  const days: Record<string, number> = {}
  sessions.forEach(s => {
    const day = new Date(s.created_at).toLocaleDateString('vi-VN', { weekday: 'short' })
    days[day] = (days[day] || 0) + s.duration / 3600 // Convert to hours
  })
  return days
}
```

### 3.2. Sessions Completed (Line Chart)
Số session hoàn thành theo ngày — trend line.

### 3.3. Focus Streak (Stat card, không phải chart)
Chuỗi ngày liên tiếp có ít nhất 1 focus session.

---

## 4. Component Pattern (SSR-Safe)

```vue
<template>
  <!-- PHẢI dùng ClientOnly — Chart.js cần browser APIs -->
  <ClientOnly>
    <Bar :data="chartData" :options="chartOptions" />
    <template #fallback>
      <div class="h-48 bg-component/40 rounded-2xl animate-pulse" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const chartData = computed(() => ({
  labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
  datasets: [{
    label: 'Giờ Focus',
    data: [2.5, 1.8, 3.2, 0, 4.1, 2.0, 1.5],
    backgroundColor: 'rgba(75, 142, 255, 0.6)',
    borderColor: '#4b8eff',
    borderRadius: 8,
  }]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (ctx) => `${ctx.raw}h focus` } }
  },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#c1c6d7' } },
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#c1c6d7' } }
  }
}
</script>
```

---

## 5. Store Pattern cho Analytics

Logic xử lý data PHẢI đặt trong store, không trong component:

```typescript
// stores/useAnalyticsStore.ts
export const useAnalyticsStore = defineStore('analytics', () => {
  const sessions = ref<PomoSession[]>([])
  const isLoading = ref(false)

  const loadSessions = async (days = 7) => {
    isLoading.value = true
    const since = new Date()
    since.setDate(since.getDate() - days)

    const { data, error } = await supabase
      .from('pomo_sessions')
      .select('*')
      .eq('user_id', authStore.user!.id)
      .gte('created_at', since.toISOString())

    if (error) throw new Error(error.message)
    sessions.value = data ?? []
    isLoading.value = false
  }

  const totalFocusHours = computed(() =>
    sessions.value
      .filter(s => s.type === 'focus')
      .reduce((sum, s) => sum + s.duration, 0) / 3600
  )

  const totalSessions = computed(() =>
    sessions.value.filter(s => s.type === 'focus').length
  )

  return { sessions, isLoading, loadSessions, totalFocusHours, totalSessions }
})
```

---

## 6. Design Tokens cho Charts

Cấu hình màu sắc Chart.js phù hợp với PomoDesign:

```typescript
const CHART_COLORS = {
  primary: '#4b8eff',
  primarySoft: 'rgba(75, 142, 255, 0.2)',
  accent: '#adc6ff',
  grid: 'rgba(255, 255, 255, 0.05)',
  text: '#c1c6d7',
}
```

> **Không hardcode** các giá trị này trực tiếp vào từng chart — export từ một file constants duy nhất.
