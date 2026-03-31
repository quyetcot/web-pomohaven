---
name: FE Patterns
description: Cẩm nang các pattern Frontend chuẩn cho PomoHaven — form validation, loading states, error UI, responsive.
---

# FE Patterns Skill

---

## 1. Loading States (Skeleton UI)

Khi chờ Supabase response, KHÔNG để UI trống. Dùng skeleton thay vì spinner.

```vue
<template>
  <!-- Loading skeleton -->
  <div v-if="isLoading" class="space-y-3">
    <div v-for="i in 3" :key="i"
         class="h-16 bg-component/40 rounded-2xl animate-pulse" />
  </div>

  <!-- Actual content -->
  <div v-else-if="data.length > 0">
    <!-- content -->
  </div>

  <!-- Empty state -->
  <div v-else class="text-center py-12 text-muted">
    <span class="material-symbols-outlined text-4xl mb-2">library_music</span>
    <p class="text-sm">Chưa có track nào. Thêm track đầu tiên!</p>
  </div>
</template>
```

---

## 2. Form Validation Pattern

Dùng native HTML5 validation + reactive error state. **Không cần vee-validate** cho forms đơn giản.

```vue
<script setup lang="ts">
const form = reactive({
  url: '',
  name: '',
})

const errors = reactive({
  url: '',
  name: '',
})

const validate = (): boolean => {
  errors.url = ''
  errors.name = ''

  if (!form.url) {
    errors.url = 'URL là bắt buộc'
  } else if (!extractVideoId(form.url)) {
    errors.url = 'URL YouTube không hợp lệ'
  }

  if (!form.name.trim()) {
    errors.name = 'Tên track là bắt buộc'
  }

  return !errors.url && !errors.name
}

const handleSubmit = async () => {
  if (!validate()) return
  // proceed...
}
</script>

<template>
  <input v-model="form.url" :class="errors.url ? 'border-red-400/50' : ''" />
  <p v-if="errors.url" class="text-xs text-red-400 mt-1">{{ errors.url }}</p>
</template>
```

---

## 3. Error Boundary UI

Khi action thất bại, hiển thị lỗi rõ ràng — không để im lặng.

```vue
<template>
  <!-- Inline error (trong form) -->
  <div v-if="errorMessage"
       class="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border-t border-l border-red-400/20">
    <span class="material-symbols-outlined text-red-400 text-[20px]">error</span>
    <p class="text-xs text-red-400">{{ errorMessage }}</p>
  </div>

  <!-- Success feedback -->
  <div v-if="successMessage"
       class="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border-t border-l border-green-400/20">
    <span class="material-symbols-outlined text-green-400 text-[20px]">check_circle</span>
    <p class="text-xs text-green-400">{{ successMessage }}</p>
  </div>
</template>
```

---

## 4. Async Button (Loading State)

Bắt buộc disable button và hiện loading khi action đang chạy.

```vue
<template>
  <button
    :disabled="isSaving"
    :aria-label="isSaving ? 'Đang lưu...' : 'Lưu track'"
    class="rounded-full px-4 py-2 bg-accent text-void transition-all duration-300
           disabled:opacity-50 disabled:cursor-not-allowed
           hover:shadow-[0_0_20px_rgba(75,142,255,0.4)]"
    @click="handleSave"
  >
    <span v-if="isSaving" class="material-symbols-outlined animate-spin text-[20px]">
      progress_activity
    </span>
    <span v-else>Lưu</span>
  </button>
</template>
```

---

## 5. Responsive Breakpoints (PomoHaven Standard)

| Breakpoint | Class | Viewport | Dùng cho |
| :--- | :--- | :--- | :--- |
| Mobile | (default) | < 768px | TheMobileNav, stack layout |
| Tablet | `md:` | 768px+ | 2-column grids |
| Desktop | `lg:` | 1024px+ | Sidebar visible, full layout |

```vue
<!-- Layout pattern chuẩn -->
<div class="
  flex flex-col          <!-- mobile: stack -->
  lg:flex-row            <!-- desktop: side by side -->
  gap-4 lg:gap-6
">
  <aside class="hidden lg:block w-64"><!-- Sidebar --></aside>
  <main class="flex-1 min-w-0"><!-- Content --></main>
</div>
```

---

## 6. Conditional Rendering Rules

```vue
<!-- v-show: toggle nhanh, không destroy DOM -->
<div v-show="isDropdownOpen">...</div>
<div v-show="isTooltipVisible">...</div>

<!-- v-if: content nặng, data từ API, chỉ render khi cần -->
<HeavyChart v-if="analyticsData.length > 0" :data="analyticsData" />
<PersonalTrackList v-if="isLoggedIn" />
```

---

## 7. Composable Extraction Pattern

Khi component script > 50 dòng, extract logic ra composable:

```typescript
// composables/useTrackForm.ts
export const useTrackForm = () => {
  const form = reactive({ url: '', name: '', genre: 'Personal' })
  const errors = reactive({ url: '', name: '' })
  const isSaving = ref(false)
  const saveError = ref('')
  const saveSuccess = ref(false)

  const extractVideoId = (input: string) => { /* ... */ }
  const validate = (): boolean => { /* ... */ }
  const reset = () => { /* ... */ }

  return { form, errors, isSaving, saveError, saveSuccess, validate, reset }
}
```
