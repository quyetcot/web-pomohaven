---
name: E2E Testing
description: Hướng dẫn viết E2E tests với Playwright cho PomoHaven — test OAuth login, timer flow, và Supabase sync.
---

# E2E Testing Skill — Playwright

---

## 1. Cài đặt

```bash
npm install -D @playwright/test
npx playwright install chromium
```

Cấu hình `playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  }
})
```

---

## 2. Test Cases Ưu tiên

### 2.1. Timer Flow (Quan trọng nhất)

```typescript
// tests/e2e/timer.spec.ts
import { test, expect } from '@playwright/test'

test('timer hoạt động đúng khi Start → Pause → Reset', async ({ page }) => {
  await page.goto('/')

  // Start timer
  await page.getByRole('button', { name: /start/i }).click()
  await expect(page.getByTestId('timer-display')).not.toContain('25:00')

  // Pause
  await page.getByRole('button', { name: /pause/i }).click()
  const pausedTime = await page.getByTestId('timer-display').textContent()

  // Đợi 2s — timer không được chạy khi pause
  await page.waitForTimeout(2000)
  expect(await page.getByTestId('timer-display').textContent()).toBe(pausedTime)

  // Reset
  await page.getByRole('button', { name: /reset/i }).click()
  await expect(page.getByTestId('timer-display')).toHaveText('25:00')
})
```

### 2.2. Library — Add Personal Track

```typescript
test('thêm personal track khi đã login', async ({ page }) => {
  // Giả lập session đã login (dùng storageState)
  await page.goto('/library')

  await page.getByRole('button', { name: /add new track/i }).click()
  await page.getByPlaceholder(/youtube/i).fill('https://youtu.be/jfKfPfyJRdk')
  await page.getByPlaceholder(/track name/i).fill('E2E Test Track')
  await page.getByRole('button', { name: /save/i }).click()

  await expect(page.getByText('Track saved')).toBeVisible()
  await expect(page.getByText('E2E Test Track')).toBeVisible()
})
```

### 2.3. Navigation & Responsive

```typescript
test('điều hướng giữa các trang không bị lỗi', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /library/i }).click()
  await expect(page).toHaveURL('/library')

  await page.getByRole('link', { name: /analytics/i }).click()
  await expect(page).toHaveURL('/analytics')

  await page.getByRole('link', { name: /settings/i }).click()
  await expect(page).toHaveURL('/settings')
})

test('không có console errors khi load trang chủ', async ({ page }) => {
  const errors: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  expect(errors).toHaveLength(0)
})
```

---

## 3. Pattern: Mock Auth (Bypass OAuth)

Trong E2E test, KHÔNG test Google OAuth thật. Dùng `storageState` để giả lập session:

```typescript
// tests/e2e/fixtures/auth.ts
import { test as base } from '@playwright/test'

export const test = base.extend({
  // Dùng storageState đã lưu sẵn từ lần login thật
  storageState: 'tests/e2e/.auth/user.json'
})

// Tạo auth state 1 lần (chạy thủ công)
// npx playwright codegen http://localhost:3000 --save-storage=tests/e2e/.auth/user.json
```

---

## 4. Chạy Tests

```bash
# Chạy toàn bộ E2E tests
npx playwright test

# Chạy với UI mode (debug dễ hơn)
npx playwright test --ui

# Chạy test cụ thể
npx playwright test timer.spec.ts

# Xem report
npx playwright show-report
```

---

## 5. CI Integration

Thêm vào `.github/workflows/e2e.yml`:

```yaml
- name: Run E2E Tests
  run: npx playwright test
  env:
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}
```
