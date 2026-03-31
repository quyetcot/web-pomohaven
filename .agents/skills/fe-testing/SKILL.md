---
name: FE Testing
description: Hướng dẫn viết unit test cho Pinia Stores và Vue Components trong PomoHaven bằng Vitest và Vue Test Utils.
---

# FE Testing Skill — Vitest + Vue Test Utils

---

## 1. Cài đặt

```bash
npm install -D vitest @vue/test-utils @pinia/testing happy-dom
```

Cấu hình `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: { '~': new URL('./app', import.meta.url).pathname }
  }
})
```

---

## 2. Test Pinia Stores (Ưu tiên cao nhất)

Stores chứa business logic — đây là nơi cần được test kỹ nhất.

```typescript
// tests/stores/useTimerStore.test.ts
import { setActivePinia, createPinia } from 'pinia'
import { useTimerStore } from '~/stores/useTimerStore'

describe('useTimerStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('bắt đầu đếm ngược khi gọi startTimer()', () => {
    const store = useTimerStore()
    store.startTimer()
    expect(store.isRunning).toBe(true)
  })

  it('chuyển sang Rest Period sau khi focus xong', async () => {
    const store = useTimerStore()
    store.focusDuration = 1 // 1 giây để test nhanh
    store.startTimer()
    vi.advanceTimersByTime(1100)
    await nextTick()
    expect(store.currentPhase).toBe('shortBreak')
  })

  it('reset về trạng thái ban đầu khi gọi resetTimer()', () => {
    const store = useTimerStore()
    store.startTimer()
    store.resetTimer()
    expect(store.isRunning).toBe(false)
    expect(store.remainingTime).toBe(store.focusDuration)
  })
})
```

### Test Store có Supabase (Mock)

```typescript
// tests/stores/useMusicStore.test.ts
import { mockSupabase } from '../mocks/supabase'

vi.mock('~/composables/useSupabase', () => ({
  useSupabase: () => mockSupabase
}))

it('addTrack lưu vào DB khi user đã đăng nhập', async () => {
  mockSupabase.from.mockReturnValue({
    insert: vi.fn().mockResolvedValue({ data: {}, error: null })
  })
  const store = useMusicStore()
  await store.addTrack('abc123', 'Test Track', 'Lofi')
  expect(mockSupabase.from).toHaveBeenCalledWith('personal_tracks')
})

it('throw error khi DB insert thất bại', async () => {
  mockSupabase.from.mockReturnValue({
    insert: vi.fn().mockResolvedValue({ data: null, error: { message: 'FK violation' } })
  })
  const store = useMusicStore()
  await expect(store.addTrack('abc123', 'Test', 'Lofi')).rejects.toThrow('FK violation')
})
```

---

## 3. Mock Supabase

```typescript
// tests/mocks/supabase.ts
export const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  upsert: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    onAuthStateChange: vi.fn(),
  }
}
```

---

## 4. Test Vue Components

```typescript
// tests/components/FocusTimerOrb.test.ts
import { mount } from '@vue/test-utils'
import FocusTimerOrb from '~/components/focus/FocusTimerOrb.vue'

it('hiển thị đúng format MM:SS', () => {
  const wrapper = mount(FocusTimerOrb, {
    props: { remainingTime: 1499 } // 24:59
  })
  expect(wrapper.text()).toContain('24:59')
})

it('hiển thị 00:00 khi remainingTime = 0', () => {
  const wrapper = mount(FocusTimerOrb, {
    props: { remainingTime: 0 }
  })
  expect(wrapper.text()).toContain('00:00')
})
```

---

## 5. Coverage Targets (Bắt buộc đạt trước khi deploy)

| Layer | Coverage tối thiểu |
| :--- | :--- |
| Pinia Stores | **80%** |
| Composables | **70%** |
| Utility functions | **90%** |
| Vue Components | **50%** (happy path) |

```bash
# Chạy test với coverage report
npx vitest run --coverage
```
