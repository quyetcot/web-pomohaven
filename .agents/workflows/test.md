---
description: Quy trình chạy tests (unit + E2E) trước khi commit hoặc deploy.
---

# /test — Quy Trình Chạy Tests

// turbo-all

## BƯỚC 1: Unit Tests (Vitest)

```bash
# Chạy toàn bộ unit tests
npx vitest run

# Chạy với coverage report
npx vitest run --coverage

# Watch mode khi đang develop
npx vitest
```

**Kết quả cần đạt:**
- ✅ Tất cả tests PASS
- ✅ Store coverage ≥ 80%
- ✅ Không có `console.error` không mong đợi

---

## BƯỚC 2: Type Check

```bash
vue-tsc --noEmit
```

Không được có TypeScript error trước khi commit.

---

## BƯỚC 3: E2E Tests (Playwright)

```bash
# Đảm bảo dev server đang chạy
npm run dev &

# Chạy E2E tests
npx playwright test

# Xem report nếu có lỗi
npx playwright show-report
```

**Luồng E2E bắt buộc phải pass:**
- [ ] Trang chủ load thành công, không có console error
- [ ] Timer Start → Pause → Reset hoạt động đúng
- [ ] Điều hướng giữa các trang không lỗi
- [ ] Add personal track (khi đã login) xuất hiện trong library

---

## BƯỚC 4: Manual Smoke Test (5 phút)

Mở Browser Agent và kiểm tra nhanh:

```
1. Mở http://localhost:3000
2. Bấm Start timer → đếm ngược chạy
3. Chuyển sang /library → không bị lỗi
4. Chuyển sang /analytics → chart load
5. Chuyển sang /settings → form hiển thị
6. Kiểm tra console không có lỗi đỏ
```

---

## BƯỚC 5: Quyết định

| Kết quả | Hành động |
| :--- | :--- |
| Tất cả pass | ✅ Tiến hành `/git-commit` |
| Unit test fail | 🔴 Fix → chạy lại |
| E2E fail | 🔴 Dùng `/debug` → fix → chạy lại |
| Type error | 🔴 Fix TypeScript → chạy lại |

---

## Lịch chạy Test khuyến nghị

| Thời điểm | Test cần chạy |
| :--- | :--- |
| Trước mỗi `git commit` | Unit tests + type check |
| Trước `git push` | Thêm E2E tests |
| Trước deploy production | Toàn bộ + manual smoke test |
