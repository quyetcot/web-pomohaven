---
description: Quy trình commit và push code lên Git một cách an toàn, có tổ chức.
---

# /git-commit — Quy Trình Git An Toàn

// turbo-all

## BƯỚC 1: Kiểm tra trạng thái

```bash
git status
git diff --stat
```

Xác nhận không có file nhạy cảm (`.env`, `*.key`) nào bị track.

## BƯỚC 2: Chọn branch phù hợp

- **Feature mới** → tạo branch mới: `feat/<tên-ngắn>`
- **Bug fix** → `fix/<tên-ngắn>`
- **Refactor** → `refactor/<tên-ngắn>`
- **Đang trên branch đúng** → bỏ qua bước này

```bash
# Tạo và chuyển sang branch mới
git checkout -b feat/<tên-ngắn>
```

## BƯỚC 3: Stage và Commit

```bash
# Stage toàn bộ thay đổi
git add .

# Hoặc stage từng file cụ thể
git add app/stores/useAuthStore.ts app/pages/library.vue
```

**Format commit message bắt buộc:**
```
<type>(<scope>): <mô tả ngắn tiếng Anh>

feat(auth): Add ensureProfile upsert on Google OAuth login
fix(db): Change personal_tracks FK to reference auth.users
refactor(library): Move Add Track form from Dashboard to Library page
chore(agents): Standardize .agents structure for Antigravity
```

**Type hợp lệ:** `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `perf`

```bash
git commit -m "feat(auth): Add ensureProfile upsert on Google OAuth login"
```

## BƯỚC 4: Push lên Remote

```bash
# Push branch lần đầu
git push -u origin <tên-branch>

# Push cập nhật sau đó
git push
```

## BƯỚC 5: Cập nhật PROJECT_STATE.md

Nếu commit này là milestone quan trọng:
1. Mở `PROJECT_STATE.md`
2. Đánh dấu `[x]` các mục đã hoàn thành
3. Thêm entry vào mục Changelog

---

## Quy tắc bắt buộc

- **KHÔNG** commit file `.env` hay bất kỳ file chứa secret nào
- **KHÔNG** dùng `git add .` nếu chưa chạy `git status` trước
- **KHÔNG** force push lên `main`/`master`
- Mỗi commit chỉ giải quyết **một vấn đề** (Single Responsibility)
