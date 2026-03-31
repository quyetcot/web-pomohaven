# PomoHaven — Project State & Development Log
*Tệp này là bộ nhớ cốt lõi (Core Memory) của AI Agent. Đọc tệp này để khôi phục toàn bộ bối cảnh dự án thay vì quét lại toàn bộ mã nguồn.*

---

## 1. Trạng thái Dự án (Current Status)

- **Giai đoạn hiện tại:** Phase 6 — Production Integration & Feature Refinement.
- **Branch hiện tại:** `feat/supabase-sync-integration`

### Tiến độ (Progress Checklist)
- [x] Chốt yêu cầu phần mềm (`document/srs.md`).
- [x] Hoàn thành Mockup HTML tĩnh (demo, library, settings, analytics).
- [x] Xây dựng hệ thống AI Agent (Rules, Workflows, Skills).
- [x] Khởi tạo dự án Nuxt 4 & cấu hình môi trường (Tailwind, Pinia, VueUse).
- [x] Layout cơ bản: `TheSidebar`, `TheHeader`, `TheMobileNav`.
- [x] Base Components: `FocusTimerOrb`, `BaseButton`, `BaseSlider`.
- [x] Pinia Stores: `useTimerStore`, `useAudioStore`, `useMusicStore`, `useAuthStore`.
- [x] Tất cả pages: `index.vue`, `library.vue`, `analytics.vue`, `settings.vue`, `auth.vue`.
- [x] Tích hợp Supabase Auth (Google OAuth).
- [x] Đồng bộ Supabase DB: `profiles`, `user_settings`, `personal_tracks`, `pomo_sessions`.
- [x] Chuyển "Add Personal Track" từ Dashboard sang Library page.
- [x] Dashboard AudioSanctuaryWidget → UI đơn giản (chỉ còn URL input).
- [x] Fix `ensureProfile` — tự tạo profile khi Google OAuth login.
- [x] Fix silent error trong `addTrack` → hiện lỗi rõ ràng cho user.
- [x] Push code lên Git.
- [ ] Viết Vitest unit tests cho `useTimerStore`.
- [ ] Performance Analytics (`analytics.vue`) — verify chart data từ `pomo_sessions`.
- [ ] Deploy lên Vercel/Netlify với env vars.

---

## 2. Kiến trúc & Công nghệ (Architecture)

| Layer | Tech | Ghi chú |
| :--- | :--- | :--- |
| **Framework** | Nuxt 4 | Tất cả source trong `app/` |
| **Styling** | Tailwind CSS 3 | Config quét `./app/**/*.vue` |
| **State** | Pinia + `@vueuse/nuxt` | `useLocalStorage` cho persist |
| **Backend** | Supabase (PostgreSQL) | Auth + Realtime Sync |
| **Icons** | Material Symbols Outlined | 20px / 24px fixed |
| **Design** | "Deep Focus Sanctuary" | Glassmorphism + Ghost Border |

### Cấu hình Supabase (`.env`)
```
SUPABASE_URL=https://[project].supabase.co
SUPABASE_KEY=[anon-public-key]
```

### Schema DB (tóm tắt)
- `profiles(id, email, display_name, avatar_url)` — FK → `auth.users`
- `user_settings(user_id, focus_duration, yt_video_id, volume, ...)` — FK → `profiles`
- `personal_tracks(id, user_id, yt_video_id, name, genre)` — FK → `auth.users` *(đã fix)*
- `pomo_sessions(id, user_id, type, duration, created_at)`

> ⚠️ **RLS Policies:** `personal_tracks` và `profiles` đều có RLS bật. `profiles` cần cả INSERT + UPDATE policy cho mỗi user.

---

## 3. Cấu hình AI Agent (`.agents/`)

| File | Mục đích |
| :--- | :--- |
| `rules/project-rules.md` | Rules luôn hoạt động — conventions, naming, design constraints |
| `workflows/add-feature.md` | Quy trình 5 bước thêm tính năng an toàn |
| `workflows/html-to-nuxt.md` | Quy trình chuyển đổi mockup HTML → Nuxt |
| `skills/pomo-design/SKILL.md` | Design system "Deep Focus Sanctuary" |

---

## 4. Cấu trúc Thư mục Chính (Key Files)

```
app/
├── pages/
│   ├── index.vue          # Focus Dashboard
│   ├── library.vue        # Audio Sanctuary (có Add Personal Track)
│   ├── analytics.vue      # Performance Analytics
│   ├── settings.vue       # System Configuration
│   └── auth.vue           # Google OAuth login
├── components/
│   ├── audio/
│   │   ├── AudioSanctuaryWidget.vue  # Dashboard widget (URL input only)
│   │   └── ContextualPlayer.vue      # Global floating player
│   └── focus/
│       └── FocusTimerOrb.vue
├── stores/
│   ├── useAuthStore.ts    # Auth + ensureProfile()
│   ├── useTimerStore.ts   # Timer logic + pomo_sessions sync
│   ├── useAudioStore.ts   # YouTube player state
│   └── useMusicStore.ts   # Library + personal_tracks sync
└── composables/
    └── useSupabase.ts
```

---

## 5. Changelog

- **[30/03/2026]**: Refactor Settings form (Save button, explicit Supabase sync for new columns), fix ContextualPlayer auto-play bug, and add Personal Track deletion feature in Library.
- **[30/03/2026]**: Chuẩn hóa `.agents/` và `PROJECT_STATE.md` theo chuẩn Antigravity.
- **[26/03/2026]**: Fix `ensureProfile()` trong `useAuthStore` — tự tạo profiles + user_settings khi Google OAuth login. Fix foreign key `personal_tracks.user_id` → `auth.users`. Fix silent error trong `addTrack`.
- **[26/03/2026]**: Chuyển "Add Personal Track" form từ `AudioSanctuaryWidget` (Dashboard) sang `library.vue`. Dashboard widget giản lược thành URL input thuần.
- **[26/03/2026]**: Tích hợp Supabase hoàn chỉnh — Google OAuth, sync cài đặt, personal tracks lên DB, clear data khi logout.
- **[25/03/2026]**: Tích hợp âm nhạc đồng bộ với Pomodoro timer (tự play khi focus, pause khi break).
- **[23/03/2026]**: Hoàn thành toàn bộ pages (`settings.vue`, `library.vue`, `analytics.vue`, `sessions.vue`). Tích hợp `ContextualPlayer` global.

---

## 6. Các bước tiếp theo (Next Steps)

1. **Push code:** Tạo nhánh `feat/supabase-sync-integration` và push lên remote.
2. **Analytics:** Verify `analytics.vue` hiển thị đúng dữ liệu từ bảng `pomo_sessions`.
3. **Testing:** Viết Vitest tests cho `useTimerStore` (timer logic, anti-drift).
4. **Deploy:** Cấu hình env vars trên Vercel, test OAuth callback URL.
