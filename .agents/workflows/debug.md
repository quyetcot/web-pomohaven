---
description: Quy trình debug có hệ thống khi gặp bug trong PomoHaven.
---

# /debug — Quy Trình Debug Có Hệ Thống

## BƯỚC 1: Phân loại bug

Xác định loại bug trước khi làm bất cứ điều gì:

| Triệu chứng | Loại | Hướng debug |
| :--- | :--- | :--- |
| UI không render / sai | **Vue Template** | Bước 2A |
| Data không lên DB | **Supabase** | Bước 2B |
| Timer bị lệch / dừng | **Store Logic** | Bước 2C |
| App crash khi reload | **SSR / Hydration** | Bước 2D |
| Auth không hoạt động | **OAuth** | Bước 2E |

## BƯỚC 2A: Debug Vue Template

```bash
# Kiểm tra devtools console
# Tìm kiếm các lỗi phổ biến:
```

- `[Vue warn]: Missing required prop` → thiếu prop bắt buộc
- `Cannot read properties of undefined` → data chưa load khi render
- `v-model` không phản hồi → kiểm tra `ref()` vs `reactive()`

**Tool:** Mở Vue DevTools → tab Components → xem state thực tế của component.

## BƯỚC 2B: Debug Supabase (Quan trọng nhất)

> ⚠️ **Rule số 1:** Supabase KHÔNG throw exception — nó trả về `{ data, error }`. Luôn log cả hai.

```typescript
// Pattern chuẩn để debug
const { data, error } = await supabase.from('table').insert({...})
console.log('[DEBUG] data:', data)
console.log('[DEBUG] error:', error)
```

**Checklist khi data không lên DB:**
- [ ] `authStore.user` có giá trị không? (log ra xem)
- [ ] Bảng `profiles` có row cho user này không?
- [ ] RLS policy có đủ cho thao tác đó (INSERT/SELECT/UPDATE)?
- [ ] Foreign key constraint có bị vi phạm không? (lỗi code `23503`)
- [ ] Kiểm tra Network tab → tìm request đến `supabase.co` → xem response body

**Lỗi phổ biến Supabase:**

| Error code | Nguyên nhân | Fix |
| :--- | :--- | :--- |
| `23503` | FK constraint violation | Tạo profile trước khi insert |
| `42501` | RLS policy chặn | Thêm policy còn thiếu |
| `23505` | Duplicate unique key | Dùng `upsert` thay `insert` |
| `PGRST116` | Row không tồn tại | Kiểm tra filter `.eq()` |

## BƯỚC 2C: Debug Timer / Store Logic

```typescript
// Thêm tạm vào store để debug
watch(remainingTime, (val) => {
  console.log('[Timer]', val, 'phase:', currentPhase.value)
})
```

- Kiểm tra `useLocalStorage` key có đúng tên không (xem Application tab → LocalStorage)
- Timer drift: đảm bảo dùng `startTimestamp` + `Date.now()`, không dùng `setInterval` thuần

## BƯỚC 2D: Debug SSR / Hydration

Triệu chứng: App bị flash, lỗi hydration mismatch, crash khi F5.

- Tìm code dùng `window`/`document` ngoài `onMounted()` → wrap lại
- Kiểm tra `useLocalStorage` — VueUse handle SSR tự động, không cần guard
- Thêm `<ClientOnly>` wrapper cho component chỉ chạy trên client

## BƯỚC 2E: Debug OAuth

- Kiểm tra Callback URL trong Supabase Dashboard có khớp với URL đang chạy không
- Log `supabase.auth.getSession()` ngay khi app mount
- Kiểm tra `authStore.isInitialized` — có thể component load trước khi auth check xong

## BƯỚC 3: Dùng Browser Agent để tái hiện

> // turbo

```
Mở Browser Agent, truy cập [URL], thực hiện [steps để kích hoạt bug],
chụp console errors và network tab, báo cáo lại.
```

## BƯỚC 4: Fix & Verify

- Fix theo pattern đúng (không patch tạm)
- Rerun Browser Agent để confirm bug đã hết
- **Commit fix** theo format: `fix(<scope>): <mô tả>`

---

## Nguyên tắc debug tuyệt đối

1. **KHÔNG** đoán mù — luôn log ra trước khi kết luận
2. **KHÔNG** fix triệu chứng mà phải fix nguyên nhân gốc
3. **KHÔNG** xóa code debug log khi chưa confirm fix xong
4. Sau khi fix: xóa tất cả `console.log('[DEBUG]')` tạm thời
